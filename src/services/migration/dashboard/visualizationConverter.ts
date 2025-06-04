
import { VisualizationConfig, ChartType, AxisConfig, SeriesConfig, CrmDashboardCapabilities } from "./types";
import { dashboardMappingEngine } from "./mappingEngine";

/**
 * Visualization Converter
 * Transforms chart types and report formats between CRM systems
 */
export class VisualizationConverter {
  private static instance: VisualizationConverter;

  public static getInstance(): VisualizationConverter {
    if (!VisualizationConverter.instance) {
      VisualizationConverter.instance = new VisualizationConverter();
    }
    return VisualizationConverter.instance;
  }

  /**
   * Convert visualization from source to destination format
   */
  async convertVisualization(
    sourceViz: VisualizationConfig,
    destinationCapabilities: CrmDashboardCapabilities
  ): Promise<{
    visualization: VisualizationConfig;
    conversionNotes: string[];
    dataLoss: boolean;
  }> {
    const conversionNotes: string[] = [];
    let dataLoss = false;

    // Convert chart type
    const chartMapping = dashboardMappingEngine.mapChartType(sourceViz.chartType, destinationCapabilities);
    if (!chartMapping.type) {
      throw new Error(`Cannot convert chart type: ${sourceViz.chartType}`);
    }

    if (chartMapping.confidence < 1.0) {
      conversionNotes.push(chartMapping.notes || 'Chart type converted with modifications');
      if (chartMapping.confidence < 0.7) {
        dataLoss = true;
      }
    }

    // Convert axes configuration
    const convertedXAxis = this.convertAxis(sourceViz.xAxis, chartMapping.type);
    const convertedYAxis = this.convertAxis(sourceViz.yAxis, chartMapping.type);

    // Convert series configuration
    const convertedSeries = this.convertSeries(sourceViz.series, chartMapping.type, conversionNotes);

    // Adapt colors and styling
    const adaptedColors = this.adaptColors(sourceViz.colors, destinationCapabilities);
    const adaptedStyling = this.adaptStyling(sourceViz.styling, destinationCapabilities);

    const convertedVisualization: VisualizationConfig = {
      chartType: chartMapping.type,
      xAxis: convertedXAxis,
      yAxis: convertedYAxis,
      series: convertedSeries,
      colors: adaptedColors,
      legend: { ...sourceViz.legend },
      styling: adaptedStyling
    };

    return {
      visualization: convertedVisualization,
      conversionNotes,
      dataLoss
    };
  }

  /**
   * Convert axis configuration for new chart type
   */
  private convertAxis(axis: AxisConfig | undefined, newChartType: ChartType): AxisConfig | undefined {
    if (!axis) return undefined;

    const converted = { ...axis };

    // Adjust axis configuration based on chart type
    switch (newChartType) {
      case 'pie':
      case 'donut':
        // Pie charts don't use traditional axes
        return undefined;
      
      case 'gauge':
        // Gauges typically only use value axis
        if (axis.type === 'category') {
          converted.type = 'value';
        }
        break;
      
      case 'heatmap':
        // Ensure both axes are categorical for heatmaps
        if (axis.type === 'value') {
          converted.type = 'category';
        }
        break;
    }

    return converted;
  }

  /**
   * Convert series configuration for new chart type
   */
  private convertSeries(
    series: SeriesConfig[], 
    newChartType: ChartType, 
    notes: string[]
  ): SeriesConfig[] {
    return series.map(s => {
      const converted = { ...s };

      // Adjust series type to match chart type
      if (s.type !== newChartType) {
        converted.type = newChartType;
        notes.push(`Series type changed from ${s.type} to ${newChartType}`);
      }

      // Handle specific chart type requirements
      switch (newChartType) {
        case 'pie':
        case 'donut':
          // Pie charts typically show one series
          if (series.length > 1) {
            notes.push('Multiple series combined for pie chart');
          }
          break;
        
        case 'gauge':
          // Gauges show single value
          converted.name = converted.name || 'Value';
          break;
        
        case 'funnel':
          // Funnel charts need ordered data
          notes.push('Data may need reordering for funnel visualization');
          break;
      }

      return converted;
    });
  }

  /**
   * Adapt color scheme for destination platform
   */
  private adaptColors(colors: string[], capabilities: CrmDashboardCapabilities): string[] {
    // Use default colors if none provided
    if (!colors || colors.length === 0) {
      return this.getDefaultColorPalette();
    }

    // Validate colors and provide fallbacks
    const validColors = colors.filter(color => this.isValidColor(color));
    if (validColors.length < colors.length) {
      // Fill missing colors with defaults
      const defaultPalette = this.getDefaultColorPalette();
      while (validColors.length < colors.length) {
        validColors.push(defaultPalette[validColors.length % defaultPalette.length]);
      }
    }

    return validColors;
  }

  /**
   * Adapt styling for destination platform
   */
  private adaptStyling(styling: any, capabilities: CrmDashboardCapabilities): any {
    const adapted = { ...styling };

    // Ensure safe font family
    if (adapted.fontFamily && !this.isSafeFontFamily(adapted.fontFamily)) {
      adapted.fontFamily = 'Arial, sans-serif';
    }

    // Validate numeric values
    if (adapted.fontSize && (adapted.fontSize < 8 || adapted.fontSize > 24)) {
      adapted.fontSize = 12;
    }

    if (adapted.padding && (adapted.padding < 0 || adapted.padding > 50)) {
      adapted.padding = 10;
    }

    if (adapted.borderRadius && (adapted.borderRadius < 0 || adapted.borderRadius > 20)) {
      adapted.borderRadius = 4;
    }

    return adapted;
  }

