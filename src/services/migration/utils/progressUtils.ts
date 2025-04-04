
import { TransferProgress } from "../types/transferTypes";

/**
 * Creates a new progress object initialized with defaults
 */
export const createInitialProgress = (totalRecords: number): TransferProgress => {
  return {
    totalRecords,
    processedRecords: 0,
    failedRecords: 0,
    percentage: 0,
    currentBatch: 0,
    totalBatches: 0,
    startTime: new Date(),
    estimatedTimeRemaining: null,
    status: "initializing",
  };
};

/**
 * Alias for createInitialProgress for backward compatibility
 */
export const initializeProgress = (totalRecords: number, batchSize: number): TransferProgress => {
  const progress = createInitialProgress(totalRecords);
  progress.totalBatches = Math.ceil(totalRecords / batchSize);
  return progress;
};

/**
 * Updates progress information based on recently processed records
 */
export const updateProgress = (
  progress: TransferProgress, 
  newProcessed: number, 
  newFailed: number = 0,
  currentBatch: number = progress.currentBatch
): TransferProgress => {
  const now = new Date();
  const elapsedMs = now.getTime() - progress.startTime.getTime();
  const totalProcessed = progress.processedRecords + newProcessed;
  const totalFailed = progress.failedRecords + newFailed;
  const percentage = Math.round((totalProcessed / progress.totalRecords) * 100);
  
  // Calculate processing rate and estimated time remaining
  let processingRate = undefined;
  let estimatedTimeRemaining = null;
  
  if (elapsedMs > 0 && totalProcessed > 0) {
    processingRate = (totalProcessed / elapsedMs) * 1000; // records per second
    
    const remainingRecords = progress.totalRecords - totalProcessed;
    if (processingRate > 0 && remainingRecords > 0) {
      estimatedTimeRemaining = Math.round(remainingRecords / processingRate);
    }
  }
  
  return {
    ...progress,
    processedRecords: totalProcessed,
    failedRecords: totalFailed,
    percentage,
    currentBatch,
    status: percentage >= 100 ? "completed" : "in_progress",
    processingRate,
    estimatedTimeRemaining,
  };
};

/**
 * Creates a progress object for resuming an interrupted transfer
 */
export const createResumeProgress = (
  savedProgress: any,
  totalRecords: number
): TransferProgress => {
  return {
    totalRecords,
    processedRecords: savedProgress.processedRecords || 0,
    failedRecords: savedProgress.failedRecords || 0,
    percentage: Math.round(((savedProgress.processedRecords || 0) / totalRecords) * 100),
    currentBatch: savedProgress.currentBatch || 0,
    totalBatches: savedProgress.totalBatches || 0,
    startTime: new Date(),
    estimatedTimeRemaining: null,
    status: "in_progress",
    checkpoint: savedProgress.checkpoint,
  };
};
