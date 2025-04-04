
export interface BatchConfig {
  batchSize: number;
  concurrentBatches: number;
  retryAttempts: number;
  retryDelay: number;
  validationLevel?: 'none' | 'basic' | 'strict';
}

export const DEFAULT_BATCH_CONFIG: BatchConfig = {
  batchSize: 50,
  concurrentBatches: 8, // Increased from 3 to 8
  retryAttempts: 3,
  retryDelay: 2000,
};

export const ENTERPRISE_BATCH_CONFIG: BatchConfig = {
  batchSize: 100,
  concurrentBatches: 10, // Already updated from 5 to 10
  retryAttempts: 5,
  retryDelay: 3000,
};

export const ENTERPRISE_SIMPLE_BATCH_CONFIG: BatchConfig = {
  batchSize: 200,
  concurrentBatches: 15, // Increased from 10 to 15
  retryAttempts: 3,
  retryDelay: 1000,
};

export const ENTERPRISE_COMPLEX_BATCH_CONFIG: BatchConfig = {
  batchSize: 50,
  concurrentBatches: 6, // Increased from 2 to 6
  retryAttempts: 5,
  retryDelay: 5000,
};

export interface TransferProgress {
  totalRecords: number;
  processedRecords: number;
  failedRecords: number;
  percentage: number;
  currentBatch: number;
  totalBatches: number;
  startTime: Date;
  estimatedTimeRemaining: number | null;
  status: "initializing" | "in_progress" | "paused" | "completed" | "failed";
  processingRate: number;
  peakProcessingRate?: number;
  dataVolume?: number;
  processingHistory?: Array<{
    timestamp: number;
    processed: number;
    rate: number;
  }>;
  checkpoint?: any;
}
