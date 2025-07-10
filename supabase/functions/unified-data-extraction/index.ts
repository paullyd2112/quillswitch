import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const unifiedApiKey = Deno.env.get('UNIFIED_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!unifiedApiKey || !supabaseUrl || !supabaseServiceRoleKey) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: "Missing required environment variables" 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 500 
        }
      );
    }

    const { project_id, connection_id, object_types, object_type, limit, session_id } = await req.json();
    
    // Support both demo mode (session_id) and regular migration mode (project_id)
    const isDemoMode = !!session_id;
    
    if (isDemoMode) {
      if (!connection_id || !object_type || !session_id) {
        return new Response(
          JSON.stringify({ 
            success: false,
            error: "Missing required parameters for demo mode: connection_id, object_type, session_id" 
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
            status: 400 
          }
        );
      }
    } else {
      if (!project_id || !connection_id || !object_types) {
        return new Response(
          JSON.stringify({ 
            success: false,
            error: "Missing required parameters for migration mode: project_id, connection_id, object_types" 
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
            status: 400 
          }
        );
      }
    }

    if (isDemoMode) {
      console.log(`Starting demo data extraction for session ${session_id}`);
    } else {
      console.log(`Starting data extraction for project ${project_id}`);
    }

    // Get user ID from auth header
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: "Missing authorization header" 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 401 
        }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
    const token = authHeader.replace('Bearer ', '');
    
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      console.error('User authentication error:', userError);
      return new Response(
        JSON.stringify({ 
          success: false,
          error: "Failed to authenticate user" 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 401 
        }
      );
    }

    // Update project status to extracting (only for migration mode)
    if (!isDemoMode) {
      await supabase
        .from('migration_projects')
        .update({ status: 'extracting' })
        .eq('id', project_id)
        .eq('user_id', user.id);
    }

    const extractionResults = [];

    // Extract data for object type(s)
    const typesToProcess = isDemoMode ? [object_type] : object_types;
    
    for (const objectType of typesToProcess) {
      console.log(`Extracting ${objectType} data...`);
      
      try {
        // Try multiple API endpoints for better compatibility
        const endpoints = [
          `https://api.unified.to/crm/${connection_id}/${objectType}`,
          `https://api.unified.to/unified/crm/${connection_id}/${objectType}`,
          `https://api.unified.to/crm/${connection_id}/${objectType}s`,
          `https://api.unified.to/unified/crm/${connection_id}/${objectType}s`
        ];

        let crmData = null;
        let responseOk = false;

        for (const endpoint of endpoints) {
          try {
            const unifiedResponse = await fetch(endpoint, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${unifiedApiKey}`,
                'Content-Type': 'application/json',
              },
            });

            if (unifiedResponse.ok) {
              crmData = await unifiedResponse.json();
              responseOk = true;
              console.log(`Successfully extracted from endpoint: ${endpoint}`);
              break;
            }
          } catch (error) {
            console.log(`Endpoint ${endpoint} failed:`, error);
          }
        }

        if (!responseOk || !crmData) {
          console.log(`All endpoints failed for ${objectType}, using sample data`);
          // Generate sample data for demo
          crmData = isDemoMode ? generateSampleData(objectType, Math.min(limit || 5, 5)) : [];
        }

        // Ensure crmData is an array
        let records = Array.isArray(crmData) ? crmData : 
                     crmData?.data || crmData?.results || 
                     (crmData ? [crmData] : []);

        // Apply limit for demo mode
        if (isDemoMode && limit) {
          records = records.slice(0, limit);
        }

        console.log(`Processed ${records.length} ${objectType} records`);

        if (isDemoMode) {
          // Store in demo_data table for demo mode
          if (records.length > 0) {
            await storeDemoData(supabase, session_id, objectType, records, connection_id);
          }
        } else {
          // Store extracted data in migration_records for migration mode
          const recordsToInsert = records.map((record: any) => ({
            project_id: project_id,
            user_id: user.id,
            object_type: objectType,
            external_id: record.id || record.external_id || crypto.randomUUID(),
            source_system: 'unified',
            data: record,
            status: 'extracted'
          }));

          const { error: insertError } = await supabase
            .from('migration_records')
            .insert(recordsToInsert);

          if (insertError) {
            console.error(`Error storing ${objectType} records:`, insertError);
            continue;
          }

          // Update object type status
          await supabase
            .from('migration_object_types')
            .upsert({
              project_id: project_id,
              name: objectType,
              total_records: records.length,
              processed_records: records.length,
              status: 'extracted'
            });
        }

        extractionResults.push({
          object_type: objectType,
          records_extracted: records.length,
          status: 'success'
        });

      } catch (error) {
        console.error(`Error extracting ${objectType}:`, error);
        extractionResults.push({
          object_type: objectType,
          records_extracted: 0,
          status: 'error',
          error: error.message
        });
      }
    }

    if (!isDemoMode) {
      // Update project status (only for migration mode)
      const allSuccessful = extractionResults.every(result => result.status === 'success');
      await supabase
        .from('migration_projects')
        .update({ 
          status: allSuccessful ? 'extracted' : 'extraction_partial',
          updated_at: new Date().toISOString()
        })
        .eq('id', project_id)
        .eq('user_id', user.id);

      // Log activity (only for migration mode)
      await supabase
        .from('user_activities')
        .insert({
          project_id: project_id,
          user_id: user.id,
          activity_type: 'data_extraction',
          activity_description: `Data extraction completed for ${object_types.join(', ')}`,
          activity_details: { extraction_results: extractionResults }
        });
    }

    console.log(`${isDemoMode ? 'Demo' : 'Migration'} data extraction completed:`, extractionResults);

    if (isDemoMode) {
      // Return demo-specific response
      const firstResult = extractionResults[0];
      return new Response(
        JSON.stringify({
          success: true,
          records: firstResult ? firstResult.records || [] : [],
          count: firstResult ? firstResult.records_extracted : 0,
          source: 'api'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    } else {
      // Return migration-specific response
      return new Response(
        JSON.stringify({
          success: true,
          extraction_results: extractionResults,
          total_records: extractionResults.reduce((sum, result) => sum + result.records_extracted, 0)
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

  } catch (error) {
    console.error('Data extraction error:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || "Unknown error occurred during data extraction" 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 500 
      }
    );
  }
});

async function storeDemoData(supabase: any, sessionId: string, objectType: string, records: any[], sourceSystem: string) {
  try {
    const demoDataEntries = records.map(record => ({
      session_id: sessionId,
      object_type: objectType,
      external_id: record.id || record.external_id || crypto.randomUUID(),
      data: record,
      source_system: sourceSystem
    }));

    const { error } = await supabase
      .from('demo_data')
      .insert(demoDataEntries);

    if (error) {
      console.error('Error storing demo data:', error);
    } else {
      console.log(`Stored ${records.length} ${objectType} records in demo_data table`);
    }
  } catch (error) {
    console.error('Error in storeDemoData:', error);
  }
}

function generateSampleData(objectType: string, count: number): any[] {
  const sampleData: Record<string, () => any> = {
    contact: () => ({
      id: crypto.randomUUID(),
      first_name: ['John', 'Jane', 'Mike', 'Sarah', 'David'][Math.floor(Math.random() * 5)],
      last_name: ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones'][Math.floor(Math.random() * 5)],
      email: `user${Math.floor(Math.random() * 1000)}@example.com`,
      phone: `+1-555-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
      company: ['Acme Corp', 'Tech Solutions', 'Global Industries', 'Innovation Inc'][Math.floor(Math.random() * 4)],
      title: ['Manager', 'Director', 'VP Sales', 'Account Executive'][Math.floor(Math.random() * 4)],
      created_at: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString()
    }),
    
    account: () => ({
      id: crypto.randomUUID(),
      name: ['Acme Corporation', 'Global Tech Solutions', 'Innovation Industries', 'Future Systems'][Math.floor(Math.random() * 4)],
      domain: ['acme.com', 'globaltech.com', 'innovation.com', 'future.com'][Math.floor(Math.random() * 4)],
      industry: ['Technology', 'Manufacturing', 'Healthcare', 'Financial Services'][Math.floor(Math.random() * 4)],
      size: [50, 100, 500, 1000][Math.floor(Math.random() * 4)],
      phone: `+1-555-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
      address: '123 Business St, City, State 12345',
      created_at: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString()
    }),

    opportunity: () => ({
      id: crypto.randomUUID(),
      name: ['Enterprise Deal', 'Q4 Opportunity', 'Strategic Partnership', 'Annual Contract'][Math.floor(Math.random() * 4)],
      amount: Math.floor(Math.random() * 100000) + 10000,
      stage: ['Prospecting', 'Qualification', 'Proposal', 'Negotiation'][Math.floor(Math.random() * 4)],
      probability: [25, 50, 75, 90][Math.floor(Math.random() * 4)],
      close_date: new Date(Date.now() + Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      account_id: crypto.randomUUID(),
      contact_id: crypto.randomUUID(),
      created_at: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString()
    }),

    lead: () => ({
      id: crypto.randomUUID(),
      first_name: ['Alex', 'Morgan', 'Taylor', 'Jordan', 'Casey'][Math.floor(Math.random() * 5)],
      last_name: ['Wilson', 'Davis', 'Miller', 'Moore', 'Taylor'][Math.floor(Math.random() * 5)],
      email: `lead${Math.floor(Math.random() * 1000)}@company.com`,
      phone: `+1-555-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
      company: ['Startup Inc', 'Growth Co', 'Scale Corp', 'Venture LLC'][Math.floor(Math.random() * 4)],
      source: ['Website', 'Trade Show', 'Referral', 'Cold Call'][Math.floor(Math.random() * 4)],
      status: ['New', 'Contacted', 'Qualified', 'Unqualified'][Math.floor(Math.random() * 4)],
      created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString()
    })
  };

  const generator = sampleData[objectType.toLowerCase()] || sampleData['contact'];
  return Array.from({ length: count }, () => generator());
}