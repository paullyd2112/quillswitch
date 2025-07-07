import { ExportService, ReportData } from './exportService';
import { PIIDetectionResult } from '@/services/ai-enhancements/piiDetectionService';
import { DuplicationResult } from '@/services/ai-enhancements/deduplicationService';
import { ExtractedData } from '@/services/migration/extractionService';

export interface AIAnalysisResults {
  qualityScores: {
    completeness: number;
    accuracy: number;
    consistency: number;
    compliance: number;
    uniqueness: number;
    overall: number;
  };
  piiResults: PIIDetectionResult[];
  duplicateResults: DuplicationResult[];
  extractedData: ExtractedData[];
  performanceMetrics: {
    totalRecords: number;
    processingTime: number;
    errorsFound: number;
    warningsGenerated: number;
  };
}

export interface MigrationReadinessScore {
  overallScore: number;
  dataQuality: number;
  securityCompliance: number;
  mappingConfidence: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  recommendations: string[];
  criticalIssues: string[];
}

/**
 * Service for generating comprehensive reports from AI analysis results
 */
export class ReportingService {

  /**
   * Generate AI Analysis Summary Report
   */
  static async generateAIAnalysisReport(
    results: AIAnalysisResults,
    format: 'pdf' | 'csv' | 'json' = 'pdf'
  ) {
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `ai-analysis-report-${timestamp}`;

    if (format === 'json') {
      return ExportService.exportJSON(results, filename);
    }

    if (format === 'csv') {
      // Flatten results for CSV export
      const csvData = this.flattenAIResultsForCSV(results);
      return ExportService.exportCSV(csvData, filename);
    }

    // Generate PDF report
    const reportData: ReportData = {
      title: 'AI-Enhanced Migration Analysis Report',
      subtitle: 'Comprehensive data quality and security assessment',
      summary: {
        'Overall Quality Score': `${results.qualityScores.overall}%`,
        'Total Records Analyzed': results.performanceMetrics.totalRecords.toLocaleString(),
        'Processing Time': `${results.performanceMetrics.processingTime}ms`,
        'PII Fields Detected': results.piiResults.length,
        'Potential Duplicates': results.duplicateResults.length,
        'Errors Found': results.performanceMetrics.errorsFound,
        'Warnings Generated': results.performanceMetrics.warningsGenerated
      },
      data: results.extractedData.slice(0, 50), // First 50 records for PDF
      metadata: {
        'Data Completeness': `${results.qualityScores.completeness}%`,
        'Data Accuracy': `${results.qualityScores.accuracy}%`,
        'Data Consistency': `${results.qualityScores.consistency}%`,
        'Security Compliance': `${results.qualityScores.compliance}%`,
        'Data Uniqueness': `${results.qualityScores.uniqueness}%`,
        'Analysis Timestamp': new Date().toLocaleString()
      }
    };

    return ExportService.generateReportPDF(reportData, filename);
  }

  /**
   * Generate PII Compliance Report
   */
  static async generatePIIComplianceReport(
    piiResults: PIIDetectionResult[],
    format: 'pdf' | 'csv' | 'json' = 'pdf'
  ) {
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `pii-compliance-report-${timestamp}`;

    if (format === 'json') {
      return ExportService.exportJSON({ piiResults }, filename);
    }

    const csvData = piiResults.map(result => ({
      fieldName: result.fieldName,
      piiTypes: result.piiTypes.map(p => p.type).join('; '),
      confidence: result.confidence,
      shouldMask: result.shouldMask,
      suggestion: result.suggestion,
      maskedValue: result.maskedValue || 'N/A'
    }));

    if (format === 'csv') {
      return ExportService.exportCSV(csvData, filename);
    }

    // Generate PDF report
    const highRiskFields = piiResults.filter(r => r.confidence >= 90);
    const mediumRiskFields = piiResults.filter(r => r.confidence >= 70 && r.confidence < 90);
    
    const reportData: ReportData = {
      title: 'PII Compliance Report',
      subtitle: 'Personally Identifiable Information Analysis',
      summary: {
        'Total Fields Analyzed': piiResults.length,
        'High Risk PII Fields': highRiskFields.length,
        'Medium Risk PII Fields': mediumRiskFields.length,
        'Fields Requiring Masking': piiResults.filter(r => r.shouldMask).length,
        'Compliance Status': highRiskFields.length === 0 ? 'COMPLIANT' : 'REQUIRES ATTENTION'
      },
      data: csvData,
      metadata: {
        'Most Common PII Types': this.getMostCommonPIITypes(piiResults),
        'Average Confidence Score': this.calculateAverageConfidence(piiResults),
        'Recommendations': this.generatePIIRecommendations(piiResults).join('; ')
      }
    };

    return ExportService.generateReportPDF(reportData, filename);
  }

