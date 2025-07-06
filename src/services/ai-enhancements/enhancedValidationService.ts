import { supabase } from '@/integrations/supabase/client';
import { ExtractedData } from '@/services/migration/extractionService';
import { deduplicationService, DuplicationResult } from './deduplicationService';
import { piiDetectionService, PIIDetectionResult } from './piiDetectionService';
import { sendMessageToGemini } from '@/services/gemini/geminiService';

export interface EnhancedValidationResult {
  recordId: string;
  overallScore: number; // 0-100
  issues: ValidationIssue[];
  duplicates: DuplicationResult[];
  piiResults: PIIDetectionResult[];
  qualityMetrics: QualityMetrics;
  recommendations: string[];
}

export interface ValidationIssue {
  type: 'missing_required' | 'invalid_format' | 'data_quality' | 'compliance' | 'duplication' | 'pii_risk';
  field: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  suggestion?: string;
  aiGenerated?: boolean;
}

export interface QualityMetrics {
  completeness: number; // % of required fields filled
  accuracy: number; // Data format correctness
  consistency: number; // Internal consistency
  compliance: number; // PII and regulatory compliance
  uniqueness: number; // Duplication score
}

export interface ValidationConfig {
  enablePIIDetection: boolean;
  enableDeduplication: boolean;
  enableAIValidation: boolean;
  strictMode: boolean;
  requiredFields: string[];
  customRules?: ValidationRule[];
}

export interface ValidationRule {
  field: string;
  type: 'regex' | 'length' | 'custom';
  rule: string | number | ((value: any) => boolean);
  message: string;
}

/**
 * Enhanced validation service with AI-powered quality assessment
 */
export class EnhancedValidationService {
  private config: ValidationConfig;

  constructor(config: ValidationConfig = {
    enablePIIDetection: true,
    enableDeduplication: true,
    enableAIValidation: true,
    strictMode: false,
    requiredFields: ['email', 'name', 'firstName', 'lastName']
  }) {
    this.config = config;
  }

  /**
   * Comprehensive validation of extracted data
   */
  async validateRecords(
    records: ExtractedData[],
    existingRecords: ExtractedData[] = [],
    onProgress?: (current: number, total: number) => void
  ): Promise<EnhancedValidationResult[]> {
    const results: EnhancedValidationResult[] = [];

    // Run PII detection on all records if enabled
    let piiResults: PIIDetectionResult[] = [];
    if (this.config.enablePIIDetection) {
      piiResults = await piiDetectionService.detectPII(records);
    }

    for (let i = 0; i < records.length; i++) {
      const record = records[i];
      const result = await this.validateSingleRecord(
        record, 
        existingRecords.concat(records.slice(0, i)), // Previous records as context
        piiResults.filter(p => this.findRecordPII(record, p))
      );
      
      results.push(result);
      
      if (onProgress) {
        onProgress(i + 1, records.length);
      }
    }

    return results;
  }

  /**
   * Validate a single record with comprehensive checks
   */
  private async validateSingleRecord(
    record: ExtractedData,
    existingRecords: ExtractedData[],
    recordPII: PIIDetectionResult[]
  ): Promise<EnhancedValidationResult> {
    const issues: ValidationIssue[] = [];
    let duplicates: DuplicationResult[] = [];

    // Basic validation
    const basicIssues = this.performBasicValidation(record);
    issues.push(...basicIssues);

    // Custom rules validation
    if (this.config.customRules) {
      const customIssues = this.performCustomValidation(record);
      issues.push(...customIssues);
    }

    // Duplication detection
    if (this.config.enableDeduplication && existingRecords.length > 0) {
      duplicates = deduplicationService.detectDuplicates(record, existingRecords);
      if (duplicates.length > 0) {
        issues.push({
          type: 'duplication',
          field: 'record',
          severity: duplicates[0].confidence > 95 ? 'critical' : 'high',
          message: `Potential duplicate record found (${duplicates[0].confidence}% confidence)`,
          suggestion: duplicates[0].reason
        });
      }
    }

    // PII compliance issues
    if (this.config.enablePIIDetection && recordPII.length > 0) {
      const piiIssues = this.generatePIIIssues(recordPII);
      issues.push(...piiIssues);
    }

    // AI-enhanced validation for complex scenarios
    if (this.config.enableAIValidation) {
      const aiIssues = await this.performAIValidation(record);
      issues.push(...aiIssues);
    }

    // Calculate quality metrics
    const qualityMetrics = this.calculateQualityMetrics(record, issues, duplicates, recordPII);

    // Calculate overall score
    const overallScore = this.calculateOverallScore(qualityMetrics, issues);

    // Generate recommendations
    const recommendations = this.generateRecommendations(issues, qualityMetrics);

    return {
      recordId: record.recordId,
      overallScore,
      issues,
      duplicates,
      piiResults: recordPII,
      qualityMetrics,
      recommendations
    };
  }

