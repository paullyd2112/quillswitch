import { supabase } from '@/integrations/supabase/client';
import { sendMessageToGemini } from '@/services/gemini/geminiService';

export interface ErrorPrediction {
  errorType: string;
  probability: number; // 0-1
  affectedFields: string[];
  reasoning: string;
  preventionSuggestions: string[];
  historicalData: HistoricalError[];
}

export interface HistoricalError {
  projectId: string;
  objectType: string;
  errorType: string;
  errorMessage: string;
  frequency: number;
  lastOccurrence: Date;
  resolution?: string;
}

export interface MigrationContext {
  sourceSystem: string;
  destinationSystem: string;
  objectType: string;
  recordCount: number;
  fieldMappings: Array<{
    source: string;
    destination: string;
    transformation?: string;
  }>;
}

/**
 * Predictive error detection service using historical data and AI
 */
export class PredictiveErrorService {
  /**
   * Predict potential errors for an upcoming migration
   */
  async predictErrors(context: MigrationContext): Promise<ErrorPrediction[]> {
    const predictions: ErrorPrediction[] = [];

    // Get historical error data
    const historicalErrors = await this.getHistoricalErrors(context);

    // Pattern-based predictions
    const patternPredictions = await this.predictFromPatterns(context, historicalErrors);
    predictions.push(...patternPredictions);

    // AI-enhanced predictions
    const aiPredictions = await this.predictWithAI(context, historicalErrors);
    predictions.push(...aiPredictions);

    // Sort by probability (highest first)
    return predictions
      .sort((a, b) => b.probability - a.probability)
      .slice(0, 10); // Return top 10 predictions
  }

