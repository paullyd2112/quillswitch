
import { TransferProgress } from "../../types/transferTypes";

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
    processingRate: 0,
    peakProcessingRate: 0,
    dataVolume: 0,
    processingHistory: [],
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
    processingRate: 0,
    peakProcessingRate: 0,
    dataVolume: savedProgress.dataVolume || 0,
    processingHistory: [],
    checkpoint: savedProgress.checkpoint,
  };
};