  /**
   * Generate Migration Readiness Report
   */
  static async generateMigrationReadinessReport(
    readinessScore: MigrationReadinessScore,
    analysisResults: AIAnalysisResults,
    format: 'pdf' | 'csv' | 'json' = 'pdf'
  ) {
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `migration-readiness-${timestamp}`;

    const reportData = {
      readinessScore,
      analysisResults,
      generatedAt: new Date().toISOString()
    };

    if (format === 'json') {
      return ExportService.exportJSON(reportData, filename);
    }

    if (format === 'csv') {
      const csvData = [{
        overallScore: readinessScore.overallScore,
        dataQuality: readinessScore.dataQuality,
        securityCompliance: readinessScore.securityCompliance,
        mappingConfidence: readinessScore.mappingConfidence,
        riskLevel: readinessScore.riskLevel,
        recommendations: readinessScore.recommendations.join('; '),
        criticalIssues: readinessScore.criticalIssues.join('; ')
      }];
      return ExportService.exportCSV(csvData, filename);
    }

    // Generate PDF report
    const pdfReportData: ReportData = {
      title: 'Migration Readiness Assessment',
      subtitle: 'Comprehensive migration preparation analysis',
      summary: {
        'Overall Readiness Score': `${readinessScore.overallScore}%`,
        'Data Quality Score': `${readinessScore.dataQuality}%`,
        'Security Compliance Score': `${readinessScore.securityCompliance}%`,
        'Mapping Confidence': `${readinessScore.mappingConfidence}%`,
        'Risk Level': readinessScore.riskLevel,
        'Critical Issues': readinessScore.criticalIssues.length,
        'Recommendations': readinessScore.recommendations.length
      },
      data: [
        ...readinessScore.recommendations.map(rec => ({ type: 'Recommendation', description: rec })),
        ...readinessScore.criticalIssues.map(issue => ({ type: 'Critical Issue', description: issue }))
      ],
      metadata: {
        'Migration Recommendation': this.getMigrationRecommendation(readinessScore),
        'Next Steps': this.getNextSteps(readinessScore).join('; '),
        'Estimated Preparation Time': this.estimatePreparationTime(readinessScore)
      }
    };

    return ExportService.generateReportPDF(pdfReportData, filename);
  }

  /**
   * Calculate Migration Readiness Score
   */
  static calculateMigrationReadiness(results: AIAnalysisResults): MigrationReadinessScore {
    const dataQuality = results.qualityScores.overall;
    const securityCompliance = results.qualityScores.compliance;
    
    // Calculate mapping confidence based on data consistency and accuracy
    const mappingConfidence = (results.qualityScores.consistency + results.qualityScores.accuracy) / 2;
    
    // Calculate overall score
    const overallScore = Math.round((dataQuality + securityCompliance + mappingConfidence) / 3);
    
    // Determine risk level
    let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
    if (overallScore >= 85) riskLevel = 'LOW';
    else if (overallScore >= 70) riskLevel = 'MEDIUM';
    else riskLevel = 'HIGH';

    // Generate recommendations
    const recommendations: string[] = [];
    const criticalIssues: string[] = [];

    if (dataQuality < 80) {
      recommendations.push('Improve data quality by addressing missing or inconsistent values');
      if (dataQuality < 60) {
        criticalIssues.push('Data quality is below acceptable threshold');
      }
    }

    if (securityCompliance < 90) {
      recommendations.push('Address PII detection findings and implement proper data masking');
      if (results.piiResults.filter(p => p.shouldMask).length > 0) {
        criticalIssues.push('Unmasked PII detected - immediate attention required');
      }
    }

    if (results.duplicateResults.length > results.performanceMetrics.totalRecords * 0.05) {
      recommendations.push('High duplicate rate detected - consider deduplication');
    }

    if (mappingConfidence < 75) {
      recommendations.push('Review field mappings for accuracy and completeness');
    }

    return {
      overallScore,
      dataQuality,
      securityCompliance,
      mappingConfidence,
      riskLevel,
      recommendations,
      criticalIssues
    };
  }

