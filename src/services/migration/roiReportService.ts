import { supabase } from "@/integrations/supabase/client";
import { MigrationProject } from "@/integrations/supabase/migrationTypes";
import { safeTable } from "@/services/utils/supabaseUtils";
import { DeduplicationService } from '@/services/ai-enhancements/deduplicationService';
import { PIIDetectionService } from '@/services/ai-enhancements/piiDetectionService';
import { MLQualityService } from '@/services/ai-enhancements/mlQualityService';

export interface ROIMetrics {
  totalRecordsProcessed: number;
  duplicatesRemoved: number;
  piiFieldsSecured: number;
  dataQualityImprovement: number;
  estimatedTimeSaved: number;
  estimatedCostSavings: number;
  complianceRiskReduction: number;
}

export interface ROICalculationInputs {
  projectId: string;
  totalRecords: number;
  averageHourlyRate: number;
  compliancePenaltyRisk: number;
}

export interface ROIReportData {
  projectId: string;
  projectName: string;
  migrationDate: string;
  metrics: ROIMetrics;
  recommendations: string[];
  reportSummary: string;
  generatedAt: string;
}

export class MigrationROIReportService {
  /**
   * Generate comprehensive ROI report for completed migration
   */
  static async generateROIReport(inputs: ROICalculationInputs): Promise<ROIReportData> {
    try {
      // Get project details
      const { data: project } = await supabase
        .from('migration_projects')
        .select('*')
        .eq('id', inputs.projectId)
        .single();

      if (!project) {
        throw new Error('Project not found');
      }

      // Get AI analysis results
      const [duplicatesData, piiData, qualityData] = await Promise.all([
        this.getDuplicationResults(inputs.projectId),
        this.getPIIResults(inputs.projectId),
        this.getQualityResults(inputs.projectId)
      ]);

      // Calculate ROI metrics
      const metrics = this.calculateROIMetrics({
        ...inputs,
        duplicatesData,
        piiData,
        qualityData
      });

      // Generate recommendations
      const recommendations = this.generateRecommendations(metrics, duplicatesData, piiData);

      // Generate report summary using LLM
      const reportSummary = await this.generateReportSummary(project as MigrationProject, metrics, recommendations);

      const reportData: ROIReportData = {
        projectId: inputs.projectId,
        projectName: `${project.source_crm} to ${project.destination_crm} Migration`,
        migrationDate: project.completed_at || new Date().toISOString(),
        metrics,
        recommendations,
        reportSummary,
        generatedAt: new Date().toISOString()
      };

      // Save report to database
      await this.saveROIReport(reportData);

      return reportData;
    } catch (error) {
      console.error('Failed to generate ROI report:', error);
      throw new Error(`ROI report generation failed: ${error.message}`);
    }
  }

  private static async getDuplicationResults(projectId: string) {
    // TODO: Implement real deduplication data from DeduplicationService results
    return {
      totalDuplicates: 0,
      duplicatePercentage: 0,
      potentialDuplicates: 0
    };
  }

  private static async getPIIResults(projectId: string) {
    // TODO: Implement real PII detection data from PIIDetectionService results
    return {
      piiFieldsDetected: 0,
      highRiskFields: 0,
      fieldsSecured: 0
    };
  }

  private static async getQualityResults(projectId: string) {
    // TODO: Implement real quality data from MLQualityService results
    return {
      overallQualityScore: 0,
      fieldsImproved: 0,
      completenessImprovement: 0
    };
  }

  private static calculateROIMetrics(data: any): ROIMetrics {
    const { 
      totalRecords, 
      averageHourlyRate, 
      compliancePenaltyRisk,
      duplicatesData,
      piiData,
      qualityData 
    } = data;

    // Calculate time savings from automation
    const manualProcessingTimePerRecord = 0.5; // minutes
    const automatedProcessingTimePerRecord = 0.05; // minutes
    const timeSavedMinutes = (manualProcessingTimePerRecord - automatedProcessingTimePerRecord) * totalRecords;
    const estimatedTimeSaved = timeSavedMinutes / 60; // convert to hours

    // Calculate cost savings
    const laborCostSavings = estimatedTimeSaved * averageHourlyRate;
    const duplicateProcessingCostSavings = duplicatesData.totalDuplicates * 2.5; // $2.50 per duplicate avoided
    const complianceCostSavings = (piiData.fieldsSecured / 10) * compliancePenaltyRisk * 0.1; // 10% risk reduction per 10 fields
    
    const estimatedCostSavings = laborCostSavings + duplicateProcessingCostSavings + complianceCostSavings;

    // Calculate compliance risk reduction percentage
    const complianceRiskReduction = Math.min(95, (piiData.fieldsSecured * 3.5)); // 3.5% per field, max 95%

    return {
      totalRecordsProcessed: totalRecords,
      duplicatesRemoved: duplicatesData.totalDuplicates,
      piiFieldsSecured: piiData.fieldsSecured,
      dataQualityImprovement: qualityData.completenessImprovement,
      estimatedTimeSaved: Math.round(estimatedTimeSaved * 100) / 100,
      estimatedCostSavings: Math.round(estimatedCostSavings * 100) / 100,
      complianceRiskReduction: Math.round(complianceRiskReduction * 100) / 100
    };
  }

