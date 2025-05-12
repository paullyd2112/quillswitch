export type MigrationStatus = "idle" | "loading" | "success" | "error";

export type MigrationStep = {
  id: string;
  name: string;
  description: string;
  progress: number;
  status: "idle" | "in-progress" | "completed" | "error";
  recordSize?: number;
};

// Make sure all fields are optional in Partial
export type MigrationHistoryPoint = {
  timestamp: number;
  records: number;
  memoryUsage?: number;
  networkSpeed?: number;
  cpuUtilization?: number;
};

export type PerformanceMetrics = {
  averageRecordsPerSecond: number;
  peakRecordsPerSecond: number;
  estimatedTimeRemaining: number;
  totalRecordsProcessed: number;
  dataVolume: number;
  memoryUsage: number;
  networkSpeed: number;
  cpuUtilization: number;
  progressHistory: MigrationHistoryPoint[];
};

export type FormattedTimeSpan = {
  hours: number;
  minutes: number;
  seconds: number;
  formatted: string;
};

export type MigrationPerformanceData = {
  time: number;
  timeLabel: string;
  records: number;
  memory: number;
  network: number;
};

export interface UseMigrationDemoReturn {
  migrationStatus: MigrationStatus;
  steps: MigrationStep[];
  overallProgress: number;
  activeStep?: MigrationStep;
  performanceMetrics?: Partial<PerformanceMetrics>;
  errorMessage?: string;
  handleMigrationDemo: () => void;
}
