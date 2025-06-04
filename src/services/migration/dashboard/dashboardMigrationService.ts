
import { dashboardDiscoveryService } from "./discoveryService";
import { dashboardMappingEngine } from "./mappingEngine";
import { visualizationConverter } from "./visualizationConverter";
import { filterTranslationService } from "./filterTranslationService";
import { dashboardRecreationService } from "./recreationService";
import { DashboardConfig, DashboardMigrationResult } from "./types";

/**
 * Main Dashboard Migration Service
 * Orchestrates the complete dashboard migration process
 */
export class DashboardMigrationService {
  private static instance: DashboardMigrationService;

  public static getInstance(): DashboardMigrationService {
    if (!DashboardMigrationService.instance) {
      DashboardMigrationService.instance = new DashboardMigrationService();
    }
    return DashboardMigrationService.instance;
  }

  /**
   * Complete dashboard migration workflow
   */
  async migrateDashboards(params: {
    sourceCrm: string;
    destinationCrm: string;
    sourceCredentials: Record<string, any>;
    destinationCredentials: Record<string, any>;
    fieldMappings?: Record<string, string>;
    selectedDashboards?: string[];
    migrationOptions?: {
      preserveLayout: boolean;
      convertUnsupportedCharts: boolean;
      skipComplexFilters: boolean;
    };
  }): Promise<{
    discoveredDashboards: DashboardConfig[];
    migrationResults: DashboardMigrationResult[];
    overallSummary: {
      totalDashboards: number;
      successfulMigrations: number;
      partialMigrations: number;
      failedMigrations: number;
      overallSuccess: boolean;
    };
  }> {
    const {
      sourceCrm,
      destinationCrm,
      sourceCredentials,
      destinationCredentials,
      fieldMappings = {},
      selectedDashboards,
      migrationOptions = {
        preserveLayout: true,
        convertUnsupportedCharts: true,
        skipComplexFilters: false
      }
    } = params;

    console.log('Starting comprehensive dashboard migration process');

    // Step 1: Discover dashboards in source CRM
    const discoveredDashboards = await dashboardDiscoveryService.discoverDashboards(
      sourceCrm,
      sourceCredentials
    );

    console.log(`Discovered ${discoveredDashboards.length} dashboards`);

    // Step 2: Filter to selected dashboards if specified
    const dashboardsToMigrate = selectedDashboards 
      ? discoveredDashboards.filter(d => selectedDashboards.includes(d.id))
      : discoveredDashboards;

    console.log(`Migrating ${dashboardsToMigrate.length} dashboards`);

    // Step 3: Migrate each dashboard
    const migrationResults: DashboardMigrationResult[] = [];
    
    for (const dashboard of dashboardsToMigrate) {
      try {
        console.log(`Migrating dashboard: ${dashboard.name}`);
        
        const result = await dashboardRecreationService.migrateDashboard(
          dashboard,
          destinationCrm,
          destinationCredentials,
          fieldMappings
        );
        
        migrationResults.push(result);
        console.log(`Dashboard migration completed: ${result.migrationStatus}`);
        
      } catch (error) {
        console.error(`Failed to migrate dashboard ${dashboard.name}:`, error);
        // Create failed result
        migrationResults.push({
          sourceConfig: dashboard,
          destinationConfig: dashboard, // placeholder
          mappingResults: [],
          migrationStatus: 'failed',
          warnings: [],
          errors: [`Migration failed: ${error}`],
          unsupportedFeatures: []
        });
      }
    }

    // Step 4: Generate overall summary
    const overallSummary = this.generateOverallSummary(migrationResults);

    console.log('Dashboard migration process completed:', overallSummary);

    return {
      discoveredDashboards,
      migrationResults,
      overallSummary
    };
  }

  /**
   * Analyze dashboard migration feasibility
   */
  async analyzeMigrationFeasibility(
    sourceCrm: string,
    destinationCrm: string,
    dashboards: DashboardConfig[]
  ): Promise<{
    feasibilityScore: number;
    analysis: {
      dashboard: string;
      complexity: 'simple' | 'moderate' | 'complex';
      migrationConfidence: number;
      challenges: string[];
      recommendations: string[];
    }[];
    overallRecommendations: string[];
  }> {
    const analysis = [];
    let totalConfidence = 0;

    // Get destination capabilities
    const destinationCapabilities = await dashboardDiscoveryService.getCrmCapabilities(destinationCrm);

    for (const dashboard of dashboards) {
      // Analyze complexity
      const complexityAnalysis = await dashboardDiscoveryService.analyzeDashboardComplexity(dashboard);
      
      // Create mappings to assess feasibility
      const mappingResults = await dashboardMappingEngine.createDashboardMapping(
        dashboard,
        destinationCrm
      );
      
      const migrationConfidence = dashboardMappingEngine.calculateMappingConfidence(mappingResults);
      totalConfidence += migrationConfidence;

      // Generate recommendations
      const recommendations = this.generateMigrationRecommendations(
        dashboard,
        complexityAnalysis,
        mappingResults,
        destinationCapabilities
      );

      analysis.push({
        dashboard: dashboard.name,
        complexity: complexityAnalysis.complexity,
        migrationConfidence,
        challenges: complexityAnalysis.migrationChallenges,
        recommendations
      });
    }

    const feasibilityScore = dashboards.length > 0 ? totalConfidence / dashboards.length : 0;
    const overallRecommendations = this.generateOverallRecommendations(analysis, feasibilityScore);

    return {
      feasibilityScore,
      analysis,
      overallRecommendations
    };
  }

