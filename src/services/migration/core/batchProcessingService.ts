
import { BatchConfig, TransferProgress } from "../types/transferTypes";
import { updateProgress } from "../utils/progressUtils";

/**
 * Process a single batch of records
 */
export const processBatch = async <T>(
  items: T[],
  processFn: (item: T) => Promise<boolean>,
  batchNumber: number,
  config: BatchConfig
): Promise<{ processed: number; failed: number }> => {
  let processed = 0;
  let failed = 0;
  
  for (const item of items) {
    try {
      let success = false;
      let attempts = 0;
      
      // Retry logic
      while (!success && attempts < config.retryAttempts) {
        try {
          success = await processFn(item);
          if (success) {
            processed++;
          } else {
            failed++;
          }
        } catch (error) {
          attempts++;
          if (attempts < config.retryAttempts) {
            console.log(`Retrying batch ${batchNumber}, attempt ${attempts + 1}...`);
            await new Promise(resolve => setTimeout(resolve, config.retryDelay));
          } else {
            throw error;
          }
        }
      }
    } catch (error) {
      console.error(`Error processing item in batch ${batchNumber}:`, error);
      failed++;
    }
  }
  
  return { processed, failed };
};

/**
 * Execute batched data transfer with progress tracking and error handling
 */
export const executeDataTransfer = async <T>(
  items: T[],
  processFn: (item: T) => Promise<boolean>,
  progressCallback: (progress: TransferProgress) => void,
  config: BatchConfig,
  progress: TransferProgress,
  projectId?: string, 
  logActivityFn?: (params: {
    project_id: string,
    activity_type: string,
    activity_description: string,
    activity_details?: any
  }) => Promise<void>
): Promise<TransferProgress> => {
  // Update progress status
  progress.status = 'in_progress';
  progressCallback(progress);
  
  // Split items into batches
  const batches: T[][] = [];
  for (let i = 0; i < items.length; i += config.batchSize) {
    batches.push(items.slice(i, i + config.batchSize));
  }
  
  progress.totalBatches = batches.length;
  progressCallback(progress);
  
  // Process batches with concurrency limit
  for (let i = 0; i < batches.length; i += config.concurrentBatches) {
    const batchPromises = batches
      .slice(i, i + config.concurrentBatches)
      .map((batch, index) => 
        processBatch(batch, processFn, i + index + 1, config)
          .then(result => {
            // Update progress after each batch
            progress = updateProgress(
              progress, 
              result.processed, 
              result.failed,
              i + index + 1
            );
            progressCallback(progress);
            return result;
          })
      );
    
    await Promise.all(batchPromises);
    
    // Log activity for project
    if (projectId && logActivityFn) {
      try {
        await logActivityFn({
          project_id: projectId,
          activity_type: 'data_transfer_progress',
          activity_description: `Processed ${progress.currentBatch} of ${progress.totalBatches} batches (${progress.percentage}% complete)`,
          activity_details: {
            processed: progress.processedRecords,
            failed: progress.failedRecords,
            total: progress.totalRecords,
            percentage: progress.percentage
          }
        });
      } catch (error) {
        console.error('Error logging transfer activity:', error);
      }
    }
  }
  
  // Final progress update
  progress.status = 'completed';
  progressCallback(progress);
  
  return progress;
};
