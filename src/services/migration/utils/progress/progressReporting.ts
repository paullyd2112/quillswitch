
import { TransferProgress } from "../../types/transferTypes";
import { formatTimeSpan } from "./timeUtils";

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
Elapsed time: ${formatTimeSpan(elapsedSec).formatted}
${progress.estimatedTimeRemaining !== null ? `Estimated time remaining: ${formatTimeSpan(progress.estimatedTimeRemaining).formatted}` : ''}`;
};
