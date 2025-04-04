
import { BatchConfig, TransferProgress } from "../../types/transferTypes";
import { updateProgress } from "../../utils/progressUtils";
import { ProcessItemFunction, ProgressCallback } from "./types";
import { 
  logBatchError, 
  logBatchProgress, 
  logItemError, 
  logTransferCompletion, 
  logTransferStart, 
  logWindowCompletion 
} from "./logService";

/**
 * Processes a single batch of data with error handling and retry logic
 */
export const processBatch = async <T>(
  batch: T[],
  batchIndex: number,
  processFn: ProcessItemFunction<T>,
  progress: TransferProgress,
  progressCallback: ProgressCallback,
  batchConfig: BatchConfig,
  projectId?: string,
  retry: number = 0
): Promise<number> => {
  const batchStartTime = Date.now();
  const successfulItems: number[] = [];
  
  progress.currentBatch = batchIndex + 1;
  progressCallback(progress);
  
  try {
    // Process each item in the batch
    await Promise.all(batch.map(async (item, itemIndex) => {
      try {
        const success = await processFn(item);
        
        if (success) {
          successfulItems.push(itemIndex);
        }
      } catch (error) {
        console.error(`Error processing item ${itemIndex} in batch ${batchIndex}:`, error);
        await logItemError(projectId, batchIndex, itemIndex, error);
      }
    }));
    
    // Update progress
    const updatedProgress = updateProgress(
      progress, 
      successfulItems.length, 
      batch.length - successfulItems.length
    );
    
    // Calculate and update time estimates for enterprise reporting
    const batchDuration = Date.now() - batchStartTime;
    const recordsPerMs = successfulItems.length / batchDuration;
    const remainingItems = updatedProgress.totalRecords - updatedProgress.processedRecords;
    
    if (recordsPerMs > 0 && remainingItems > 0) {
      const estimatedRemainingMs = remainingItems / recordsPerMs;
      updatedProgress.estimatedTimeRemaining = Math.ceil(estimatedRemainingMs / 1000); // in seconds
      updatedProgress.processingRate = recordsPerMs * 1000; // records per second
    }
    
    progressCallback(updatedProgress);
    
    // Log batch progress periodically
    await logBatchProgress(
      projectId,
      batchIndex + 1,
      updatedProgress.totalBatches,
      updatedProgress.processedRecords,
      updatedProgress.failedRecords,
      updatedProgress.estimatedTimeRemaining
    );
    
    return successfulItems.length;
  } catch (error) {
    console.error(`Error processing batch ${batchIndex}:`, error);
    
    // Log batch failure
    await logBatchError(projectId, batchIndex, error, retry, batchConfig.retryAttempts);
    
    // Enhanced retry logic with exponential backoff for enterprise reliability
    if (retry < batchConfig.retryAttempts) {
      console.log(`Retrying batch ${batchIndex}, attempt ${retry + 1} of ${batchConfig.retryAttempts}...`);
      const backoffDelay = batchConfig.retryDelay * Math.pow(2, retry); // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, backoffDelay));
      return processBatch(batch, batchIndex, processFn, progress, progressCallback, batchConfig, projectId, retry + 1);
    }
    
    // Update progress with failed items if all retries failed
    const updatedProgress = updateProgress(progress, 0, batch.length);
    progressCallback(updatedProgress);
    
    return 0;
  }
};

/**
 * Core batch processing functionality for data transfers
 * Enhanced for enterprise-scale migrations
 */
export const executeDataTransfer = async <T>(
  data: T[],
  processFn: ProcessItemFunction<T>,
  progressCallback: ProgressCallback,
  batchConfig: BatchConfig,
  initialProgress: TransferProgress,
  projectId?: string,
): Promise<TransferProgress> => {
  let progress = { ...initialProgress };
  
  // Update and report initial progress
  progressCallback(progress);
  
  // Create batches
  const batches: T[][] = [];
  for (let i = 0; i < data.length; i += batchConfig.batchSize) {
    batches.push(data.slice(i, i + batchConfig.batchSize));
  }
  
  progress.totalBatches = batches.length;
  progress.estimatedTimeRemaining = null; // Will be calculated after first batch
  progressCallback(progress);
  
  // Log start of processing
  await logTransferStart(projectId, data.length, batchConfig.batchSize, batchConfig.concurrentBatches);
  
  // Process batches with enhanced concurrency control and memory management
  // Using windowed approach to prevent too many items in memory at once
  const batchWindow = batchConfig.concurrentBatches * 2; // Process in windows
  
  for (let windowStart = 0; windowStart < batches.length; windowStart += batchWindow) {
    const windowEnd = Math.min(windowStart + batchWindow, batches.length);
    
    // Process current window of batches
    for (let i = windowStart; i < windowEnd; i += batchConfig.concurrentBatches) {
      const batchPromises: Promise<number>[] = [];
      
      for (let j = 0; j < batchConfig.concurrentBatches && i + j < windowEnd; j++) {
        batchPromises.push(processBatch(
          batches[i + j], 
          i + j, 
          processFn, 
          progress, 
          progressCallback, 
          batchConfig, 
          projectId
        ));
      }
      
      await Promise.all(batchPromises);
      
      // Give the system a small breather between concurrent batch sets
      // This helps prevent resource exhaustion in enterprise environments
      if (batchPromises.length === batchConfig.concurrentBatches) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    // Log window completion
    await logWindowCompletion(
      projectId,
      windowStart,
      batchWindow,
      progress.processedRecords,
      progress.failedRecords,
      progress.percentage
    );
  }
  
  // Mark as completed
  progress.status = 'completed';
  progress.estimatedTimeRemaining = 0;
  progressCallback(progress);
  
  // Log completion
  await logTransferCompletion(
    projectId,
    data.length,
    progress.processedRecords,
    progress.failedRecords
  );
  
  return progress;
};
