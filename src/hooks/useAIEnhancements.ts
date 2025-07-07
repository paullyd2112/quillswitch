import { useState } from 'react';
import { ExtractedData } from '@/services/migration/extractionService';
import { enhancedValidationService, EnhancedValidationResult } from '@/services/ai-enhancements/enhancedValidationService';
import { deduplicationService } from '@/services/ai-enhancements/deduplicationService';
import { piiDetectionService } from '@/services/ai-enhancements/piiDetectionService';
import { predictiveErrorService, MigrationContext } from '@/services/ai-enhancements/predictiveErrorService';
import { mlQualityService } from '@/services/ai-enhancements/mlQualityService';

export const useAIEnhancements = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [validationResults, setValidationResults] = useState<EnhancedValidationResult[]>([]);
  const [processingProgress, setProcessingProgress] = useState<{step: string, progress: number}>({step: '', progress: 0});

  const runFullAnalysis = async (
    records: ExtractedData[],
    migrationContext: MigrationContext,
    onProgress?: (step: string, progress: number) => void
  ) => {
    setIsProcessing(true);
    
    try {
      // Step 1: ML Quality Assessment (using web workers when available)
      onProgress?.('Running ML quality assessment...', 10);
      setProcessingProgress({step: 'ML Quality Assessment', progress: 10});
      
      const qualityResults = await mlQualityService.assessQuality(records, (processed, total) => {
        const stepProgress = Math.round((processed / total) * 25) + 10;
        onProgress?.('Running ML quality assessment...', stepProgress);
        setProcessingProgress({step: 'ML Quality Assessment', progress: stepProgress});
      });

      // Step 2: Enhanced Validation (includes PII + Deduplication with workers)
      onProgress?.('Running enhanced validation...', 35);
      setProcessingProgress({step: 'Enhanced Validation', progress: 35});
      
      const validation = await enhancedValidationService.validateRecords(records);
      setValidationResults(validation);

      // Step 3: Batch Deduplication (using web workers)
      onProgress?.('Detecting duplicates...', 60);
      setProcessingProgress({step: 'Duplicate Detection', progress: 60});
      
      const deduplicationResults = await deduplicationService.batchDeduplicate(records, (processed, total, found) => {
        const stepProgress = Math.round((processed / total) * 25) + 60;
        onProgress?.(`Detecting duplicates... (${found} found)`, stepProgress);
        setProcessingProgress({step: 'Duplicate Detection', progress: stepProgress});
      });

      // Step 4: Predictive Error Analysis
      onProgress?.('Analyzing potential errors...', 85);
      setProcessingProgress({step: 'Error Analysis', progress: 85});
      
      const riskAssessment = await predictiveErrorService.generateRiskAssessment(migrationContext);

      onProgress?.('Analysis complete', 100);
      setProcessingProgress({step: 'Complete', progress: 100});

      return {
        validation,
        riskAssessment,
        qualityResults,
        deduplicationResults,
        summary: {
          totalRecords: records.length,
          qualityScore: Math.round(qualityResults.reduce((sum, r) => sum + r.overallScore, 0) / qualityResults.length),
          duplicatesFound: deduplicationResults.duplicates.length,
          piiIssues: validation.reduce((sum, r) => sum + r.piiResults.length, 0),
          predictedErrors: riskAssessment.predictions.length,
          usingWorkers: await mlQualityService.getModelInfo().then(info => info.usingWorker)
        }
      };
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    validationResults,
    processingProgress,
    runFullAnalysis,
    // Individual services for granular use
    enhancedValidationService,
    deduplicationService,
    piiDetectionService,
    predictiveErrorService,
    mlQualityService
  };
};