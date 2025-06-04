
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { DashboardConfig, DashboardMigrationResult, ComponentMappingResult } from "./types";
import { dashboardMappingEngine } from "./mappingEngine";
import { visualizationConverter } from "./visualizationConverter";
import { filterTranslationService } from "./filterTranslationService";
import { dashboardDiscoveryService } from "./discoveryService";

/**
 * Dashboard Recreation Service
 * Builds equivalent dashboards in the destination CRM system
 */
export class DashboardRecreationService {
  private static instance: DashboardRecreationService;

  public static getInstance(): DashboardRecreationService {
    if (!DashboardRecreationService.instance) {
      DashboardRecreationService.instance = new DashboardRecreationService();
    }
    return DashboardRecreationService.instance;
  }

  /**
   * Migrate dashboard from source to destination CRM
   */
  async migrateDashboard(
    sourceDashboard: DashboardConfig,
    destinationCrm: string,
    destinationCredentials: Record<string, any>,
    fieldMappings: Record<string, string> = {}
  ): Promise<DashboardMigrationResult> {
    try {
      console.log(`Starting dashboard migration: ${sourceDashboard.name}`);
      
      // Get destination capabilities
      const destinationCapabilities = await dashboardDiscoveryService.getCrmCapabilities(destinationCrm);
      
      // Create component mappings
      const mappingResults = await dashboardMappingEngine.createDashboardMapping(
        sourceDashboard,
        destinationCrm
      );

      // Convert dashboard configuration
      const convertedDashboard = await this.convertDashboardConfig(
        sourceDashboard,
        destinationCrm,
        destinationCapabilities,
        fieldMappings,
        mappingResults
      );

      // Create dashboard in destination system
      const createdDashboard = await this.createDashboardInDestination(
        convertedDashboard,
        destinationCrm,
        destinationCredentials
      );

      // Analyze migration results
      const migrationStatus = this.analyzeMigrationSuccess(mappingResults);
      const warnings = this.generateWarnings(mappingResults);
      const errors = this.generateErrors(mappingResults);
      const unsupportedFeatures = this.identifyUnsupportedFeatures(mappingResults);

      const result: DashboardMigrationResult = {
        sourceConfig: sourceDashboard,
        destinationConfig: createdDashboard,
        mappingResults,
        migrationStatus,
        warnings,
        errors,
        unsupportedFeatures
      };

      console.log('Dashboard migration completed:', result);
      return result;

    } catch (error) {
      console.error('Dashboard migration failed:', error);
      toast.error('Dashboard migration failed');
      throw error;
    }
  }

  /**
   * Convert dashboard configuration for destination CRM
   */
  private async convertDashboardConfig(
    sourceDashboard: DashboardConfig,
    destinationCrm: string,
    destinationCapabilities: any,
    fieldMappings: Record<string, string>,
    mappingResults: ComponentMappingResult[]
  ): Promise<DashboardConfig> {
    const convertedDashboard: DashboardConfig = {
      ...sourceDashboard,
      id: `migrated_${sourceDashboard.id}_${Date.now()}`,
      crmSystem: destinationCrm,
      widgets: [],
      filters: []
    };

    // Convert widgets
    for (const widget of sourceDashboard.widgets) {
      try {
        const convertedWidget = await this.convertWidget(
          widget,
          destinationCapabilities,
          fieldMappings
        );
        convertedDashboard.widgets.push(convertedWidget);
      } catch (error) {
        console.error(`Failed to convert widget ${widget.id}:`, error);
        // Skip widget but continue migration
      }
    }

    // Convert filters
    const filterTranslation = await filterTranslationService.translateFilters(
      sourceDashboard.filters,
      sourceDashboard.crmSystem,
      destinationCrm,
      fieldMappings
    );
    convertedDashboard.filters = filterTranslation.translatedFilters;

    // Adapt layout
    convertedDashboard.layout = this.adaptLayout(
      sourceDashboard.layout,
      destinationCapabilities,
      convertedDashboard.widgets.length
    );

    return convertedDashboard;
  }

  /**
   * Convert individual widget
   */
  private async convertWidget(
    sourceWidget: any,
    destinationCapabilities: any,
    fieldMappings: Record<string, string>
  ): Promise<any> {
    const convertedWidget = { ...sourceWidget };

    // Map data source fields
    convertedWidget.dataSource = {
      ...sourceWidget.dataSource,
      fields: sourceWidget.dataSource.fields.map((field: string) => 
        fieldMappings[field] || field
      )
    };

    // Convert visualization
    const vizConversion = await visualizationConverter.convertVisualization(
      sourceWidget.visualization,
      destinationCapabilities
    );
    convertedWidget.visualization = vizConversion.visualization;

    // Adapt widget settings
    convertedWidget.settings = this.adaptWidgetSettings(
      sourceWidget.settings,
      destinationCapabilities
    );

    return convertedWidget;
  }