  /**
   * Convert complex chart types to simpler alternatives
   */
  convertComplexChart(
    sourceType: ChartType, 
    data: any[], 
    destinationType: ChartType
  ): {
    convertedData: any[];
    instructions: string[];
  } {
    const instructions: string[] = [];

    switch (sourceType) {
      case 'heatmap':
        return this.convertHeatmapData(data, destinationType, instructions);
      
      case 'treemap':
        return this.convertTreemapData(data, destinationType, instructions);
      
      case 'funnel':
        return this.convertFunnelData(data, destinationType, instructions);
      
      case 'gauge':
        return this.convertGaugeData(data, destinationType, instructions);
      
      default:
        return { convertedData: data, instructions };
    }
  }

  /**
   * Convert heatmap data to alternative format
   */
  private convertHeatmapData(data: any[], targetType: ChartType, instructions: string[]): {
    convertedData: any[];
    instructions: string[];
  } {
    if (targetType === 'bar') {
      // Convert 2D heatmap to grouped bar chart
      const converted = data.map(row => ({
        category: `${row.x} - ${row.y}`,
        value: row.value,
        group: row.x
      }));
      instructions.push('Heatmap converted to grouped bar chart with concatenated labels');
      return { convertedData: converted, instructions };
    }

    if (targetType === 'table') {
      // Convert to table format
      instructions.push('Heatmap converted to table format');
      return { convertedData: data, instructions };
    }

    return { convertedData: data, instructions };
  }

  /**
   * Convert treemap data to alternative format
   */
  private convertTreemapData(data: any[], targetType: ChartType, instructions: string[]): {
    convertedData: any[];
    instructions: string[];
  } {
    if (targetType === 'pie') {
      // Flatten hierarchy for pie chart
      const converted = data.map(item => ({
        name: item.name,
        value: item.value
      }));
      instructions.push('Treemap hierarchy flattened for pie chart');
      return { convertedData: converted, instructions };
    }

    if (targetType === 'bar') {
      // Convert to hierarchical bar chart
      const converted = data.map(item => ({
        category: item.name,
        value: item.value,
        parent: item.parent || null
      }));
      instructions.push('Treemap converted to hierarchical bar chart');
      return { convertedData: converted, instructions };
    }

    return { convertedData: data, instructions };
  }

  /**
   * Convert funnel data to alternative format
   */
  private convertFunnelData(data: any[], targetType: ChartType, instructions: string[]): {
    convertedData: any[];
    instructions: string[];
  } {
    if (targetType === 'bar') {
      // Convert to horizontal bar chart
      const converted = data.map((item, index) => ({
        stage: item.name,
        value: item.value,
        conversionRate: index > 0 ? (item.value / data[index - 1].value) * 100 : 100,
        order: index
      }));
      instructions.push('Funnel converted to horizontal bar chart with conversion rates');
      return { convertedData: converted, instructions };
    }

    if (targetType === 'area') {
      // Convert to area chart showing progression
      const converted = data.map((item, index) => ({
        x: index,
        y: item.value,
        stage: item.name
      }));
      instructions.push('Funnel converted to area chart showing value progression');
      return { convertedData: converted, instructions };
    }

    return { convertedData: data, instructions };
  }

  /**
   * Convert gauge data to alternative format
   */
  private convertGaugeData(data: any[], targetType: ChartType, instructions: string[]): {
    convertedData: any[];
    instructions: string[];
  } {
    if (targetType === 'bar') {
      // Convert to progress bar
      const converted = [{
        category: 'Progress',
        current: data[0]?.value || 0,
        target: data[0]?.target || 100,
        percentage: ((data[0]?.value || 0) / (data[0]?.target || 100)) * 100
      }];
      instructions.push('Gauge converted to progress bar chart');
      return { convertedData: converted, instructions };
    }

    return { convertedData: data, instructions };
  }

  /**
   * Utility methods
   */
  private isValidColor(color: string): boolean {
    const hexPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    const rgbPattern = /^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/;
    const namedColors = ['red', 'blue', 'green', 'yellow', 'orange', 'purple', 'pink', 'brown', 'gray', 'black', 'white'];
    
    return hexPattern.test(color) || rgbPattern.test(color) || namedColors.includes(color.toLowerCase());
  }

  private getDefaultColorPalette(): string[] {
    return [
      '#4F46E5', '#06B6D4', '#10B981', '#F59E0B', 
      '#EF4444', '#8B5CF6', '#EC4899', '#6B7280'
    ];
  }

  private isSafeFontFamily(fontFamily: string): boolean {
    const safeFonts = [
      'Arial', 'Helvetica', 'Times New Roman', 'Times', 'Courier New', 
      'Courier', 'Verdana', 'Georgia', 'Palatino', 'Garamond', 
      'sans-serif', 'serif', 'monospace'
    ];
    
    return safeFonts.some(font => fontFamily.toLowerCase().includes(font.toLowerCase()));
  }
}

export const visualizationConverter = VisualizationConverter.getInstance();
