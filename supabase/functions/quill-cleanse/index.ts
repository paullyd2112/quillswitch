import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CleansingRequest {
  sourceData: any[];
  targetData?: any[];
  confidenceThreshold: number;
  migrationProjectId?: string;
  userRules?: any[];
}

interface MatchResult {
  sourceRecordId: string;
  targetRecordId?: string;
  sourceRecordData: any;
  targetRecordData?: any;
  confidenceScore: number;
  matchType: 'exact' | 'fuzzy' | 'phonetic' | 'semantic';
  conflictFields: string[];
  suggestedAction: 'merge' | 'overwrite' | 'keep_both' | 'skip';
  reconciliationStrategy: any;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    // Get user from JWT token
    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (authError || !user) {
      throw new Error('Invalid authentication');
    }

    const { 
      sourceData, 
      targetData = [], 
      confidenceThreshold = 0.75,
      migrationProjectId,
      userRules = []
    }: CleansingRequest = await req.json();

    console.log(`Starting QuillCleanse for user ${user.id}`);
    console.log(`Processing ${sourceData.length} source records against ${targetData.length} target records`);

    // Create cleansing job
    const { data: cleansingJob, error: jobError } = await supabase
      .from('cleansing_jobs')
      .insert({
        user_id: user.id,
        migration_project_id: migrationProjectId,
        source_data: sourceData,
        target_data: targetData,
        total_records: sourceData.length,
        confidence_threshold: confidenceThreshold,
        status: 'processing'
      })
      .select()
      .single();

    if (jobError) {
      throw new Error(`Failed to create cleansing job: ${jobError.message}`);
    }

    const matches: MatchResult[] = [];
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

    // Process each source record
    for (let i = 0; i < sourceData.length; i++) {
      const sourceRecord = sourceData[i];
      const sourceId = sourceRecord.id || `source_${i}`;

      console.log(`Processing record ${i + 1}/${sourceData.length}: ${sourceId}`);

      // Update progress
      await supabase
        .from('cleansing_jobs')
        .update({ processed_records: i + 1 })
        .eq('id', cleansingJob.id);

      // Find potential matches in target data
      const potentialMatches = await findPotentialMatches(
        sourceRecord, 
        targetData, 
        geminiApiKey,
        userRules
      );

      // Process each potential match
      for (const match of potentialMatches) {
        if (match.confidenceScore >= confidenceThreshold) {
          matches.push(match);

          // Store in database
          await supabase
            .from('duplicate_matches')
            .insert({
              cleansing_job_id: cleansingJob.id,
              source_record_id: match.sourceRecordId,
              target_record_id: match.targetRecordId,
              source_record_data: match.sourceRecordData,
              target_record_data: match.targetRecordData,
              confidence_score: match.confidenceScore,
              match_type: match.matchType,
              conflict_fields: match.conflictFields,
              suggested_action: match.suggestedAction,
              reconciliation_strategy: match.reconciliationStrategy
            });
        }
      }
    }

    // Update job status and results
    await supabase
      .from('cleansing_jobs')
      .update({
        status: 'completed',
        duplicates_found: matches.length,
        completed_at: new Date().toISOString()
      })
      .eq('id', cleansingJob.id);

    // Generate summary report
    const summary = {
      totalRecords: sourceData.length,
      duplicatesFound: matches.length,
      highConfidenceMatches: matches.filter(m => m.confidenceScore >= 0.9).length,
      mediumConfidenceMatches: matches.filter(m => m.confidenceScore >= 0.75 && m.confidenceScore < 0.9).length,
      exactMatches: matches.filter(m => m.matchType === 'exact').length,
      fuzzyMatches: matches.filter(m => m.matchType === 'fuzzy').length,
      phoneticMatches: matches.filter(m => m.matchType === 'phonetic').length,
      semanticMatches: matches.filter(m => m.matchType === 'semantic').length
    };

    await supabase
      .from('cleansing_reports')
      .insert({
        cleansing_job_id: cleansingJob.id,
        report_type: 'summary',
        report_data: summary
      });

    console.log(`QuillCleanse completed: ${matches.length} duplicates found`);

