
import { BatchConfig, TransferProgress } from "../types/transferTypes";
import { updateProgress } from "../utils/progressUtils";
import { logUserActivity } from "../activityService";

/**
 * Core batch processing functionality for data transfers
 * Enhanced for enterprise-scale migrations
 */
export const executeDataTransfer = async <T>(
  data: T[],
  processFn: (item: T) => Promise<boolean>,
  progressCallback: (progress: TransferProgress) => void,
  batchConfig: BatchConfig,
  initialProgress: TransferProgress,
  projectId?: string,
): Promise<TransferProgress> => {
  let progress = { ...initialProgress };
  
  // Update and report initial progress
  progressCallback(progress);
  
  const batches: T[][] = [];
  for (let i = 0; i < data.length; i += batchConfig.batchSize) {
    batches.push(data.slice(i, i + batchConfig.batchSize));
  }
  
  progress.totalBatches = batches.length;
  progress.estimatedTimeRemaining = null; // Will be calculated after first batch
  progressCallback(progress);
  
  // Log start of processing if projectId is provided
  if (projectId) {
    await logUserActivity({
      project_id: projectId,
      activity_type: 'transfer_started',
      activity_description: `Started processing ${data.length} records with batch size ${batchConfig.batchSize}`,
      activity_details: {
        totalRecords: data.length,
        batchSize: batchConfig.batchSize,
        concurrentBatches: batchConfig.concurrentBatches
      }
    });
  }
  
  // Process batches with concurrency limit and memory management
  const processBatch = async (batchIndex: number, retry: number = 0): Promise<number> => {
    const batch = batches[batchIndex];
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
          
          // Log specific item errors for enterprise auditing
          if (projectId) {
            await logUserActivity({
              project_id: projectId,
              activity_type: 'item_error',
              activity_description: `Error processing item in batch ${batchIndex}`,
              activity_details: {
                batchIndex,
                itemIndex,
                error: error instanceof Error ? error.message : String(error)
              }
            });
          }
        }
      }));
      
      // Update progress
      progress = updateProgress(
        progress, 
        successfulItems.length, 
        batch.length - successfulItems.length
      );
      
      // Calculate and update time estimates for enterprise reporting
      const batchDuration = Date.now() - batchStartTime;
      const recordsPerMs = successfulItems.length / batchDuration;
      const remainingBatches = batches.length - (batchIndex + 1);
      const remainingItems = data.length - progress.processedRecords;
      
      if (recordsPerMs > 0 && remainingItems > 0) {
        const estimatedRemainingMs = remainingItems / recordsPerMs;
        progress.estimatedTimeRemaining = Math.ceil(estimatedRemainingMs / 1000); // in seconds
        progress.processingRate = recordsPerMs * 1000; // records per second
      }
      
      progressCallback(progress);
      
      // Log batch completion for enterprise auditing
      if (projectId && (batchIndex + 1) % 10 === 0) {
        await logUserActivity({
          project_id: projectId,
          activity_type: 'batch_progress',
          activity_description: `Completed ${batchIndex + 1} of ${batches.length} batches`,
          activity_details: {
            currentBatch: batchIndex + 1,
            totalBatches: batches.length,
            successRate: (progress.processedRecords - progress.failedRecords) / progress.processedRecords,
            estimatedTimeRemaining: progress.estimatedTimeRemaining
          }
        });
      }
      
      return successfulItems.length;
    } catch (error) {
      console.error(`Error processing batch ${batchIndex}:`, error);
      
      // Enterprise-grade logging for batch failures
      if (projectId) {
        await logUserActivity({
          project_id: projectId,
          activity_type: 'batch_failure',
          activity_description: `Failed to process batch ${batchIndex}`,
          activity_details: {
            batchIndex,
            error: error instanceof Error ? error.message : String(error),
            retryAttempt: retry + 1,
            maxRetries: batchConfig.retryAttempts
          }
        });
      }
      
      // Enhanced retry logic with exponential backoff for enterprise reliability
      if (retry < batchConfig.retryAttempts) {
        console.log(`Retrying batch ${batchIndex}, attempt ${retry + 1} of ${batchConfig.retryAttempts}...`);
        const backoffDelay = batchConfig.retryDelay * Math.pow(2, retry); // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, backoffDelay));
        return processBatch(batchIndex, retry + 1);
      }
      
      // Update progress with failed items
      progress = updateProgress(progress, 0, batch.length);
      progressCallback(progress);
      
      return 0;
    }
  };
  
  // Process batches with enhanced concurrency control and memory management
  // Using windowed approach to prevent too many items in memory at once
  const batchWindow = batchConfig.concurrentBatches * 2; // Process in windows
  
  for (let windowStart = 0; windowStart < batches.length; windowStart += batchWindow) {
    const windowEnd = Math.min(windowStart + batchWindow, batches.length);
    
    // Process current window of batches
    for (let i = windowStart; i < windowEnd; i += batchConfig.concurrentBatches) {
      const batchPromises: Promise<number>[] = [];
      
      for (let j = 0; j < batchConfig.concurrentBatches && i + j < windowEnd; j++) {
        batchPromises.push(processBatch(i + j));
      }
      
      await Promise.all(batchPromises);
      
      // Give the system a small breather between concurrent batch sets
      // This helps prevent resource exhaustion in enterprise environments
      if (batchPromises.length === batchConfig.concurrentBatches) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    // Log window completion for enterprise monitoring
    if (projectId) {
      await logUserActivity({
        project_id: projectId,
        activity_type: 'window_complete',
        activity_description: `Completed processing window ${Math.ceil(windowStart / batchWindow) + 1} of ${Math.ceil(batches.length / batchWindow)}`,
        activity_details: {
          windowStart,
          windowEnd,
          processedRecords: progress.processedRecords,
          failedRecords: progress.failedRecords,
          percentComplete: progress.percentage
        }
      });
    }
  }
  
  // Mark as completed
  progress.status = 'completed';
  progress.estimatedTimeRemaining = 0;
  progressCallback(progress);
  
  // Log completion for enterprise auditing
  if (projectId) {
    await logUserActivity({
      project_id: projectId,
      activity_type: 'transfer_completed',
      activity_description: `Completed processing ${data.length} records with ${progress.failedRecords} failures`,
      activity_details: {
        totalRecords: data.length,
        processedRecords: progress.processedRecords,
        failedRecords: progress.failedRecords,
        successRate: ((progress.processedRecords - progress.failedRecords) / progress.processedRecords) * 100
      }
    });
  }
  
  return progress;
};