  /**
   * Adapt layout for destination platform
   */
  private adaptLayout(
    sourceLayout: any,
    destinationCapabilities: any,
    widgetCount: number
  ): any {
    const adapted = { ...sourceLayout };

    // Ensure layout type is supported
    if (!destinationCapabilities.layoutOptions.includes(adapted.type)) {
      adapted.type = destinationCapabilities.layoutOptions[0] || 'grid';
    }

    // Adjust for widget limits
    if (widgetCount > destinationCapabilities.maxWidgetsPerDashboard) {
      // Would need to implement widget prioritization logic
      console.warn(`Widget count (${widgetCount}) exceeds limit (${destinationCapabilities.maxWidgetsPerDashboard})`);
    }

    // Optimize sections for new layout
    if (adapted.type === 'grid') {
      adapted.sections = this.optimizeGridLayout(adapted.sections, widgetCount);
    }

    return adapted;
  }

  /**
   * Optimize grid layout sections
   */
  private optimizeGridLayout(sections: any[], widgetCount: number): any[] {
    // Simple grid optimization - arrange widgets in balanced grid
    const columns = Math.ceil(Math.sqrt(widgetCount));
    const rows = Math.ceil(widgetCount / columns);

    return sections.map((section, index) => ({
      ...section,
      position: {
        x: index % columns,
        y: Math.floor(index / columns),
        width: 1,
        height: 1
      }
    }));
  }

  /**
   * Adapt widget settings for destination platform
   */
  private adaptWidgetSettings(sourceSettings: any, destinationCapabilities: any): any {
    const adapted = { ...sourceSettings };

    // Disable unsupported features
    if (!destinationCapabilities.drilldownSupported) {
      adapted.drilldownEnabled = false;
    }

    if (!destinationCapabilities.realTimeDataSupported) {
      adapted.refreshInterval = undefined;
    }

    return adapted;
  }

  /**
   * Create dashboard in destination CRM system
   */
  private async createDashboardInDestination(
    dashboardConfig: DashboardConfig,
    destinationCrm: string,
    credentials: Record<string, any>
  ): Promise<DashboardConfig> {
    const { data, error } = await supabase.functions.invoke('dashboard-recreation', {
      body: {
        operation: 'create_dashboard',
        crmSystem: destinationCrm,
        dashboardConfig,
        credentials
      }
    });

    if (error) throw error;
    if (!data.success) throw new Error(data.error || 'Dashboard creation failed');

    return data.dashboard;
  }

  /**
   * Analyze migration success
   */
  private analyzeMigrationSuccess(mappingResults: ComponentMappingResult[]): 'success' | 'partial' | 'failed' {
    const totalComponents = mappingResults.length;
    const successfulMappings = mappingResults.filter(r => r.confidence > 0.5).length;
    const failedMappings = mappingResults.filter(r => r.confidence === 0).length;

    if (failedMappings === 0) return 'success';
    if (successfulMappings > failedMappings) return 'partial';
    return 'failed';
  }

  /**
   * Generate warnings from mapping results
   */
  private generateWarnings(mappingResults: ComponentMappingResult[]): string[] {
    const warnings: string[] = [];

    const approximations = mappingResults.filter(r => r.mappingType === 'approximation');
    if (approximations.length > 0) {
      warnings.push(`${approximations.length} components converted with approximations`);
    }

    const lowConfidence = mappingResults.filter(r => r.confidence < 0.7 && r.confidence > 0);
    if (lowConfidence.length > 0) {
      warnings.push(`${lowConfidence.length} components have low conversion confidence`);
    }

    return warnings;
  }

  /**
   * Generate errors from mapping results
   */
  private generateErrors(mappingResults: ComponentMappingResult[]): string[] {
    const errors: string[] = [];

    const failed = mappingResults.filter(r => r.confidence === 0);
    failed.forEach(result => {
      errors.push(`Failed to convert: ${result.sourceComponent} - ${result.notes || 'Unknown error'}`);
    });

    return errors;
  }

  /**
   * Identify unsupported features
   */
  private identifyUnsupportedFeatures(mappingResults: ComponentMappingResult[]): string[] {
    const unsupported: string[] = [];

    mappingResults.forEach(result => {
      if (result.destinationComponent === 'unsupported') {
        unsupported.push(result.sourceComponent);
      }
    });

    return unsupported;
  }

  /**
   * Batch migrate multiple dashboards
   */
  async batchMigrateDashboards(
    dashboards: DashboardConfig[],
    destinationCrm: string,
    destinationCredentials: Record<string, any>,
    fieldMappings: Record<string, string> = {}
  ): Promise<{
    results: DashboardMigrationResult[];
    summary: {
      total: number;
      successful: number;
      partial: number;
      failed: number;
    };
  }> {
    const results: DashboardMigrationResult[] = [];
    let successful = 0;
    let partial = 0;
    let failed = 0;

    for (const dashboard of dashboards) {
      try {
        const result = await this.migrateDashboard(
          dashboard,
          destinationCrm,
          destinationCredentials,
          fieldMappings
        );
        
        results.push(result);
        
        switch (result.migrationStatus) {
          case 'success': successful++; break;
          case 'partial': partial++; break;
          case 'failed': failed++; break;
        }
      } catch (error) {
        console.error(`Failed to migrate dashboard ${dashboard.name}:`, error);
        failed++;
      }
    }

    return {
      results,
      summary: {
        total: dashboards.length,
        successful,
        partial,
        failed
      }
    };
  }
}

export const dashboardRecreationService = DashboardRecreationService.getInstance();