  // Private helper methods

  private static flattenAIResultsForCSV(results: AIAnalysisResults) {
    return results.extractedData.map((record, index) => ({
      recordId: record.recordId,
      sourceSystem: record.sourceSystem,
      objectType: record.objectType,
      fieldsCount: record.fields.length,
      qualityScore: results.qualityScores.overall,
      hasPII: results.piiResults.some(p => p.fieldName in record.fields),
      isDuplicate: results.duplicateResults.some(d => d.matchedRecord?.recordId === record.recordId)
    }));
  }

  private static getMostCommonPIITypes(results: PIIDetectionResult[]): string {
    const typeCount: Record<string, number> = {};
    results.forEach(result => {
      result.piiTypes.forEach(pii => {
        typeCount[pii.type] = (typeCount[pii.type] || 0) + 1;
      });
    });
    
    const sorted = Object.entries(typeCount).sort(([,a], [,b]) => b - a);
    return sorted.slice(0, 3).map(([type, count]) => `${type}(${count})`).join(', ');
  }

  private static calculateAverageConfidence(results: PIIDetectionResult[]): string {
    if (results.length === 0) return '0%';
    const avg = results.reduce((sum, r) => sum + r.confidence, 0) / results.length;
    return `${Math.round(avg)}%`;
  }

  private static generatePIIRecommendations(results: PIIDetectionResult[]): string[] {
    const recommendations: string[] = [];
    const highRisk = results.filter(r => r.confidence >= 90);
    
    if (highRisk.length > 0) {
      recommendations.push('Implement immediate data masking for high-confidence PII fields');
    }
    
    if (results.some(r => r.piiTypes.some(p => p.type === 'ssn'))) {
      recommendations.push('SSN detected - ensure GDPR/CCPA compliance');
    }
    
    if (results.some(r => r.piiTypes.some(p => p.type === 'credit_card'))) {
      recommendations.push('Credit card data detected - implement PCI DSS compliance measures');
    }
    
    return recommendations;
  }

  private static getMigrationRecommendation(score: MigrationReadinessScore): string {
    if (score.riskLevel === 'LOW') {
      return 'Ready for migration - proceed with confidence';
    } else if (score.riskLevel === 'MEDIUM') {
      return 'Address identified issues before proceeding';
    } else {
      return 'Migration not recommended until critical issues are resolved';
    }
  }

  private static getNextSteps(score: MigrationReadinessScore): string[] {
    const steps: string[] = [];
    
    if (score.criticalIssues.length > 0) {
      steps.push('Resolve all critical issues');
    }
    
    if (score.dataQuality < 80) {
      steps.push('Implement data quality improvements');
    }
    
    if (score.securityCompliance < 90) {
      steps.push('Address security and compliance gaps');
    }
    
    steps.push('Run final validation test');
    steps.push('Schedule migration window');
    
    return steps;
  }

  private static estimatePreparationTime(score: MigrationReadinessScore): string {
    if (score.riskLevel === 'LOW') {
      return '1-3 days';
    } else if (score.riskLevel === 'MEDIUM') {
      return '1-2 weeks';
    } else {
      return '2-4 weeks';
    }
  }
}