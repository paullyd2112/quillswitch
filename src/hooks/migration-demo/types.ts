
export interface MigrationStep {
  id: string;
  name: string;
  status: 'idle' | 'in_progress' | 'complete';
  progress: number;
  recordSize?: number; // For data volume calculations
}

export interface MigrationHistoryPoint {
  timestamp: number;
  records: number;
}

export interface PerformanceMetrics {
  averageRecordsPerSecond?: number;
  peakRecordsPerSecond?: number;
  estimatedTimeRemaining?: number;
  totalRecordsProcessed?: number;
  dataVolume?: number;
}

export type MigrationStatus = "idle" | "loading" | "success" | "error";

export interface UseMigrationDemoReturn {
  migrationStatus: MigrationStatus;
  steps: MigrationStep[];
  overallProgress: number;
  activeStep?: MigrationStep;
  performanceMetrics?: PerformanceMetrics;
  errorMessage?: string;
  handleMigrationDemo: () => void;
}
