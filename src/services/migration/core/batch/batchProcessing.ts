
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
 * Optimized batch processing with improved memory management and error handling
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
  const failedItemIndices: number[] = [];
  
  progress.currentBatch = batchIndex + 1;
  progressCallback(progress);
  
  try {
    // Process each item in the batch with chunking for better memory management
    const chunkSize = 10; // Process 10 items at a time within a batch
    for (let i = 0; i < batch.length; i += chunkSize) {
      const chunk = batch.slice(i, i + chunkSize);
      
      // Process chunk items in parallel
      const results = await Promise.allSettled(
        chunk.map(async (item, chunkItemIndex) => {
          const itemIndex = i + chunkItemIndex;
          try {
            const success = await processFn(item);
            return { index: itemIndex, success };
          } catch (error) {
            console.error(`Error processing item ${itemIndex} in batch ${batchIndex}:`, error);
            await logItemError(projectId, batchIndex, itemIndex, error);
            return { index: itemIndex, success: false, error };
          }
        })
      );
      
      // Process results from this chunk
      results.forEach(result => {
        if (result.status === 'fulfilled') {
          if (result.value.success) {
            successfulItems.push(result.value.index);
          } else {
            failedItemIndices.push(result.value.index);
          }
        } else {
          // Should not happen but handle just in case
          console.error(`Unexpected promise rejection in batch ${batchIndex}:`, result.reason);
          failedItemIndices.push(-1); // Mark as failed but don't know which item
        }
      });
      
      // Update progress more frequently (after each chunk)
      const updatedProgress = updateProgress(
        progress, 
        successfulItems.length, 
        failedItemIndices.length
      );
      
      // Calculate and update time estimates
      const batchDuration = Date.now() - batchStartTime;
      const recordsPerMs = successfulItems.length / batchDuration;
      const remainingItems = updatedProgress.totalRecords - updatedProgress.processedRecords;
      
      if (recordsPerMs > 0 && remainingItems > 0) {
        updatedProgress.estimatedTimeRemaining = Math.ceil(remainingItems / recordsPerMs / 1000); // in seconds
        updatedProgress.processingRate = recordsPerMs * 1000; // records per second
        
        // Update peak processing rate if current rate is higher
        if (updatedProgress.processingRate > (updatedProgress.peakProcessingRate || 0)) {
          updatedProgress.peakProcessingRate = updatedProgress.processingRate;
        }
      }
      
      progressCallback(updatedProgress);
    }
    
    // Log batch progress
    await logBatchProgress(
      projectId,
      batchIndex + 1,
      progress.totalBatches,
      progress.processedRecords,
      progress.failedRecords,
      progress.estimatedTimeRemaining
    );
    
    return successfulItems.length;
  } catch (error) {
    console.error(`Critical error processing batch ${batchIndex}:`, error);
    
    // Log batch failure
    await logBatchError(projectId, batchIndex, error, retry, batchConfig.retryAttempts);
    
    // Enhanced retry logic with adaptive backoff
    if (retry < batchConfig.retryAttempts) {
      console.log(`Retrying batch ${batchIndex}, attempt ${retry + 1} of ${batchConfig.retryAttempts}...`);
      // Implement adaptive backoff - increase delay for consecutive failures
      const backoffDelay = batchConfig.retryDelay * Math.pow(1.5, retry); // 1.5x exponential backoff
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
 * Enhanced batch processing with advanced scheduling and resource management
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
  
  // Create batches with optimized sizes based on data characteristics
  const batches: T[][] = [];
  // Adapt batch size based on total data volume to balance throughput and memory usage
  const adaptedBatchSize = Math.min(
    batchConfig.batchSize,
    Math.max(10, Math.ceil(data.length / 100)) // At least 10 items per batch, but try to create ~100 batches
  );
  
  for (let i = 0; i < data.length; i += adaptedBatchSize) {
    batches.push(data.slice(i, i + adaptedBatchSize));
  }
  
  progress.totalBatches = batches.length;
  progress.estimatedTimeRemaining = null; // Will be calculated after first batch
  progressCallback(progress);
  
  // Log start of processing
  await logTransferStart(projectId, data.length, adaptedBatchSize, batchConfig.concurrentBatches);
  
  // Process batches with dynamic concurrency control
  // Using adaptive windowed approach to prevent resource exhaustion
  const startTime = Date.now();
  const batchWindow = Math.min(batches.length, batchConfig.concurrentBatches * 3); // Process in windows of 3x concurrency
  
  for (let windowStart = 0; windowStart < batches.length; windowStart += batchWindow) {
    const windowEnd = Math.min(windowStart + batchWindow, batches.length);
    
    // Process current window of batches
    for (let i = windowStart; i < windowEnd; i += batchConfig.concurrentBatches) {
      const batchPromises: Promise<number>[] = [];
      
      // Dynamically adjust concurrency based on system performance
      const effectiveConcurrency = i === 0 ? 
        Math.max(1, Math.floor(batchConfig.concurrentBatches * 0.7)) : // Start with lower concurrency
        batchConfig.concurrentBatches;
      
      for (let j = 0; j < effectiveConcurrency && i + j < windowEnd; j++) {
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
      
      const results = await Promise.all(batchPromises);
      
      // Calculate processing rate for this window
      const elapsed = (Date.now() - startTime) / 1000;
      if (elapsed > 0) {
        const processedInWindow = results.reduce((sum, count) => sum + count, 0);
        const currentRate = processedInWindow / elapsed;
        
        // Update progress with processing rate
        if (progress.processingRate === 0 || currentRate > 0) {
          progress.processingRate = currentRate;
          
          // Update peak rate if current rate is higher
          if (currentRate > (progress.peakProcessingRate || 0)) {
            progress.peakProcessingRate = currentRate;
          }
        }
      }
      
      // Adaptive pause between concurrent batch sets to prevent resource exhaustion
      // Longer pause if processing is slow, shorter if fast
      const avgSuccessRate = results.reduce((sum, count) => sum + count, 0) / 
                             (results.length * adaptedBatchSize);
      
      const adaptivePause = avgSuccessRate < 0.7 ? 
        200 : // Longer pause if success rate is low (< 70%)
        avgSuccessRate < 0.9 ? 
          100 : // Medium pause if success rate is medium (70-90%)
          50;  // Short pause if success rate is high (> 90%)
          
      if (batchPromises.length > 1) {
        await new Promise(resolve => setTimeout(resolve, adaptivePause));
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
