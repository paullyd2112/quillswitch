import { TransferProgress } from "../../types/transferTypes";
import { ProgressHistoryPoint } from "./types";

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
  } as ProgressHistoryPoint];
  
  // Keep only the last 20 history points
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
