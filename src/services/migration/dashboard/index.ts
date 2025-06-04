
// Dashboard Migration Services
export { dashboardDiscoveryService } from './discoveryService';
export { dashboardMappingEngine } from './mappingEngine';
export { visualizationConverter } from './visualizationConverter';
export { filterTranslationService } from './filterTranslationService';
export { dashboardRecreationService } from './recreationService';
export { dashboardMigrationService } from './dashboardMigrationService';

// Types
export type {
  DashboardConfig,
  DashboardWidget,
  VisualizationConfig,
  DashboardFilter,
  DashboardMigrationResult,
  ComponentMappingResult,
  CrmDashboardCapabilities,
  WidgetType,
  ChartType,
  FilterType,
  FilterOperator
} from './types';
