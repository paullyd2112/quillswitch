import { useState } from 'react';
import { ExtractedData } from '@/services/migration/extractionService';
import { enhancedValidationService, EnhancedValidationResult } from '@/services/ai-enhancements/enhancedValidationService';
import { deduplicationService } from '@/services/ai-enhancements/deduplicationService';
import { piiDetectionService } from '@/services/ai-enhancements/piiDetectionService';
import { predictiveErrorService, MigrationContext } from '@/services/ai-enhancements/predictiveErrorService';

export const useAIEnhancements = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [validationResults, setValidationResults] = useState<EnhancedValidationResult[]>([]);

  const runFullAnalysis = async (
    records: ExtractedData[],
    migrationContext: MigrationContext,
    onProgress?: (step: string, progress: number) => void
  ) => {
    setIsProcessing(true);
    
    try {
      // Step 1: Enhanced Validation (includes PII + Deduplication)
      onProgress?.('Running enhanced validation...', 25);
      const validation = await enhancedValidationService.validateRecords(records);
      setValidationResults(validation);

      // Step 2: Predictive Error Analysis
      onProgress?.('Analyzing potential errors...', 75);
      const riskAssessment = await predictiveErrorService.generateRiskAssessment(migrationContext);

      onProgress?.('Analysis complete', 100);

      return {
        validation,
        riskAssessment,
        summary: {
          totalRecords: records.length,
          qualityScore: Math.round(validation.reduce((sum, r) => sum + r.overallScore, 0) / validation.length),
          duplicatesFound: validation.filter(r => r.duplicates.length > 0).length,
          piiIssues: validation.reduce((sum, r) => sum + r.piiResults.length, 0),
          predictedErrors: riskAssessment.predictions.length
        }
      };
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    validationResults,
    runFullAnalysis,
    // Individual services for granular use
    enhancedValidationService,
    deduplicationService,
    piiDetectionService,
    predictiveErrorService
  };
};