/**
 * Stream-based data transfer for enterprise-scale migrations
 * Processes data in streams without loading entire dataset into memory
 */
export const executeStreamingDataTransfer = async <T>(
  fetchDataFn: (cursor: string | null, limit: number) => Promise<{ data: T[], nextCursor: string | null }>,
  processFn: (item: T) => Promise<boolean>,
  progressCallback: (progress: TransferProgress) => void,
  batchConfig: BatchConfig,
  totalRecords: number,
  projectId?: string,
): Promise<TransferProgress> => {
  // Initialize progress with total records count
  const initialProgress = {
    totalRecords,
    processedRecords: 0,
    failedRecords: 0,
    percentage: 0,
    currentBatch: 0,
    totalBatches: Math.ceil(totalRecords / batchConfig.batchSize),
    startTime: new Date(),
    estimatedTimeRemaining: null,
    status: 'initializing' as 'initializing' | 'in_progress' | 'paused' | 'completed' | 'failed',
    processingRate: 0
  };
  
  let progress = { ...initialProgress };
  progress.status = 'in_progress';
  progressCallback(progress);
  
  // Log start of streaming process
  if (projectId) {
    await logUserActivity({
      project_id: projectId,
      activity_type: 'streaming_transfer_started',
      activity_description: `Started streaming process for ${totalRecords} records`,
      activity_details: {
        totalRecords,
        batchSize: batchConfig.batchSize,
        concurrentBatches: batchConfig.concurrentBatches
      }
    });
  }
  
  let cursor: string | null = null;
  let batchCount = 0;
  let continueProcessing = true;
  
  // Process data in streams
  while (continueProcessing) {
    try {
      // Fetch next batch of data
      const result = await fetchDataFn(cursor, batchConfig.batchSize * batchConfig.concurrentBatches);
      
      if (!result.data || result.data.length === 0) {
        continueProcessing = false;
        continue;
      }
      
      // Process this window of data
      const batches: T[][] = [];
      for (let i = 0; i < result.data.length; i += batchConfig.batchSize) {
        batches.push(result.data.slice(i, i + batchConfig.batchSize));
      }
      
      // Process batches with concurrency
      for (let i = 0; i < batches.length; i += batchConfig.concurrentBatches) {
        const batchPromises: Promise<number>[] = [];
        
        for (let j = 0; j < batchConfig.concurrentBatches && i + j < batches.length; j++) {
          const batchIndex = i + j;
          batchPromises.push(
            (async () => {
              const batch = batches[batchIndex];
              const successfulItems: number[] = [];
              
              // Update batch progress
              batchCount++;
              progress.currentBatch = batchCount;
              progressCallback(progress);
              
              // Process each item in the batch
              await Promise.all(batch.map(async (item, itemIndex) => {
                try {
                  const success = await processFn(item);
                  if (success) {
                    successfulItems.push(itemIndex);
                  }
                } catch (error) {
                  console.error(`Error processing streaming item in batch ${batchCount}:`, error);
                }
              }));
              
              // Update progress
              progress = updateProgress(
                progress, 
                successfulItems.length, 
                batch.length - successfulItems.length
              );
              
              progressCallback(progress);
              
              return successfulItems.length;
            })()
          );
        }
        
        await Promise.all(batchPromises);
      }
      
      // Update cursor for next batch
      cursor = result.nextCursor;
      
      // If no next cursor, we're done
      if (!cursor) {
        continueProcessing = false;
      }
      
      // Log streaming progress periodically
      if (projectId && batchCount % 10 === 0) {
        await logUserActivity({
          project_id: projectId,
          activity_type: 'streaming_progress',
          activity_description: `Processed ${progress.processedRecords} of ${totalRecords} records`,
          activity_details: {
            processedRecords: progress.processedRecords,
            failedRecords: progress.failedRecords,
            percentComplete: progress.percentage
          }
        });
      }
    } catch (error) {
      console.error("Error in streaming data transfer:", error);
      
      if (projectId) {
        await logUserActivity({
          project_id: projectId,
          activity_type: 'streaming_error',
          activity_description: `Error during streaming data transfer`,
          activity_details: {
            error: error instanceof Error ? error.message : String(error),
            cursor,
            batchCount
          }
        });
      }
      
      // Retry logic for stream failures
      await new Promise(resolve => setTimeout(resolve, batchConfig.retryDelay));
    }
  }
  
  // Mark as completed
  progress.status = 'completed';
  progress.estimatedTimeRemaining = 0;
  progressCallback(progress);
  
  // Log completion
  if (projectId) {
    await logUserActivity({
      project_id: projectId,
      activity_type: 'streaming_transfer_completed',
      activity_description: `Completed streaming process for ${totalRecords} records with ${progress.failedRecords} failures`,
      activity_details: {
        totalRecords,
        processedRecords: progress.processedRecords,
        failedRecords: progress.failedRecords,
        successRate: ((progress.processedRecords - progress.failedRecords) / progress.processedRecords) * 100
      }
    });
  }
  
  return progress;
};
