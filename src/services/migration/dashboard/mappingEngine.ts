
import { DashboardConfig, WidgetType, ChartType, FilterType, ComponentMappingResult, CrmDashboardCapabilities } from "./types";
import { dashboardDiscoveryService } from "./discoveryService";

/**
 * Dashboard Mapping Engine
 * Maps dashboard components between different CRM systems
 */
export class DashboardMappingEngine {
  private static instance: DashboardMappingEngine;

  public static getInstance(): DashboardMappingEngine {
    if (!DashboardMappingEngine.instance) {
      DashboardMappingEngine.instance = new DashboardMappingEngine();
    }
    return DashboardMappingEngine.instance;
  }

  /**
   * Create mapping between source and destination dashboards
   */
  async createDashboardMapping(
    sourceDashboard: DashboardConfig,
    destinationCrm: string
  ): Promise<ComponentMappingResult[]> {
    const destinationCapabilities = await dashboardDiscoveryService.getCrmCapabilities(destinationCrm);
    const mappingResults: ComponentMappingResult[] = [];

    // Map widgets
    for (const widget of sourceDashboard.widgets) {
      const widgetMapping = this.mapWidget(widget, destinationCapabilities);
      mappingResults.push(widgetMapping);
    }

    // Map filters
    for (const filter of sourceDashboard.filters) {
      const filterMapping = this.mapFilter(filter, destinationCapabilities);
      mappingResults.push(filterMapping);
    }

    // Map layout
    const layoutMapping = this.mapLayout(sourceDashboard.layout, destinationCapabilities);
    mappingResults.push(layoutMapping);

    return mappingResults;
  }

  /**
   * Map widget types between CRM systems
   */
  private mapWidget(widget: any, capabilities: CrmDashboardCapabilities): ComponentMappingResult {
    const sourceType = widget.type as WidgetType;
    
    // Direct mapping if supported
    if (capabilities.supportedWidgetTypes.includes(sourceType)) {
      return {
        sourceComponent: `widget:${widget.id}:${sourceType}`,
        destinationComponent: sourceType,
        mappingType: 'exact',
        confidence: 1.0
      };
    }

    // Find best alternative
    const alternative = this.findWidgetAlternative(sourceType, capabilities);
    if (alternative) {
      return {
        sourceComponent: `widget:${widget.id}:${sourceType}`,
        destinationComponent: alternative.type,
        mappingType: 'equivalent',
        confidence: alternative.confidence,
        notes: alternative.notes
      };
    }

    // No mapping possible
    return {
      sourceComponent: `widget:${widget.id}:${sourceType}`,
      destinationComponent: 'unsupported',
      mappingType: 'custom',
      confidence: 0,
      notes: `Widget type '${sourceType}' not supported in destination CRM`
    };
  }

  /**
   * Map chart types between CRM systems
   */
  mapChartType(sourceChart: ChartType, capabilities: CrmDashboardCapabilities): {
    type: ChartType | null;
    confidence: number;
    notes?: string;
  } {
    // Direct mapping
    if (capabilities.supportedChartTypes.includes(sourceChart)) {
      return { type: sourceChart, confidence: 1.0 };
    }

    // Alternative mappings
    const chartMappings: Record<ChartType, { alternatives: ChartType[]; notes: string }> = {
      heatmap: { 
        alternatives: ['bar', 'table'], 
        notes: 'Heatmap converted to bar chart or table format' 
      },
      treemap: { 
        alternatives: ['pie', 'bar'], 
        notes: 'Treemap converted to pie chart or hierarchical bar chart' 
      },
      funnel: { 
        alternatives: ['bar', 'area'], 
        notes: 'Funnel converted to stacked bar or area chart' 
      },
      gauge: { 
        alternatives: ['bar', 'line'], 
        notes: 'Gauge converted to progress bar or trend line' 
      },
      scatter: { 
        alternatives: ['line', 'bar'], 
        notes: 'Scatter plot converted to line or bar chart' 
      },
      area: { 
        alternatives: ['line', 'bar'], 
        notes: 'Area chart converted to line or stacked bar chart' 
      },
      donut: { 
        alternatives: ['pie', 'bar'], 
        notes: 'Donut chart converted to pie or bar chart' 
      },
      bar: { alternatives: ['line'], notes: 'Bar chart as line chart' },
      line: { alternatives: ['bar'], notes: 'Line chart as bar chart' },
      pie: { alternatives: ['bar'], notes: 'Pie chart as bar chart' }
    };

    const mapping = chartMappings[sourceChart];
    if (mapping) {
      for (const alternative of mapping.alternatives) {
        if (capabilities.supportedChartTypes.includes(alternative)) {
          return {
            type: alternative,
            confidence: 0.7,
            notes: mapping.notes
          };
        }
      }
    }

    return { type: null, confidence: 0, notes: `No suitable alternative for ${sourceChart}` };
  }

  /**
   * Map filter types between CRM systems
   */
  private mapFilter(filter: any, capabilities: CrmDashboardCapabilities): ComponentMappingResult {
    const sourceType = filter.type as FilterType;

    if (capabilities.supportedFilterTypes.includes(sourceType)) {
      return {
        sourceComponent: `filter:${filter.id}:${sourceType}`,
        destinationComponent: sourceType,
        mappingType: 'exact',
        confidence: 1.0
      };
    }

    const alternative = this.findFilterAlternative(sourceType, capabilities);
    if (alternative) {
      return {
        sourceComponent: `filter:${filter.id}:${sourceType}`,
        destinationComponent: alternative.type,
        mappingType: 'equivalent',
        confidence: alternative.confidence,
        notes: alternative.notes
      };
    }

    return {
      sourceComponent: `filter:${filter.id}:${sourceType}`,
      destinationComponent: 'unsupported',
      mappingType: 'custom',
      confidence: 0,
      notes: `Filter type '${sourceType}' not supported`
    };
  }

