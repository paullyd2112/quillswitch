
// This file is kept for backwards compatibility but no longer used in the home page
// Re-export an empty object to prevent import errors elsewhere in the codebase
export const useMigrationDemo = () => ({
  migrationStatus: "idle" as "idle" | "loading" | "success" | "error",
  steps: [],
  overallProgress: 0,
  activeStep: undefined,
  performanceMetrics: undefined,
  errorMessage: undefined,
  handleMigrationDemo: () => {}
});

export type MigrationStep = {
  id: string;
  name: string;
  status: 'idle' | 'in_progress' | 'complete';
  progress: number;
  recordSize?: number;
};

export interface PerformanceMetrics {
  averageRecordsPerSecond?: number;
  peakRecordsPerSecond?: number;
  estimatedTimeRemaining?: number;
  totalRecordsProcessed?: number;
  dataVolume?: number;
  memoryUsage?: number;
  networkSpeed?: number;
  cpuUtilization?: number;
}
