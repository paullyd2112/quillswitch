
import { BatchConfig, TransferProgress } from "../../types/transferTypes";
import { updateProgress } from "../../utils/progressUtils";
import { FetchDataFunction, ProcessItemFunction, ProgressCallback } from "./types";
import { 
  logStreamingCompletion, 
  logStreamingError, 
  logStreamingProgress, 
  logStreamingStart 
} from "./logService";

/**
 * Stream-based data transfer for enterprise-scale migrations
 * Processes data in streams without loading entire dataset into memory
 */
export const executeStreamingDataTransfer = async <T>(
  fetchDataFn: FetchDataFunction<T>,
  processFn: ProcessItemFunction<T>,
  progressCallback: ProgressCallback,
  batchConfig: BatchConfig,
  totalRecords: number,
  projectId?: string,
): Promise<TransferProgress> => {
  // Initialize progress with total records count
  const initialProgress: TransferProgress = {
    totalRecords,
    processedRecords: 0,
    failedRecords: 0,
    percentage: 0,
    currentBatch: 0,
    totalBatches: Math.ceil(totalRecords / batchConfig.batchSize),
    startTime: new Date(),
    estimatedTimeRemaining: null,
    status: 'initializing',
    processingRate: 0,
    peakProcessingRate: 0,
    dataVolume: 0,
    processingHistory: []
  };
  
  let progress = { ...initialProgress };
  progress.status = 'in_progress';
  progressCallback(progress);
  
  // Log start of streaming process
  await logStreamingStart(projectId, totalRecords, batchConfig.batchSize, batchConfig.concurrentBatches);
  
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
      await logStreamingProgress(
        projectId, 
        progress.processedRecords, 
        totalRecords, 
        progress.failedRecords, 
        progress.percentage,
        batchCount
      );
    } catch (error) {
      console.error("Error in streaming data transfer:", error);
      
      await logStreamingError(projectId, error, cursor, batchCount);
      
      // Retry logic for stream failures
      await new Promise(resolve => setTimeout(resolve, batchConfig.retryDelay));
    }
  }
  
  // Mark as completed
  progress.status = 'completed';
  progress.estimatedTimeRemaining = 0;
  progressCallback(progress);
  
  // Log completion
  await logStreamingCompletion(
    projectId,
    totalRecords,
    progress.processedRecords,
    progress.failedRecords
  );
  
  return progress;
};
