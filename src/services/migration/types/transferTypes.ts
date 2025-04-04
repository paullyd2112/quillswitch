
/**
 * Configuration for batch processing
 */
export interface BatchConfig {
  batchSize: number;
  concurrentBatches: number;
  retryAttempts: number;
  retryDelay: number; // in milliseconds
}

/**
 * Transfer progress information
 */
export interface TransferProgress {
  totalRecords: number;
  processedRecords: number;
  failedRecords: number;
  percentage: number;
  currentBatch: number;
  totalBatches: number;
  startTime: Date;
  estimatedTimeRemaining?: number; // in seconds
  status: 'initializing' | 'in_progress' | 'paused' | 'completed' | 'failed';
}

/**
 * Default batch configuration
 */
export const DEFAULT_BATCH_CONFIG: BatchConfig = {
  batchSize: 100, // process 100 records per batch
  concurrentBatches: 3, // process 3 batches concurrently
  retryAttempts: 3, // retry failed batches 3 times
  retryDelay: 2000, // wait 2 seconds between retries
};