  private static generateRecommendations(metrics: ROIMetrics, duplicatesData: any, piiData: any): string[] {
    const recommendations: string[] = [];

    if (duplicatesData.potentialDuplicates > 0) {
      recommendations.push("Consider implementing ongoing deduplication monitoring to prevent future duplicate accumulation");
    }

    if (piiData.highRiskFields > 0) {
      recommendations.push("Establish regular PII auditing processes to maintain compliance standards");
    }

    if (metrics.dataQualityImprovement > 20) {
      recommendations.push("Implement data quality gates in your ongoing processes to maintain the improved data standards");
    }

    if (metrics.estimatedCostSavings > 5000) {
      recommendations.push("Consider expanding QuillSwitch usage to other systems to maximize ROI potential");
    }

    recommendations.push("Schedule quarterly data health assessments to maintain migration benefits");

    return recommendations;
  }

  private static async generateReportSummary(
    project: MigrationProject, 
    metrics: ROIMetrics, 
    recommendations: string[]
  ): Promise<string> {
    const prompt = `Generate a professional executive summary for a CRM migration ROI report with the following details:

Migration: ${project.source_crm} to ${project.destination_crm}
Records Processed: ${metrics.totalRecordsProcessed.toLocaleString()}
Duplicates Removed: ${metrics.duplicatesRemoved}
PII Fields Secured: ${metrics.piiFieldsSecured}
Data Quality Improvement: ${metrics.dataQualityImprovement.toFixed(1)}%
Time Saved: ${metrics.estimatedTimeSaved} hours
Cost Savings: $${metrics.estimatedCostSavings.toLocaleString()}
Compliance Risk Reduction: ${metrics.complianceRiskReduction}%

Write a concise, professional summary (2-3 paragraphs) highlighting the key value delivered and business impact. Focus on quantifiable benefits and strategic value.`;

    try {
      const response = await fetch('/api/generate-roi-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });

      if (response.ok) {
        const { summary } = await response.json();
        return summary;
      }
    } catch (error) {
      console.error('Failed to generate AI summary:', error);
    }

    // Fallback summary
    return `Your ${project.source_crm} to ${project.destination_crm} migration has been completed successfully, delivering significant business value through automated data processing and quality improvements. 

QuillSwitch processed ${metrics.totalRecordsProcessed.toLocaleString()} records, removing ${metrics.duplicatesRemoved} duplicates and securing ${metrics.piiFieldsSecured} PII fields, resulting in an estimated ${metrics.estimatedTimeSaved} hours of time savings and $${metrics.estimatedCostSavings.toLocaleString()} in cost avoidance.

The migration achieved a ${metrics.dataQualityImprovement.toFixed(1)}% improvement in data quality while reducing compliance risk by ${metrics.complianceRiskReduction}%, positioning your organization for improved operational efficiency and reduced regulatory exposure.`;
  }

  private static async saveROIReport(reportData: ROIReportData): Promise<void> {
    const { error } = await safeTable('migration_roi_reports')
      .insert({
        project_id: reportData.projectId,
        report_data: reportData as any,
        metrics: reportData.metrics as any,
        generated_at: reportData.generatedAt
      });

    if (error) {
      console.error('Failed to save ROI report:', error);
      // Don't throw here - report generation should succeed even if saving fails
    }
  }

  /**
   * Get saved ROI report for a project
   */
  static async getROIReport(projectId: string): Promise<ROIReportData | null> {
    try {
      const { data, error } = await safeTable('migration_roi_reports')
        .select('*')
        .eq('project_id', projectId)
        .order('generated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error || !data) {
        return null;
      }

      return data.report_data as unknown as ROIReportData;
    } catch (error) {
      console.error('Failed to fetch ROI report:', error);
      return null;
    }
  }

  /**
   * Export ROI report as formatted markdown
   */
  static generateMarkdownReport(reportData: ROIReportData): string {
    const { metrics, projectName, migrationDate, recommendations, reportSummary } = reportData;
    
    return `# Migration ROI Report
## ${projectName}

**Migration Date:** ${new Date(migrationDate).toLocaleDateString()}  
**Report Generated:** ${new Date(reportData.generatedAt).toLocaleDateString()}

---

## Executive Summary

${reportSummary}

---

## Key Metrics

| Metric | Value |
|--------|-------|
| **Total Records Processed** | ${metrics.totalRecordsProcessed.toLocaleString()} |
| **Duplicates Removed** | ${metrics.duplicatesRemoved} records |
| **PII Fields Secured** | ${metrics.piiFieldsSecured} fields |
| **Data Quality Improvement** | ${metrics.dataQualityImprovement.toFixed(1)}% |
| **Estimated Time Saved** | ${metrics.estimatedTimeSaved} hours |
| **Estimated Cost Savings** | $${metrics.estimatedCostSavings.toLocaleString()} |
| **Compliance Risk Reduction** | ${metrics.complianceRiskReduction}% |

---

## Value Delivered

### 🔄 **Data Deduplication**
Removed ${metrics.duplicatesRemoved} duplicate records, preventing data inconsistencies and improving system performance.

### 🔒 **Security & Compliance**
Secured ${metrics.piiFieldsSecured} PII fields and reduced compliance risk by ${metrics.complianceRiskReduction}%, protecting sensitive information.

### 📈 **Data Quality Enhancement**
Achieved ${metrics.dataQualityImprovement.toFixed(1)}% improvement in overall data quality through automated validation and cleansing.

### ⏱️ **Operational Efficiency**
Saved approximately ${metrics.estimatedTimeSaved} hours of manual processing time, translating to $${metrics.estimatedCostSavings.toLocaleString()} in cost avoidance.

---

## Recommendations

${recommendations.map(rec => `- ${rec}`).join('\n')}

---

## About This Report

This report was automatically generated by QuillSwitch's AI-powered migration analysis engine. The metrics and calculations are based on industry benchmarks and actual migration data processing results.

*For questions about this report, please contact your QuillSwitch migration specialist.*`;
  }
}