  /**
   * Map layout between CRM systems
   */
  private mapLayout(layout: any, capabilities: CrmDashboardCapabilities): ComponentMappingResult {
    if (capabilities.layoutOptions.includes(layout.type)) {
      return {
        sourceComponent: `layout:${layout.type}`,
        destinationComponent: layout.type,
        mappingType: 'exact',
        confidence: 1.0
      };
    }

    // Default to grid layout if available
    if (capabilities.layoutOptions.includes('grid')) {
      return {
        sourceComponent: `layout:${layout.type}`,
        destinationComponent: 'grid',
        mappingType: 'equivalent',
        confidence: 0.8,
        notes: `Layout converted from ${layout.type} to grid`
      };
    }

    return {
      sourceComponent: `layout:${layout.type}`,
      destinationComponent: capabilities.layoutOptions[0] || 'basic',
      mappingType: 'approximation',
      confidence: 0.5,
      notes: 'Layout significantly modified due to platform limitations'
    };
  }

  /**
   * Find alternative widget type
   */
  private findWidgetAlternative(sourceType: WidgetType, capabilities: CrmDashboardCapabilities): {
    type: WidgetType;
    confidence: number;
    notes: string;
  } | null {
    const alternatives: Record<WidgetType, { type: WidgetType; confidence: number; notes: string }[]> = {
      funnel: [
        { type: 'chart', confidence: 0.8, notes: 'Funnel as stacked bar chart' },
        { type: 'table', confidence: 0.6, notes: 'Funnel data as table' }
      ],
      gauge: [
        { type: 'metric', confidence: 0.7, notes: 'Gauge as metric display' },
        { type: 'chart', confidence: 0.6, notes: 'Gauge as progress bar chart' }
      ],
      calendar: [
        { type: 'table', confidence: 0.6, notes: 'Calendar events as table' },
        { type: 'list', confidence: 0.7, notes: 'Calendar events as list' }
      ],
      pipeline: [
        { type: 'chart', confidence: 0.8, notes: 'Pipeline as horizontal bar chart' },
        { type: 'table', confidence: 0.7, notes: 'Pipeline stages as table' }
      ],
      chart: [],
      table: [],
      metric: [],
      kpi: [
        { type: 'metric', confidence: 0.9, notes: 'KPI as metric widget' }
      ],
      text: [
        { type: 'metric', confidence: 0.5, notes: 'Text as metric display' }
      ],
      list: [
        { type: 'table', confidence: 0.8, notes: 'List as table format' }
      ]
    };

    const alts = alternatives[sourceType] || [];
    for (const alt of alts) {
      if (capabilities.supportedWidgetTypes.includes(alt.type)) {
        return alt;
      }
    }

    return null;
  }

  /**
   * Find alternative filter type
   */
  private findFilterAlternative(sourceType: FilterType, capabilities: CrmDashboardCapabilities): {
    type: FilterType;
    confidence: number;
    notes: string;
  } | null {
    const alternatives: Record<FilterType, { type: FilterType; confidence: number; notes: string }[]> = {
      multipicklist: [
        { type: 'picklist', confidence: 0.7, notes: 'Multi-select converted to single select' }
      ],
      user: [
        { type: 'picklist', confidence: 0.8, notes: 'User filter as dropdown list' }
      ],
      record: [
        { type: 'text', confidence: 0.6, notes: 'Record lookup as text search' }
      ],
      datetime: [
        { type: 'date', confidence: 0.8, notes: 'DateTime simplified to date only' }
      ],
      text: [],
      number: [],
      date: [],
      picklist: [],
      boolean: []
    };

    const alts = alternatives[sourceType] || [];
    for (const alt of alts) {
      if (capabilities.supportedFilterTypes.includes(alt.type)) {
        return alt;
      }
    }

    return null;
  }

  /**
   * Calculate overall mapping confidence
   */
  calculateMappingConfidence(mappingResults: ComponentMappingResult[]): number {
    if (mappingResults.length === 0) return 0;
    
    const totalConfidence = mappingResults.reduce((sum, result) => sum + result.confidence, 0);
    return totalConfidence / mappingResults.length;
  }

  /**
   * Get mapping summary
   */
  getMappingSummary(mappingResults: ComponentMappingResult[]): {
    exactMappings: number;
    equivalentMappings: number;
    approximateMappings: number;
    unsupportedComponents: number;
    overallConfidence: number;
  } {
    const exact = mappingResults.filter(r => r.mappingType === 'exact').length;
    const equivalent = mappingResults.filter(r => r.mappingType === 'equivalent').length;
    const approximate = mappingResults.filter(r => r.mappingType === 'approximation').length;
    const unsupported = mappingResults.filter(r => r.confidence === 0).length;

    return {
      exactMappings: exact,
      equivalentMappings: equivalent,
      approximateMappings: approximate,
      unsupportedComponents: unsupported,
      overallConfidence: this.calculateMappingConfidence(mappingResults)
    };
  }
}

export const dashboardMappingEngine = DashboardMappingEngine.getInstance();
