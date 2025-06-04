
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { DashboardConfig, CrmDashboardCapabilities } from "./types";

/**
 * Dashboard Discovery Service
 * Extracts existing dashboards and their configurations from source CRM systems
 */
export class DashboardDiscoveryService {
  private static instance: DashboardDiscoveryService;

  public static getInstance(): DashboardDiscoveryService {
    if (!DashboardDiscoveryService.instance) {
      DashboardDiscoveryService.instance = new DashboardDiscoveryService();
    }
    return DashboardDiscoveryService.instance;
  }

  /**
   * Discover all dashboards in a CRM system
   */
  async discoverDashboards(crmSystem: string, credentials: Record<string, any>): Promise<DashboardConfig[]> {
    try {
      console.log(`Starting dashboard discovery for ${crmSystem}`);
      
      const { data, error } = await supabase.functions.invoke('dashboard-discovery', {
        body: {
          operation: 'discover_dashboards',
          crmSystem,
          credentials
        }
      });

      if (error) throw error;
      if (!data.success) throw new Error(data.error || 'Dashboard discovery failed');

      console.log(`Discovered ${data.dashboards.length} dashboards`);
      return data.dashboards;
    } catch (error) {
      console.error('Dashboard discovery error:', error);
      toast.error('Failed to discover dashboards');
      throw error;
    }
  }

  /**
   * Extract detailed configuration for a specific dashboard
   */
  async extractDashboardConfig(
    crmSystem: string, 
    dashboardId: string, 
    credentials: Record<string, any>
  ): Promise<DashboardConfig> {
    try {
      console.log(`Extracting config for dashboard ${dashboardId} in ${crmSystem}`);

      const { data, error } = await supabase.functions.invoke('dashboard-discovery', {
        body: {
          operation: 'extract_dashboard_config',
          crmSystem,
          dashboardId,
          credentials
        }
      });

      if (error) throw error;
      if (!data.success) throw new Error(data.error || 'Dashboard config extraction failed');

      return data.dashboardConfig;
    } catch (error) {
      console.error('Dashboard config extraction error:', error);
      toast.error('Failed to extract dashboard configuration');
      throw error;
    }
  }

  /**
   * Get CRM system dashboard capabilities
   */
  async getCrmCapabilities(crmSystem: string): Promise<CrmDashboardCapabilities> {
    try {
      const { data, error } = await supabase.functions.invoke('dashboard-discovery', {
        body: {
          operation: 'get_crm_capabilities',
          crmSystem
        }
      });

      if (error) throw error;
      if (!data.success) throw new Error(data.error || 'Failed to get CRM capabilities');

      return data.capabilities;
    } catch (error) {
      console.error('CRM capabilities error:', error);
      return this.getDefaultCapabilities(crmSystem);
    }
  }

  /**
   * Analyze dashboard complexity for migration planning
   */
  async analyzeDashboardComplexity(dashboard: DashboardConfig): Promise<{
    complexity: 'simple' | 'moderate' | 'complex';
    score: number;
    factors: string[];
    migrationChallenges: string[];
  }> {
    let score = 0;
    const factors: string[] = [];
    const challenges: string[] = [];

    // Widget count factor
    const widgetCount = dashboard.widgets.length;
    if (widgetCount > 20) {
      score += 30;
      factors.push(`High widget count (${widgetCount})`);
      challenges.push('Large number of widgets may require optimization');
    } else if (widgetCount > 10) {
      score += 15;
      factors.push(`Moderate widget count (${widgetCount})`);
    }

    // Chart type complexity
    const complexChartTypes = ['heatmap', 'treemap', 'funnel', 'gauge'];
    const complexCharts = dashboard.widgets.filter(w => 
      complexChartTypes.includes(w.visualization.chartType)
    );
    if (complexCharts.length > 0) {
      score += 25;
      factors.push(`Complex chart types (${complexCharts.length})`);
      challenges.push('Advanced chart types may need alternative visualizations');
    }

    // Filter complexity
    const globalFilters = dashboard.filters.filter(f => f.isGlobal);
    if (globalFilters.length > 5) {
      score += 20;
      factors.push(`Many global filters (${globalFilters.length})`);
      challenges.push('Complex filter logic may require simplification');
    }

    // Data source relationships
    const hasComplexRelationships = dashboard.widgets.some(w => 
      w.dataSource.relationships.length > 2
    );
    if (hasComplexRelationships) {
      score += 25;
      factors.push('Complex data relationships');
      challenges.push('Multi-object relationships may need restructuring');
    }

    // Custom settings
    const hasCustomizations = dashboard.widgets.some(w => 
      w.settings.drilldownEnabled || w.settings.refreshInterval
    );
    if (hasCustomizations) {
      score += 15;
      factors.push('Custom widget settings');
    }

    let complexity: 'simple' | 'moderate' | 'complex';
    if (score >= 70) complexity = 'complex';
    else if (score >= 35) complexity = 'moderate';
    else complexity = 'simple';

    return { complexity, score, factors, migrationChallenges: challenges };
  }

  /**
   * Default capabilities for known CRM systems
   */
  private getDefaultCapabilities(crmSystem: string): CrmDashboardCapabilities {
    const defaultCapabilities: Record<string, CrmDashboardCapabilities> = {
      salesforce: {
        supportedWidgetTypes: ['chart', 'table', 'metric', 'kpi', 'list'],
        supportedChartTypes: ['bar', 'line', 'pie', 'donut', 'funnel', 'gauge'],
        supportedFilterTypes: ['text', 'number', 'date', 'picklist', 'multipicklist', 'boolean'],
        layoutOptions: ['grid', 'flex'],
        maxWidgetsPerDashboard: 20,
        customVisualizationsSupported: true,
        drilldownSupported: true,
        realTimeDataSupported: true,
        scheduledReportsSupported: true,
        embeddingSupported: true
      },
      hubspot: {
        supportedWidgetTypes: ['chart', 'table', 'metric', 'kpi'],
        supportedChartTypes: ['bar', 'line', 'pie', 'area'],
        supportedFilterTypes: ['text', 'number', 'date', 'picklist', 'boolean'],
        layoutOptions: ['grid'],
        maxWidgetsPerDashboard: 15,
        customVisualizationsSupported: false,
        drilldownSupported: true,
        realTimeDataSupported: false,
        scheduledReportsSupported: true,
        embeddingSupported: false
      }
    };

    return defaultCapabilities[crmSystem.toLowerCase()] || {
      supportedWidgetTypes: ['chart', 'table', 'metric'],
      supportedChartTypes: ['bar', 'line', 'pie'],
      supportedFilterTypes: ['text', 'number', 'date'],
      layoutOptions: ['grid'],
      maxWidgetsPerDashboard: 10,
      customVisualizationsSupported: false,
      drilldownSupported: false,
      realTimeDataSupported: false,
      scheduledReportsSupported: false,
      embeddingSupported: false
    };
  }
}

export const dashboardDiscoveryService = DashboardDiscoveryService.getInstance();