  /**
   * Preview dashboard migration
   */
  async previewDashboardMigration(
    dashboard: DashboardConfig,
    destinationCrm: string,
    fieldMappings: Record<string, string> = {}
  ): Promise<{
    originalDashboard: DashboardConfig;
    previewDashboard: DashboardConfig;
    mappingResults: any[];
    changes: {
      layoutChanges: string[];
      widgetChanges: string[];
      filterChanges: string[];
    };
    migrationWarnings: string[];
  }> {
    // Create component mappings
    const mappingResults = await dashboardMappingEngine.createDashboardMapping(
      dashboard,
      destinationCrm
    );

    // Get destination capabilities
    const destinationCapabilities = await dashboardDiscoveryService.getCrmCapabilities(destinationCrm);

    // Convert dashboard (without actually creating it)
    const previewDashboard = await this.createPreviewDashboard(
      dashboard,
      destinationCrm,
      destinationCapabilities,
      fieldMappings,
      mappingResults
    );

    // Analyze changes
    const changes = this.analyzeChanges(dashboard, previewDashboard);
    const migrationWarnings = this.generatePreviewWarnings(mappingResults);

    return {
      originalDashboard: dashboard,
      previewDashboard,
      mappingResults,
      changes,
      migrationWarnings
    };
  }

  /**
   * Generate overall summary from migration results
   */
  private generateOverallSummary(results: DashboardMigrationResult[]): {
    totalDashboards: number;
    successfulMigrations: number;
    partialMigrations: number;
    failedMigrations: number;
    overallSuccess: boolean;
  } {
    const total = results.length;
    const successful = results.filter(r => r.migrationStatus === 'success').length;
    const partial = results.filter(r => r.migrationStatus === 'partial').length;
    const failed = results.filter(r => r.migrationStatus === 'failed').length;

    return {
      totalDashboards: total,
      successfulMigrations: successful,
      partialMigrations: partial,
      failedMigrations: failed,
      overallSuccess: (successful + partial) / total >= 0.8
    };
  }

  /**
   * Generate migration recommendations
   */
  private generateMigrationRecommendations(
    dashboard: DashboardConfig,
    complexityAnalysis: any,
    mappingResults: any[],
    destinationCapabilities: any
  ): string[] {
    const recommendations: string[] = [];

    if (complexityAnalysis.complexity === 'complex') {
      recommendations.push('Consider simplifying dashboard before migration');
    }

    const lowConfidenceMappings = mappingResults.filter(r => r.confidence < 0.7);
    if (lowConfidenceMappings.length > 0) {
      recommendations.push('Review and manually adjust converted components');
    }

    if (dashboard.widgets.length > destinationCapabilities.maxWidgetsPerDashboard) {
      recommendations.push('Reduce number of widgets or split into multiple dashboards');
    }

    const unsupported = mappingResults.filter(r => r.confidence === 0);
    if (unsupported.length > 0) {
      recommendations.push('Prepare alternative solutions for unsupported features');
    }

    return recommendations;
  }

  /**
   * Generate overall recommendations
   */
  private generateOverallRecommendations(
    analysis: any[],
    feasibilityScore: number
  ): string[] {
    const recommendations: string[] = [];

    if (feasibilityScore < 0.5) {
      recommendations.push('Consider significant dashboard redesign for better compatibility');
    } else if (feasibilityScore < 0.8) {
      recommendations.push('Plan for manual adjustments post-migration');
    }

    const complexDashboards = analysis.filter(a => a.complexity === 'complex').length;
    if (complexDashboards > 0) {
      recommendations.push(`${complexDashboards} dashboards are complex and may require extra attention`);
    }

    return recommendations;
  }

  /**
   * Create preview dashboard (without persisting)
   */
  private async createPreviewDashboard(
    sourceDashboard: DashboardConfig,
    destinationCrm: string,
    destinationCapabilities: any,
    fieldMappings: Record<string, string>,
    mappingResults: any[]
  ): Promise<DashboardConfig> {
    // This would use similar logic to the recreation service
    // but without actually creating the dashboard
    return {
      ...sourceDashboard,
      id: `preview_${sourceDashboard.id}`,
      crmSystem: destinationCrm
      // Additional conversion logic would go here
    };
  }

  /**
   * Analyze changes between original and preview
   */
  private analyzeChanges(original: DashboardConfig, preview: DashboardConfig): {
    layoutChanges: string[];
    widgetChanges: string[];
    filterChanges: string[];
  } {
    return {
      layoutChanges: [],
      widgetChanges: [],
      filterChanges: []
    };
  }

  /**
   * Generate preview warnings
   */
  private generatePreviewWarnings(mappingResults: any[]): string[] {
    const warnings: string[] = [];
    
    const lowConfidence = mappingResults.filter(r => r.confidence < 0.7);
    if (lowConfidence.length > 0) {
      warnings.push(`${lowConfidence.length} components will be converted with modifications`);
    }

    return warnings;
  }
}

export const dashboardMigrationService = DashboardMigrationService.getInstance();
