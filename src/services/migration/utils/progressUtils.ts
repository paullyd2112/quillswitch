
import { TransferProgress } from "../types/transferTypes";

/**
 * Initialize a new transfer progress object
 */
export const initializeProgress = (totalRecords: number, batchSize: number): TransferProgress => {
  const totalBatches = Math.ceil(totalRecords / batchSize);
  
  return {
    totalRecords,
    processedRecords: 0,
    failedRecords: 0,
    percentage: 0,
    currentBatch: 0,
    totalBatches,
    startTime: new Date(),
    status: 'initializing'
  };
};

/**
 * Calculate estimated time remaining based on current progress
 */
export const calculateTimeRemaining = (progress: TransferProgress): number | undefined => {
  if (progress.processedRecords === 0) return undefined;
  
  const elapsedMs = new Date().getTime() - progress.startTime.getTime();
  const recordsPerMs = progress.processedRecords / elapsedMs;
  const remainingRecords = progress.totalRecords - progress.processedRecords;
  
  if (recordsPerMs <= 0) return undefined;
  
  const remainingMs = remainingRecords / recordsPerMs;
  return Math.round(remainingMs / 1000); // Convert to seconds
};

/**
 * Update progress with latest information
 */
export const updateProgress = (
  progress: TransferProgress, 
  processed: number, 
  failed: number,
  currentBatch: number
): TransferProgress => {
  const updatedProgress = {
    ...progress,
    processedRecords: progress.processedRecords + processed,
    failedRecords: progress.failedRecords + failed,
    currentBatch,
    status: 'in_progress' as const
  };
  
  updatedProgress.percentage = Math.floor(
    (updatedProgress.processedRecords / updatedProgress.totalRecords) * 100
  );
  
  updatedProgress.estimatedTimeRemaining = calculateTimeRemaining(updatedProgress);
  
  // Check if transfer is complete
  if (updatedProgress.processedRecords + updatedProgress.failedRecords >= updatedProgress.totalRecords) {
    updatedProgress.status = 'completed' as TransferProgress['status'];
  }
  
  return updatedProgress;
};