  /**
   * Basic validation checks
   */
  private performBasicValidation(record: ExtractedData): ValidationIssue[] {
    const issues: ValidationIssue[] = [];
    const fieldMap = this.fieldsToMap(record.fields);

    // Required fields check
    for (const requiredField of this.config.requiredFields) {
      if (!fieldMap[requiredField] || !String(fieldMap[requiredField]).trim()) {
        issues.push({
          type: 'missing_required',
          field: requiredField,
          severity: 'high',
          message: `Required field '${requiredField}' is missing or empty`
        });
      }
    }

    // Format validation
    for (const field of record.fields) {
      const formatIssue = this.validateFieldFormat(field.name, field.value);
      if (formatIssue) {
        issues.push(formatIssue);
      }
    }

    return issues;
  }

  /**
   * Validate field formats
   */
  private validateFieldFormat(fieldName: string, value: any): ValidationIssue | null {
    const strValue = String(value || '').trim();
    if (!strValue) return null;

    const lowerFieldName = fieldName.toLowerCase();

    // Email validation
    if (lowerFieldName.includes('email') && strValue) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(strValue)) {
        return {
          type: 'invalid_format',
          field: fieldName,
          severity: 'medium',
          message: `Invalid email format: ${strValue}`,
          suggestion: 'Verify email address format'
        };
      }
    }

    // Phone validation
    if ((lowerFieldName.includes('phone') || lowerFieldName.includes('tel')) && strValue) {
      const phoneRegex = /^[\+]?[\s\d\-\(\)]{10,}$/;
      if (!phoneRegex.test(strValue)) {
        return {
          type: 'invalid_format',
          field: fieldName,
          severity: 'medium',
          message: `Invalid phone format: ${strValue}`,
          suggestion: 'Use standard phone number format'
        };
      }
    }

    // Date validation
    if (lowerFieldName.includes('date') && strValue) {
      const date = new Date(strValue);
      if (isNaN(date.getTime())) {
        return {
          type: 'invalid_format',
          field: fieldName,
          severity: 'medium',
          message: `Invalid date format: ${strValue}`,
          suggestion: 'Use ISO date format (YYYY-MM-DD)'
        };
      }
    }

    return null;
  }

  /**
   * Custom rules validation
   */
  private performCustomValidation(record: ExtractedData): ValidationIssue[] {
    const issues: ValidationIssue[] = [];
    const fieldMap = this.fieldsToMap(record.fields);

    for (const rule of this.config.customRules!) {
      const value = fieldMap[rule.field];
      let isValid = true;

      switch (rule.type) {
        case 'regex':
          if (value && typeof rule.rule === 'string') {
            const regex = new RegExp(rule.rule);
            isValid = regex.test(String(value));
          }
          break;
        case 'length':
          if (value && typeof rule.rule === 'number') {
            isValid = String(value).length >= rule.rule;
          }
          break;
        case 'custom':
          if (typeof rule.rule === 'function') {
            isValid = rule.rule(value);
          }
          break;
      }

      if (!isValid) {
        issues.push({
          type: 'data_quality',
          field: rule.field,
          severity: 'medium',
          message: rule.message
        });
      }
    }

    return issues;
  }

  /**
   * AI-enhanced validation using Gemini
   */
  private async performAIValidation(record: ExtractedData): Promise<ValidationIssue[]> {
    try {
      const fieldData = record.fields.map(f => `${f.name}: ${f.value}`).join('\n');
      
      const prompt = `Analyze this CRM record for data quality issues:

Record Type: ${record.objectType}
Source: ${record.sourceSystem}
Fields:
${fieldData}

Look for:
1. Inconsistent data patterns
2. Unusual values that might be errors
3. Missing context or relationships
4. Business logic violations

Respond with JSON array of issues:
[
  {
    "field": "field_name",
    "issue": "description",
    "severity": "low|medium|high",
    "suggestion": "how to fix"
  }
]

Only report genuine issues, not formatting preferences.`;

      const response = await sendMessageToGemini([
        { role: 'user', content: prompt }
      ]);

      if (response.response) {
        try {
          const aiIssues = JSON.parse(response.response);
          return aiIssues.map((issue: any) => ({
            type: 'data_quality' as const,
            field: issue.field,
            severity: issue.severity || 'medium',
            message: issue.issue,
            suggestion: issue.suggestion,
            aiGenerated: true
          }));
        } catch (parseError) {
          console.warn('Failed to parse AI validation results:', parseError);
        }
      }
    } catch (error) {
      console.warn('AI validation failed:', error);
    }

    return [];
  }

  /**
   * Generate PII-related issues
   */
  private generatePIIIssues(piiResults: PIIDetectionResult[]): ValidationIssue[] {
    return piiResults
      .filter(pii => pii.confidence >= 70)
      .map(pii => ({
        type: 'pii_risk' as const,
        field: pii.fieldName,
        severity: pii.confidence >= 90 ? 'critical' : 'high' as const,
        message: `PII detected: ${pii.piiTypes.map(p => p.type).join(', ')}`,
        suggestion: pii.suggestion
      }));
  }

  /**
   * Calculate quality metrics
   */
  private calculateQualityMetrics(
    record: ExtractedData,
    issues: ValidationIssue[],
    duplicates: DuplicationResult[],
    piiResults: PIIDetectionResult[]
  ): QualityMetrics {
    const fieldMap = this.fieldsToMap(record.fields);
    const totalFields = record.fields.length;
    const filledFields = record.fields.filter(f => f.value && String(f.value).trim()).length;

    // Completeness: % of fields with data
    const completeness = totalFields > 0 ? (filledFields / totalFields) * 100 : 0;

    // Accuracy: Based on format validation issues
    const formatIssues = issues.filter(i => i.type === 'invalid_format');
    const accuracy = Math.max(0, 100 - (formatIssues.length / totalFields) * 100);

    // Consistency: Based on data quality issues
    const qualityIssues = issues.filter(i => i.type === 'data_quality');
    const consistency = Math.max(0, 100 - (qualityIssues.length / totalFields) * 50);

    // Compliance: Based on PII and compliance issues
    const complianceIssues = issues.filter(i => i.type === 'compliance' || i.type === 'pii_risk');
    const compliance = complianceIssues.length === 0 ? 100 : Math.max(0, 100 - complianceIssues.length * 25);

    // Uniqueness: Based on duplication confidence
    const uniqueness = duplicates.length > 0 ? Math.max(0, 100 - duplicates[0].confidence) : 100;

    return {
      completeness: Math.round(completeness),
      accuracy: Math.round(accuracy),
      consistency: Math.round(consistency),
      compliance: Math.round(compliance),
      uniqueness: Math.round(uniqueness)
    };
  }

  /**
   * Calculate overall quality score
   */
  private calculateOverallScore(metrics: QualityMetrics, issues: ValidationIssue[]): number {
    const weights = {
      completeness: 0.2,
      accuracy: 0.25,
      consistency: 0.2,
      compliance: 0.2,
      uniqueness: 0.15
    };

    let baseScore = 
      metrics.completeness * weights.completeness +
      metrics.accuracy * weights.accuracy +
      metrics.consistency * weights.consistency +
      metrics.compliance * weights.compliance +
      metrics.uniqueness * weights.uniqueness;

    // Apply penalties for critical issues
    const criticalIssues = issues.filter(i => i.severity === 'critical');
    const highIssues = issues.filter(i => i.severity === 'high');

    baseScore -= criticalIssues.length * 15;
    baseScore -= highIssues.length * 8;

    return Math.max(0, Math.round(baseScore));
  }

  /**
   * Generate actionable recommendations
   */
  private generateRecommendations(issues: ValidationIssue[], metrics: QualityMetrics): string[] {
    const recommendations: string[] = [];

    // Critical issues first
    const criticalIssues = issues.filter(i => i.severity === 'critical');
    if (criticalIssues.length > 0) {
      recommendations.push(`Address ${criticalIssues.length} critical issues immediately`);
    }

    // PII recommendations
    const piiIssues = issues.filter(i => i.type === 'pii_risk');
    if (piiIssues.length > 0) {
      recommendations.push('Implement PII masking or encryption for compliance');
    }

    // Duplication recommendations
    const dupIssues = issues.filter(i => i.type === 'duplication');
    if (dupIssues.length > 0) {
      recommendations.push('Review and merge duplicate records');
    }

    // Quality improvements
    if (metrics.completeness < 80) {
      recommendations.push('Improve data completeness by filling missing required fields');
    }

    if (metrics.accuracy < 80) {
      recommendations.push('Fix data format issues to improve accuracy');
    }

    if (metrics.consistency < 80) {
      recommendations.push('Standardize data entry processes for better consistency');
    }

    return recommendations;
  }

  /**
   * Helper methods
   */
  private fieldsToMap(fields: any[]): Record<string, any> {
    const map: Record<string, any> = {};
    for (const field of fields) {
      map[field.name] = field.value;
    }
    return map;
  }

  private findRecordPII(record: ExtractedData, pii: PIIDetectionResult): boolean {
    return record.fields.some(f => f.name === pii.fieldName);
  }

  /**
   * Save validation results to database
   */
  async saveValidationResults(
    jobId: string,
    results: EnhancedValidationResult[]
  ): Promise<void> {
    try {
      // Save issues to validation_issues table
      const issues = results.flatMap(result => 
        result.issues.map((issue, index) => ({
          job_id: jobId,
          record_index: parseInt(result.recordId.split('-').pop() || '0'),
          field_name: issue.field,
          error_type: issue.type,
          error_message: issue.message,
          raw_value: null, // Would need to be passed in
          suggestion: issue.suggestion || null
        }))
      );

      if (issues.length > 0) {
        const { error } = await supabase
          .from('validation_issues')
          .insert(issues);

        if (error) {
          console.error('Failed to save validation issues:', error);
        }
      }

      console.log(`Saved ${issues.length} validation issues for job ${jobId}`);
    } catch (error) {
      console.error('Error saving validation results:', error);
    }
  }
}

export const enhancedValidationService = new EnhancedValidationService();