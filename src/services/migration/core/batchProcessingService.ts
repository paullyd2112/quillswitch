
import { BatchConfig, TransferProgress } from "../types/transferTypes";
import { updateProgress } from "../utils/progressUtils";

/**
 * Core batch processing functionality for data transfers
 */
export const executeDataTransfer = async <T>(
  data: T[],
  processFn: (item: T) => Promise<boolean>,
  progressCallback: (progress: TransferProgress) => void,
  batchConfig: BatchConfig,
  initialProgress: TransferProgress,
  projectId?: string,
  // Remove the logUserActivity parameter as we'll handle logging internally
): Promise<TransferProgress> => {
  let progress = { ...initialProgress };
  
  // Update and report initial progress
  progressCallback(progress);
  
  const batches: T[][] = [];
  for (let i = 0; i < data.length; i += batchConfig.batchSize) {
    batches.push(data.slice(i, i + batchConfig.batchSize));
  }
  
  progress.totalBatches = batches.length;
  progressCallback(progress);
  
  // Process batches with concurrency limit
  const processBatch = async (batchIndex: number, retry: number = 0): Promise<number> => {
    const batch = batches[batchIndex];
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
    } catch (error) {
      console.error(`Error processing batch ${batchIndex}:`, error);
      
      // Retry logic
      if (retry < batchConfig.retryAttempts) {
        console.log(`Retrying batch ${batchIndex}, attempt ${retry + 1}...`);
        await new Promise(resolve => setTimeout(resolve, batchConfig.retryDelay));
        return processBatch(batchIndex, retry + 1);
      }
      
      // Update progress with failed items
      progress = updateProgress(progress, 0, batch.length);
      progressCallback(progress);
      
      return 0;
    }
  };
  
  // Process batches with concurrency
  for (let i = 0; i < batches.length; i += batchConfig.concurrentBatches) {
    const batchPromises: Promise<number>[] = [];
    
    for (let j = 0; j < batchConfig.concurrentBatches && i + j < batches.length; j++) {
      batchPromises.push(processBatch(i + j));
    }
    
    await Promise.all(batchPromises);
  }
  
  // Mark as completed
  progress.status = 'completed';
  progress.estimatedTimeRemaining = 0;
  progressCallback(progress);
  
  return progress;
};
