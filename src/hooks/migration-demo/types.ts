
export type MigrationStep = {
  name: string;
  status: 'pending' | 'in_progress' | 'complete';
  progress: number;
  // Record size to simulate data volume per record type
  recordSize?: number;
};

export type PerformanceMetrics = {
  averageRecordsPerSecond: number;
  peakRecordsPerSecond: number;
  estimatedTimeRemaining: number;
  totalRecordsProcessed: number;
  dataVolume: number;
};

export type MigrationStatus = "idle" | "loading" | "success";

export type MigrationHistoryPoint = {
  timestamp: number;
  records: number;
};

export type UseMigrationDemoReturn = {
  migrationStatus: MigrationStatus;
  steps: MigrationStep[];
  overallProgress: number;
  activeStep?: MigrationStep;
  performanceMetrics: Partial<PerformanceMetrics>;
  handleMigrationDemo: () => void;
};
