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
 * Updates progress information based on recently processed records
 */
export const updateProgress = (
  progress: TransferProgress, 
  newProcessed: number, 
  newFailed: number = 0,
  currentBatch: number = progress.currentBatch,
  recordSize: number = 5 // Default estimate of 5KB per record
): TransferProgress => {
  const now = new Date();
  const elapsedMs = now.getTime() - progress.startTime.getTime();
  const totalProcessed = progress.processedRecords + newProcessed;
  const totalFailed = progress.failedRecords + newFailed;
  const percentage = Math.round((totalProcessed / progress.totalRecords) * 100);
  
  // Calculate processing rate and estimated time remaining
  let processingRate = progress.processingRate;
  let peakProcessingRate = progress.peakProcessingRate || 0;
  let estimatedTimeRemaining = null;
  
  // Add new history point
  const processingHistory = [...(progress.processingHistory || []), {
    timestamp: now.getTime(),
    processed: totalProcessed,
    rate: newProcessed > 0 ? (newProcessed / (elapsedMs / 1000)) : 0
  }];
  
  // Keep only the last 10 history points
  while (processingHistory.length > 20) {
    processingHistory.shift();
  }
  
  // Calculate processing rate from history (with smoothing)
  if (processingHistory.length >= 2) {
    const earliest = processingHistory[0];
    const latest = processingHistory[processingHistory.length - 1];
    const timeSpanSeconds = (latest.timestamp - earliest.timestamp) / 1000;
    const recordsDiff = latest.processed - earliest.processed;
    
    if (timeSpanSeconds > 0) {
      const currentRate = recordsDiff / timeSpanSeconds;
      
      // Weighted average for smoothing: 70% previous rate, 30% new rate
      processingRate = processingRate > 0 
        ? (processingRate * 0.7) + (currentRate * 0.3) 
        : currentRate;
      
      // Update peak rate if current rate is higher
      if (processingRate > peakProcessingRate) {
        peakProcessingRate = processingRate;
      }
      
      // Calculate estimated time with smoothing
      const remainingRecords = progress.totalRecords - totalProcessed;
      if (processingRate > 0 && remainingRecords > 0) {
        const rawEstimate = Math.round(remainingRecords / processingRate);
        
        // Apply smoothing to time estimation as well
        if (progress.estimatedTimeRemaining !== null) {
          estimatedTimeRemaining = Math.round(
            (progress.estimatedTimeRemaining * 0.7) + (rawEstimate * 0.3)
          );
        } else {
          estimatedTimeRemaining = rawEstimate;
        }
      }
    }
  } else if (elapsedMs > 0 && newProcessed > 0) {
    // Fallback if not enough history
    processingRate = (newProcessed / (elapsedMs / 1000));
    
    if (processingRate > peakProcessingRate) {
      peakProcessingRate = processingRate;
    }
    
    const remainingRecords = progress.totalRecords - totalProcessed;
    if (processingRate > 0 && remainingRecords > 0) {
      estimatedTimeRemaining = Math.round(remainingRecords / processingRate);
    }
  }
  
  // Calculate approximate data volume
  const dataVolume = (progress.dataVolume || 0) + (newProcessed * recordSize);
  
  return {
    ...progress,
    processedRecords: totalProcessed,
    failedRecords: totalFailed,
    percentage,
    currentBatch,
    status: percentage >= 100 ? "completed" : "in_progress",
    processingRate,
    peakProcessingRate,
    estimatedTimeRemaining,
    dataVolume,
    processingHistory
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
    processingRate: 0,
    peakProcessingRate: 0,
    dataVolume: savedProgress.dataVolume || 0,
    processingHistory: [],
    checkpoint: savedProgress.checkpoint,
  };
};

/**
 * Creates a meaningful summary of the progress for reporting
 */
export const createProgressSummary = (progress: TransferProgress): string => {
  const { 
    processedRecords, 
    totalRecords, 
    failedRecords, 
    processingRate,
    peakProcessingRate
  } = progress;
  
  // Calculate elapsed time
  const elapsedMs = new Date().getTime() - progress.startTime.getTime();
  const elapsedSec = Math.round(elapsedMs / 1000);
  
  const successRate = processedRecords > 0 
    ? ((processedRecords - failedRecords) / processedRecords) * 100 
    : 0;
  
  return `Processed ${processedRecords.toLocaleString()} of ${totalRecords.toLocaleString()} records (${progress.percentage}%)
Success rate: ${successRate.toFixed(1)}%
Average speed: ${processingRate ? processingRate.toFixed(1) : 0} records/sec
Peak speed: ${peakProcessingRate ? peakProcessingRate.toFixed(1) : 0} records/sec
Elapsed time: ${formatTimeSpan(elapsedSec)}
${progress.estimatedTimeRemaining !== null ? `Estimated time remaining: ${formatTimeSpan(progress.estimatedTimeRemaining)}` : ''}`;
};

/**
 * Format a time span in seconds to a readable string
 */
const formatTimeSpan = (seconds: number): string => {
  if (seconds < 60) {
    return `${seconds} seconds`;
  }
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    const remainingSec = seconds % 60;
    return `${minutes} min${minutes !== 1 ? 's' : ''} ${remainingSec > 0 ? `${remainingSec} sec` : ''}`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMin = minutes % 60;
  
  if (hours < 24) {
    return `${hours} hour${hours !== 1 ? 's' : ''} ${remainingMin > 0 ? `${remainingMin} min` : ''}`;
  }
  
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  
  return `${days} day${days !== 1 ? 's' : ''} ${remainingHours > 0 ? `${remainingHours} hrs` : ''}`;
};