    return new Response(JSON.stringify({
      success: true,
      jobId: cleansingJob.id,
      summary,
      matches: matches.slice(0, 10) // Return first 10 matches in response
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('QuillCleanse error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

async function findPotentialMatches(
  sourceRecord: any,
  targetData: any[],
  geminiApiKey?: string,
  userRules: any[] = []
): Promise<MatchResult[]> {
  const matches: MatchResult[] = [];
  const sourceId = sourceRecord.id || 'unknown';

  for (let j = 0; j < targetData.length; j++) {
    const targetRecord = targetData[j];
    const targetId = targetRecord.id || `target_${j}`;

    // 1. Exact match detection
    const exactMatch = checkExactMatch(sourceRecord, targetRecord);
    if (exactMatch.isMatch) {
      matches.push({
        sourceRecordId: sourceId,
        targetRecordId: targetId,
        sourceRecordData: sourceRecord,
        targetRecordData: targetRecord,
        confidenceScore: 1.0,
        matchType: 'exact',
        conflictFields: exactMatch.conflictFields,
        suggestedAction: exactMatch.conflictFields.length > 0 ? 'merge' : 'skip',
        reconciliationStrategy: {
          type: 'exact_match',
          conflicts: exactMatch.conflictFields
        }
      });
      continue;
    }

    // 2. Fuzzy matching for names and text fields
    const fuzzyMatch = checkFuzzyMatch(sourceRecord, targetRecord);
    if (fuzzyMatch.score >= 0.7) {
      matches.push({
        sourceRecordId: sourceId,
        targetRecordId: targetId,
        sourceRecordData: sourceRecord,
        targetRecordData: targetRecord,
        confidenceScore: fuzzyMatch.score,
        matchType: 'fuzzy',
        conflictFields: fuzzyMatch.conflictFields,
        suggestedAction: determineSuggestedAction(fuzzyMatch.score, fuzzyMatch.conflictFields),
        reconciliationStrategy: {
          type: 'fuzzy_match',
          matchedFields: fuzzyMatch.matchedFields,
          score: fuzzyMatch.score
        }
      });
      continue;
    }

    // 3. Phonetic matching for names
    const phoneticMatch = checkPhoneticMatch(sourceRecord, targetRecord);
    if (phoneticMatch.score >= 0.8) {
      matches.push({
        sourceRecordId: sourceId,
        targetRecordId: targetId,
        sourceRecordData: sourceRecord,
        targetRecordData: targetRecord,
        confidenceScore: phoneticMatch.score,
        matchType: 'phonetic',
        conflictFields: phoneticMatch.conflictFields,
        suggestedAction: determineSuggestedAction(phoneticMatch.score, phoneticMatch.conflictFields),
        reconciliationStrategy: {
          type: 'phonetic_match',
          matchedFields: phoneticMatch.matchedFields
        }
      });
      continue;
    }

    // 4. AI-powered semantic matching (if Gemini key available)
    if (geminiApiKey) {
      try {
        const semanticMatch = await checkSemanticMatch(sourceRecord, targetRecord, geminiApiKey);
        if (semanticMatch.score >= 0.75) {
          matches.push({
            sourceRecordId: sourceId,
            targetRecordId: targetId,
            sourceRecordData: sourceRecord,
            targetRecordData: targetRecord,
            confidenceScore: semanticMatch.score,
            matchType: 'semantic',
            conflictFields: semanticMatch.conflictFields,
            suggestedAction: determineSuggestedAction(semanticMatch.score, semanticMatch.conflictFields),
            reconciliationStrategy: {
              type: 'semantic_match',
              reasoning: semanticMatch.reasoning,
              confidence: semanticMatch.score
            }
          });
        }
      } catch (error) {
        console.warn('Semantic matching failed:', error.message);
      }
    }
  }

  return matches;
}

function checkExactMatch(source: any, target: any): { isMatch: boolean; conflictFields: string[] } {
  const conflictFields: string[] = [];
  
  // Check for exact matches on key identifier fields
  const keyFields = ['email', 'phone', 'external_id', 'account_id'];
  let hasExactMatch = false;

  for (const field of keyFields) {
    if (source[field] && target[field]) {
      if (source[field].toString().toLowerCase() === target[field].toString().toLowerCase()) {
        hasExactMatch = true;
      } else {
        conflictFields.push(field);
      }
    }
  }

  return { isMatch: hasExactMatch, conflictFields };
}

function checkFuzzyMatch(source: any, target: any): { score: number; conflictFields: string[]; matchedFields: string[] } {
  const textFields = ['name', 'first_name', 'last_name', 'company', 'title', 'address'];
  const conflictFields: string[] = [];
  const matchedFields: string[] = [];
  let totalScore = 0;
  let fieldCount = 0;

  for (const field of textFields) {
    if (source[field] && target[field]) {
      const similarity = calculateLevenshteinSimilarity(
        source[field].toString().toLowerCase(),
        target[field].toString().toLowerCase()
      );
      
      if (similarity >= 0.8) {
        matchedFields.push(field);
        totalScore += similarity;
      } else if (similarity < 0.5) {
        conflictFields.push(field);
      }
      
      fieldCount++;
    }
  }

  const averageScore = fieldCount > 0 ? totalScore / fieldCount : 0;
  return { score: averageScore, conflictFields, matchedFields };
}

function checkPhoneticMatch(source: any, target: any): { score: number; conflictFields: string[]; matchedFields: string[] } {
  const nameFields = ['name', 'first_name', 'last_name'];
  const conflictFields: string[] = [];
  const matchedFields: string[] = [];
  let totalScore = 0;
  let fieldCount = 0;

  for (const field of nameFields) {
    if (source[field] && target[field]) {
      const sourcePhonetic = generatePhoneticCode(source[field].toString());
      const targetPhonetic = generatePhoneticCode(target[field].toString());
      
      if (sourcePhonetic === targetPhonetic) {
        matchedFields.push(field);
        totalScore += 1.0;
      } else {
        conflictFields.push(field);
      }
      fieldCount++;
    }
  }

  const averageScore = fieldCount > 0 ? totalScore / fieldCount : 0;
  return { score: averageScore, conflictFields, matchedFields };
}

async function checkSemanticMatch(source: any, target: any, apiKey: string): Promise<{ score: number; conflictFields: string[]; reasoning: string }> {
  const prompt = `
Analyze these two CRM records and determine if they represent the same entity (person or company).
Consider variations in names, titles, contact information, and other identifying details.

Record 1: ${JSON.stringify(source, null, 2)}
Record 2: ${JSON.stringify(target, null, 2)}

Provide your analysis in the following JSON format:
{
  "isMatch": boolean,
  "confidence": number (0.0 to 1.0),
  "reasoning": "explanation of your decision",
  "conflictFields": ["list", "of", "conflicting", "fields"]
}
`;

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 500
      }
    }),
  });

