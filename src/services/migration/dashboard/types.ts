
export interface DashboardConfig {
  id: string;
  name: string;
  description?: string;
  crmSystem: string;
  layout: DashboardLayout;
  widgets: DashboardWidget[];
  filters: DashboardFilter[];
  permissions: DashboardPermissions;
  metadata: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardLayout {
  type: 'grid' | 'flex' | 'tabbed' | 'custom';
  columns: number;
  rows?: number;
  sections: LayoutSection[];
}

export interface LayoutSection {
  id: string;
  position: { x: number; y: number; width: number; height: number };
  widgetIds: string[];
}

export interface DashboardWidget {
  id: string;
  name: string;
  type: WidgetType;
  dataSource: DataSource;
  visualization: VisualizationConfig;
  filters: WidgetFilter[];
  position: WidgetPosition;
  settings: WidgetSettings;
}

export type WidgetType = 
  | 'chart' 
  | 'table' 
  | 'metric' 
  | 'kpi' 
  | 'funnel' 
  | 'gauge' 
  | 'text' 
  | 'list' 
  | 'calendar' 
  | 'pipeline';

export interface DataSource {
  objectType: string;
  fields: string[];
  relationships: DataRelationship[];
  aggregations: Aggregation[];
}

export interface DataRelationship {
  sourceField: string;
  targetObject: string;
  targetField: string;
  type: 'lookup' | 'master-detail' | 'junction';
}

export interface Aggregation {
  field: string;
  function: 'sum' | 'count' | 'avg' | 'min' | 'max' | 'distinct_count';
  groupBy?: string[];
}

export interface VisualizationConfig {
  chartType: ChartType;
  xAxis?: AxisConfig;
  yAxis?: AxisConfig;
  series: SeriesConfig[];
  colors: string[];
  legend: LegendConfig;
  styling: ChartStyling;
}

export type ChartType = 
  | 'bar' 
  | 'line' 
  | 'pie' 
  | 'donut' 
  | 'scatter' 
  | 'area' 
  | 'gauge' 
  | 'funnel' 
  | 'heatmap' 
  | 'treemap'
  | 'table';

export interface AxisConfig {
  field: string;
  label: string;
  type: 'category' | 'value' | 'time';
  format?: string;
  scale?: 'linear' | 'log' | 'time';
}

export interface SeriesConfig {
  field: string;
  name: string;
  type: ChartType;
  color?: string;
  stack?: string;
}

export interface LegendConfig {
  show: boolean;
  position: 'top' | 'bottom' | 'left' | 'right';
  align: 'start' | 'center' | 'end';
}

export interface ChartStyling {
  backgroundColor?: string;
  fontFamily?: string;
  fontSize?: number;
  borderRadius?: number;
  padding?: number;
}

export interface DashboardFilter {
  id: string;
  name: string;
  field: string;
  type: FilterType;
  operator: FilterOperator;
  value: any;
  defaultValue?: any;
  options?: FilterOption[];
  isGlobal: boolean;
  widgetIds: string[];
}

export type FilterType = 
  | 'text' 
  | 'number' 
  | 'date' 
  | 'datetime' 
  | 'picklist' 
  | 'multipicklist' 
  | 'boolean' 
  | 'user' 
  | 'record';

export type FilterOperator = 
  | 'equals' 
  | 'not_equals' 
  | 'contains' 
  | 'not_contains' 
  | 'starts_with' 
  | 'ends_with' 
  | 'greater_than' 
  | 'less_than' 
  | 'greater_equal' 
  | 'less_equal' 
  | 'between' 
  | 'in' 
  | 'not_in' 
  | 'is_null' 
  | 'is_not_null';

export interface FilterOption {
  label: string;
  value: any;
}

export interface WidgetFilter {
  field: string;
  operator: FilterOperator;
  value: any;
  isInherited: boolean;
}

export interface WidgetPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface WidgetSettings {
  title?: string;
  subtitle?: string;
  showTitle: boolean;
  showBorder: boolean;
  backgroundColor?: string;
  refreshInterval?: number;
  drilldownEnabled: boolean;
  exportEnabled: boolean;
}

export interface DashboardPermissions {
  owner: string;
  viewers: string[];
  editors: string[];
  isPublic: boolean;
  shareSettings: ShareSettings;
}

export interface ShareSettings {
  allowCopy: boolean;
  allowExport: boolean;
  passwordProtected: boolean;
  expiresAt?: string;
}

export interface DashboardMigrationResult {
  sourceConfig: DashboardConfig;
  destinationConfig: DashboardConfig;
  mappingResults: ComponentMappingResult[];
  migrationStatus: 'success' | 'partial' | 'failed';
  warnings: string[];
  errors: string[];
  unsupportedFeatures: string[];
}

export interface ComponentMappingResult {
  sourceComponent: string;
  destinationComponent: string;
  mappingType: 'exact' | 'equivalent' | 'approximation' | 'custom';
  confidence: number;
  notes?: string;
}

export interface CrmDashboardCapabilities {
  supportedWidgetTypes: WidgetType[];
  supportedChartTypes: ChartType[];
  supportedFilterTypes: FilterType[];
  layoutOptions: string[];
  maxWidgetsPerDashboard: number;
  customVisualizationsSupported: boolean;
  drilldownSupported: boolean;
  realTimeDataSupported: boolean;
  scheduledReportsSupported: boolean;
  embeddingSupported: boolean;
}