  /**
   * Get historical error data from the database
   */
  private async getHistoricalErrors(context: MigrationContext): Promise<HistoricalError[]> {
    try {
      // Query migration_errors for similar migrations
      const { data: errors, error } = await supabase
        .from('migration_errors')
        .select(`
          project_id,
          error_type,
          error_message,
          created_at,
          resolution_notes,
          migration_projects!inner(
            source_crm,
            destination_crm
          ),
          migration_object_types!inner(
            name
          )
        `)
        .eq('migration_projects.source_crm', context.sourceSystem)
        .eq('migration_projects.destination_crm', context.destinationSystem)
        .eq('migration_object_types.name', context.objectType)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) {
        console.error('Error fetching historical errors:', error);
        return [];
      }

      // Aggregate errors by type
      const errorMap = new Map<string, HistoricalError>();
      
      for (const error of errors || []) {
        const key = `${error.error_type}-${error.error_message}`;
        if (errorMap.has(key)) {
          const existing = errorMap.get(key)!;
          existing.frequency++;
          existing.lastOccurrence = new Date(Math.max(
            existing.lastOccurrence.getTime(),
            new Date(error.created_at).getTime()
          ));
        } else {
          errorMap.set(key, {
            projectId: error.project_id,
            objectType: context.objectType,
            errorType: error.error_type,
            errorMessage: error.error_message,
            frequency: 1,
            lastOccurrence: new Date(error.created_at),
            resolution: error.resolution_notes || undefined
          });
        }
      }

      return Array.from(errorMap.values());
    } catch (error) {
      console.error('Failed to fetch historical errors:', error);
      return [];
    }
  }

  /**
   * Predict errors based on historical patterns
   */
  private async predictFromPatterns(
    context: MigrationContext,
    historicalErrors: HistoricalError[]
  ): Promise<ErrorPrediction[]> {
    const predictions: ErrorPrediction[] = [];

    // Analyze common error patterns
    const errorFrequency = new Map<string, number>();
    const totalErrors = historicalErrors.length;

    for (const error of historicalErrors) {
      const count = errorFrequency.get(error.errorType) || 0;
      errorFrequency.set(error.errorType, count + error.frequency);
    }

    // Generate predictions based on frequency
    for (const [errorType, frequency] of errorFrequency.entries()) {
      const probability = totalErrors > 0 ? frequency / totalErrors : 0;
      
      if (probability >= 0.1) { // Only predict errors with 10%+ probability
        const relatedErrors = historicalErrors.filter(e => e.errorType === errorType);
        const affectedFields = this.extractAffectedFields(relatedErrors, context);

        predictions.push({
          errorType,
          probability,
          affectedFields,
          reasoning: `This error occurred in ${frequency} out of ${totalErrors} similar migrations (${Math.round(probability * 100)}% frequency)`,
          preventionSuggestions: this.generatePreventionSuggestions(errorType, relatedErrors),
          historicalData: relatedErrors
        });
      }
    }

    // System-specific patterns
    const systemPredictions = this.predictSystemSpecificErrors(context);
    predictions.push(...systemPredictions);

    return predictions;
  }

  /**
   * Predict system-specific common errors
   */
  private predictSystemSpecificErrors(context: MigrationContext): ErrorPrediction[] {
    const predictions: ErrorPrediction[] = [];

    // Salesforce-specific predictions
    if (context.sourceSystem.toLowerCase().includes('salesforce')) {
      predictions.push({
        errorType: 'field_length_exceeded',
        probability: 0.3,
        affectedFields: ['description', 'comments', 'notes'],
        reasoning: 'Salesforce has longer text field limits than most destination systems',
        preventionSuggestions: [
          'Validate field lengths before migration',
          'Implement text truncation with warning',
          'Consider splitting long text into multiple fields'
        ],
        historicalData: []
      });

      predictions.push({
        errorType: 'picklist_value_mismatch',
        probability: 0.4,
        affectedFields: ['stage', 'status', 'priority'],
        reasoning: 'Salesforce picklist values often need mapping to destination system',
        preventionSuggestions: [
          'Create comprehensive picklist value mappings',
          'Implement fallback values for unmapped options',
          'Review all picklist fields before migration'
        ],
        historicalData: []
      });
    }

    // HubSpot-specific predictions
    if (context.sourceSystem.toLowerCase().includes('hubspot')) {
      predictions.push({
        errorType: 'custom_property_mapping',
        probability: 0.25,
        affectedFields: ['custom properties'],
        reasoning: 'HubSpot custom properties may not have direct equivalents in destination',
        preventionSuggestions: [
          'Map custom properties to standard fields where possible',
          'Create custom fields in destination system if needed',
          'Document unmappable properties for manual handling'
        ],
        historicalData: []
      });
    }

    // Large dataset predictions
    if (context.recordCount > 10000) {
      predictions.push({
        errorType: 'rate_limit_exceeded',
        probability: 0.6,
        affectedFields: ['all'],
        reasoning: 'Large migrations often hit API rate limits',
        preventionSuggestions: [
          'Implement intelligent rate limiting',
          'Use batch processing with appropriate delays',
          'Monitor API usage during migration'
        ],
        historicalData: []
      });
    }

    return predictions;
  }

  /**
   * AI-enhanced error prediction
   */
  private async predictWithAI(
    context: MigrationContext,
    historicalErrors: HistoricalError[]
  ): Promise<ErrorPrediction[]> {
    try {
      const errorSummary = historicalErrors
        .slice(0, 20) // Limit for prompt size
        .map(e => `${e.errorType}: ${e.errorMessage} (occurred ${e.frequency} times)`)
        .join('\n');

      const prompt = `Analyze this CRM migration scenario and predict potential errors:

Migration Context:
- Source: ${context.sourceSystem}
- Destination: ${context.destinationSystem}
- Object Type: ${context.objectType}
- Record Count: ${context.recordCount}
- Field Mappings: ${context.fieldMappings.length} mappings

Historical Errors in Similar Migrations:
${errorSummary || 'No historical data available'}

Field Mappings:
${context.fieldMappings.map(m => `${m.source} -> ${m.destination}${m.transformation ? ' (transformed)' : ''}`).join('\n')}

Predict potential errors and respond with JSON array:
[
  {
    "errorType": "error_category",
    "probability": 0.0-1.0,
    "affectedFields": ["field1", "field2"],
    "reasoning": "explanation",
    "preventionSuggestions": ["suggestion1", "suggestion2"]
  }
]

Focus on realistic, actionable predictions based on the data provided.`;

      const response = await sendMessageToGemini([
        { role: 'user', content: prompt }
      ]);

      if (response.response) {
        try {
          const aiPredictions = JSON.parse(response.response);
          return aiPredictions.map((pred: any) => ({
            errorType: pred.errorType,
            probability: Math.min(1, Math.max(0, pred.probability)),
            affectedFields: pred.affectedFields || [],
            reasoning: pred.reasoning,
            preventionSuggestions: pred.preventionSuggestions || [],
            historicalData: []
          }));
        } catch (parseError) {
          console.warn('Failed to parse AI error predictions:', parseError);
        }
      }
    } catch (error) {
      console.warn('AI error prediction failed:', error);
    }

    return [];
  }

  /**
   * Extract fields likely to be affected by specific error types
   */
  private extractAffectedFields(
    errors: HistoricalError[],
    context: MigrationContext
  ): string[] {
    const fields = new Set<string>();

    // Extract field names from error messages
    for (const error of errors) {
      const message = error.errorMessage.toLowerCase();
      
      // Look for field references in error messages
      const fieldMatches = message.match(/field[:\s]+['"`]?(\w+)['"`]?/gi);
      if (fieldMatches) {
        fieldMatches.forEach(match => {
          const fieldName = match.replace(/field[:\s]+['"`]?/i, '').replace(/['"`]/g, '');
          fields.add(fieldName);
        });
      }

      // Look for mapped fields that might be affected
      for (const mapping of context.fieldMappings) {
        if (message.includes(mapping.source.toLowerCase()) || 
            message.includes(mapping.destination.toLowerCase())) {
          fields.add(mapping.source);
          fields.add(mapping.destination);
        }
      }
    }

    return Array.from(fields);
  }

  /**
   * Generate prevention suggestions based on error type and history
   */
  private generatePreventionSuggestions(
    errorType: string,
    errors: HistoricalError[]
  ): string[] {
    const suggestions: string[] = [];

    // Generic suggestions based on error type
    switch (errorType.toLowerCase()) {
      case 'validation_error':
        suggestions.push('Implement pre-migration data validation');
        suggestions.push('Set up data quality checks');
        break;
      case 'field_mapping_error':
        suggestions.push('Review and test all field mappings');
        suggestions.push('Implement fallback values for unmapped fields');
        break;
      case 'rate_limit_exceeded':
        suggestions.push('Implement intelligent rate limiting');
        suggestions.push('Use batch processing with delays');
        break;
      case 'authentication_error':
        suggestions.push('Verify API credentials before migration');
        suggestions.push('Implement credential refresh mechanisms');
        break;
      default:
        suggestions.push('Review similar historical errors for patterns');
        suggestions.push('Implement additional validation for this error type');
    }

    // Add suggestions based on successful resolutions
    const resolvedErrors = errors.filter(e => e.resolution);
    for (const error of resolvedErrors) {
      if (error.resolution && !suggestions.includes(error.resolution)) {
        suggestions.push(error.resolution);
      }
    }

    return suggestions;
  }

  /**
   * Create a migration risk assessment report
   */
  async generateRiskAssessment(context: MigrationContext): Promise<{
    overallRisk: 'low' | 'medium' | 'high' | 'critical';
    riskScore: number; // 0-100
    predictions: ErrorPrediction[];
    recommendations: string[];
    estimatedFailureRate: number;
  }> {
    const predictions = await this.predictErrors(context);
    
    // Calculate overall risk score
    const riskScore = predictions.reduce((sum, pred) => sum + (pred.probability * 100), 0) / predictions.length;
    
    // Determine risk level
    let overallRisk: 'low' | 'medium' | 'high' | 'critical';
    if (riskScore >= 75) overallRisk = 'critical';
    else if (riskScore >= 50) overallRisk = 'high';
    else if (riskScore >= 25) overallRisk = 'medium';
    else overallRisk = 'low';

    // Calculate estimated failure rate
    const highProbErrors = predictions.filter(p => p.probability >= 0.5);
    const estimatedFailureRate = highProbErrors.length > 0 ? 
      Math.min(90, highProbErrors.reduce((sum, p) => sum + p.probability, 0) * 100) : 5;

    // Generate overall recommendations
    const recommendations = [
      ...new Set(predictions.flatMap(p => p.preventionSuggestions))
    ].slice(0, 10);

    return {
      overallRisk,
      riskScore: Math.round(riskScore),
      predictions,
      recommendations,
      estimatedFailureRate: Math.round(estimatedFailureRate)
    };
  }
}

export const predictiveErrorService = new PredictiveErrorService();