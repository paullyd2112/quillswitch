
import { logUserActivity } from "../../activityService";

/**
 * Logs a batch processing event
 */
export const logBatchEvent = async (
  projectId: string | undefined,
  eventType: string,
  description: string,
  details: any
): Promise<void> => {
  if (!projectId) return;
  
  await logUserActivity({
    project_id: projectId,
    activity_type: eventType,
    activity_description: description,
    activity_details: details
  });
};

/**
 * Logs the start of a data transfer process
 */
export const logTransferStart = async (
  projectId: string | undefined,
  dataLength: number,
  batchSize: number,
  concurrentBatches: number
): Promise<void> => {
  if (!projectId) return;
  
  await logBatchEvent(
    projectId,
    'transfer_started',
    `Started processing ${dataLength} records with batch size ${batchSize}`,
    {
      totalRecords: dataLength,
      batchSize,
      concurrentBatches
    }
  );
};

/**
 * Logs the completion of a data transfer process
 */
export const logTransferCompletion = async (
  projectId: string | undefined,
  totalRecords: number,
  processedRecords: number,
  failedRecords: number
): Promise<void> => {
  if (!projectId) return;
  
  await logBatchEvent(
    projectId,
    'transfer_completed',
    `Completed processing ${totalRecords} records with ${failedRecords} failures`,
    {
      totalRecords,
      processedRecords,
      failedRecords,
      successRate: ((processedRecords - failedRecords) / processedRecords) * 100
    }
  );
};

/**
 * Logs a batch error event
 */
export const logBatchError = async (
  projectId: string | undefined,
  batchIndex: number,
  error: unknown,
  retryAttempt: number,
  maxRetries: number
): Promise<void> => {
  if (!projectId) return;
  
  await logBatchEvent(
    projectId,
    'batch_failure',
    `Failed to process batch ${batchIndex}`,
    {
      batchIndex,
      error: error instanceof Error ? error.message : String(error),
      retryAttempt: retryAttempt + 1,
      maxRetries
    }
  );
};

/**
 * Logs an item processing error
 */
export const logItemError = async (
  projectId: string | undefined,
  batchIndex: number,
  itemIndex: number,
  error: unknown
): Promise<void> => {
  if (!projectId) return;
  
  await logBatchEvent(
    projectId,
    'item_error',
    `Error processing item in batch ${batchIndex}`,
    {
      batchIndex,
      itemIndex,
      error: error instanceof Error ? error.message : String(error)
    }
  );
};

/**
 * Logs batch progress information
 */
export const logBatchProgress = async (
  projectId: string | undefined,
  currentBatch: number,
  totalBatches: number,
  processedRecords: number,
  failedRecords: number,
  estimatedTimeRemaining: number | null
): Promise<void> => {
  if (!projectId) return;
  
  // Only log every 10 batches to avoid excessive logging
  if (currentBatch % 10 !== 0) return;
  
  await logBatchEvent(
    projectId,
    'batch_progress',
    `Completed ${currentBatch} of ${totalBatches} batches`,
    {
      currentBatch,
      totalBatches,
      successRate: processedRecords > 0 ? 
        (processedRecords - failedRecords) / processedRecords : 0,
      estimatedTimeRemaining
    }
  );
};

/**
 * Logs window completion for tracking progress of large transfers
 */
export const logWindowCompletion = async (
  projectId: string | undefined,
  windowStart: number,
  windowEnd: number,
  processedRecords: number,
  failedRecords: number,
  percentage: number
): Promise<void> => {
  if (!projectId) return;
  
  await logBatchEvent(
    projectId,
    'window_complete',
    `Completed processing window ${Math.ceil(windowStart / windowEnd) + 1}`,
    {
      windowStart,
      windowEnd,
      processedRecords,
      failedRecords,
      percentComplete: percentage
    }
  );
};

/**
 * Logs streaming-specific transfer events
 */
export const logStreamingProgress = async (
  projectId: string | undefined,
  processedRecords: number,
  totalRecords: number,
  failedRecords: number,
  percentage: number,
  batchCount: number
): Promise<void> => {
  if (!projectId) return;
  
  // Log periodically to avoid excessive logging
  if (batchCount % 10 !== 0) return;
  
  await logBatchEvent(
    projectId,
    'streaming_progress',
    `Processed ${processedRecords} of ${totalRecords} records`,
    {
      processedRecords,
      failedRecords,
      percentComplete: percentage
    }
  );
};

/**
 * Logs streaming transfer completion
 */
export const logStreamingCompletion = async (
  projectId: string | undefined,
  totalRecords: number,
  processedRecords: number,
  failedRecords: number
): Promise<void> => {
  if (!projectId) return;
  
  await logBatchEvent(
    projectId,
    'streaming_transfer_completed',
    `Completed streaming process for ${totalRecords} records with ${failedRecords} failures`,
    {
      totalRecords,
      processedRecords,
      failedRecords,
      successRate: processedRecords > 0 ? 
        ((processedRecords - failedRecords) / processedRecords) * 100 : 0
    }
  );
};

/**
 * Logs streaming transfer start
 */
export const logStreamingStart = async (
  projectId: string | undefined,
  totalRecords: number,
  batchSize: number,
  concurrentBatches: number
): Promise<void> => {
  if (!projectId) return;
  
  await logBatchEvent(
    projectId,
    'streaming_transfer_started',
    `Started streaming process for ${totalRecords} records`,
    {
      totalRecords,
      batchSize,
      concurrentBatches
    }
  );
};

/**
 * Logs streaming transfer errors
 */
export const logStreamingError = async (
  projectId: string | undefined,
  error: unknown,
  cursor: string | null,
  batchCount: number
): Promise<void> => {
  if (!projectId) return;
  
  await logBatchEvent(
    projectId,
    'streaming_error',
    `Error during streaming data transfer`,
    {
      error: error instanceof Error ? error.message : String(error),
      cursor,
      batchCount
    }
  );
};
