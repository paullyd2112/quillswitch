
/**
 * Configuration for batch processing
 * Enhanced for enterprise workloads
 */
export interface BatchConfig {
  batchSize: number;
  concurrentBatches: number;
  retryAttempts: number;
  retryDelay: number; // in milliseconds
  priorityLevel?: 'low' | 'normal' | 'high'; // For enterprise queue management
  maxMemoryUsage?: number; // In MB, for resource constraints
  validationLevel?: 'none' | 'basic' | 'strict'; // For data validation
}

/**
 * Transfer progress information
 * Enhanced with enterprise-grade metrics
 */
export interface TransferProgress {
  totalRecords: number;
  processedRecords: number;
  failedRecords: number;
  percentage: number;
  currentBatch: number;
  totalBatches: number;
  startTime: Date;
  estimatedTimeRemaining: number | null; // in seconds
  status: 'initializing' | 'in_progress' | 'paused' | 'completed' | 'failed';
  processingRate?: number; // records per second
  checkpoint?: string; // For resumable transfers
  metrics?: {
    memoryUsage?: number; // In MB
    cpuUtilization?: number; // In percentage
    networkLatency?: number; // In ms
    throughput?: number; // Records per minute
  };
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

/**
 * Enterprise batch configuration for high-volume transfers
 */
export const ENTERPRISE_BATCH_CONFIG: BatchConfig = {
  batchSize: 250, // larger batch size for enterprise
  concurrentBatches: 5, // more concurrent processing
  retryAttempts: 5, // more retry attempts for reliability
  retryDelay: 3000, // longer delay between retries
  priorityLevel: 'high', // priority processing
  validationLevel: 'strict', // strict data validation
};

/**
 * Enterprise batch config for complex data objects (like opportunities with many fields)
 */
export const ENTERPRISE_COMPLEX_BATCH_CONFIG: BatchConfig = {
  batchSize: 75, // smaller batches for complex objects
  concurrentBatches: 4, // slightly lower concurrency
  retryAttempts: 5, // more retry attempts for reliability
  retryDelay: 3000, // longer delay between retries
  priorityLevel: 'normal', // normal priority
  validationLevel: 'strict', // strict data validation
};

/**
 * Enterprise batch config for simple data objects (like tags, categories)
 */
export const ENTERPRISE_SIMPLE_BATCH_CONFIG: BatchConfig = {
  batchSize: 500, // much larger batches for simple objects
  concurrentBatches: 8, // high concurrency
  retryAttempts: 3, // fewer retries needed for simple objects
  retryDelay: 2000, // shorter delay
  priorityLevel: 'low', // lower priority
  validationLevel: 'basic', // basic validation is sufficient
};
