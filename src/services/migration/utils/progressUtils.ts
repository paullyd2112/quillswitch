
import { TransferProgress } from "../types/transferTypes";

/**
 * Initialize a transfer progress object
 */
export const initializeProgress = (
  totalRecords: number,
  batchSize: number
): TransferProgress => {
  return {
    totalRecords,
    processedRecords: 0,
    failedRecords: 0,
    percentage: 0,
    currentBatch: 0,
    totalBatches: Math.ceil(totalRecords / batchSize),
    startTime: new Date(),
    status: 'initializing' // This is the correct initial status
  };
};

/**
 * Update progress tracking
 */
export const updateProgress = (
  currentProgress: TransferProgress,
  successCount: number,
  failureCount: number
): TransferProgress => {
  const newProgress = { ...currentProgress };
  
  // Update counts
  newProgress.processedRecords += successCount;
  newProgress.failedRecords += failureCount;
  
  // Calculate percentage
  newProgress.percentage = Math.round(
    (newProgress.processedRecords / newProgress.totalRecords) * 100
  );
  
  // Calculate estimated time remaining
  const elapsedMs = Date.now() - newProgress.startTime.getTime();
  const recordsPerMs = newProgress.processedRecords / elapsedMs;
  const remainingRecords = newProgress.totalRecords - newProgress.processedRecords;
  
  if (recordsPerMs > 0) {
    const remainingMs = remainingRecords / recordsPerMs;
    newProgress.estimatedTimeRemaining = Math.round(remainingMs / 1000); // Convert to seconds
  }
  
  // Update status
  if (newProgress.processedRecords + newProgress.failedRecords >= newProgress.totalRecords) {
    newProgress.status = 'completed';
  } else {
    newProgress.status = 'in_progress';
  }
  
  return newProgress;
};