  if (!response.ok) {
    throw new Error('Gemini API request failed');
  }

  const data = await response.json();
  const content = data.candidates[0].content.parts[0].text;
  
  try {
    const analysis = JSON.parse(content);
    return {
      score: analysis.isMatch ? analysis.confidence : 0,
      conflictFields: analysis.conflictFields || [],
      reasoning: analysis.reasoning
    };
  } catch (error) {
    throw new Error('Failed to parse AI analysis response');
  }
}

function determineSuggestedAction(score: number, conflictFields: string[]): 'merge' | 'overwrite' | 'keep_both' | 'skip' {
  if (score >= 0.95) {
    return conflictFields.length === 0 ? 'skip' : 'merge';
  } else if (score >= 0.85) {
    return 'merge';
  } else if (score >= 0.75) {
    return conflictFields.length > 3 ? 'keep_both' : 'merge';
  } else {
    return 'keep_both';
  }
}

function calculateLevenshteinSimilarity(str1: string, str2: string): number {
  const maxLength = Math.max(str1.length, str2.length);
  if (maxLength === 0) return 1.0;
  
  const distance = levenshteinDistance(str1, str2);
  return (maxLength - distance) / maxLength;
}

function levenshteinDistance(str1: string, str2: string): number {
  const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));

  for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;

  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] + indicator
      );
    }
  }

  return matrix[str2.length][str1.length];
}

function generatePhoneticCode(name: string): string {
  // Simple Soundex-like algorithm
  const cleaned = name.toUpperCase().replace(/[^A-Z]/g, '');
  if (!cleaned) return '';
  
  let code = cleaned[0];
  let previous = getSoundexCode(cleaned[0]);
  
  for (let i = 1; i < cleaned.length && code.length < 4; i++) {
    const current = getSoundexCode(cleaned[i]);
    if (current !== '0' && current !== previous) {
      code += current;
    }
    previous = current;
  }
  
  return code.padEnd(4, '0').substring(0, 4);
}

function getSoundexCode(char: string): string {
  const mapping: { [key: string]: string } = {
    'B': '1', 'F': '1', 'P': '1', 'V': '1',
    'C': '2', 'G': '2', 'J': '2', 'K': '2', 'Q': '2', 'S': '2', 'X': '2', 'Z': '2',
    'D': '3', 'T': '3',
    'L': '4',
    'M': '5', 'N': '5',
    'R': '6'
  };
  return mapping[char] || '0';
}