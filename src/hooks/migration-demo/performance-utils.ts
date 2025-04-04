
import { MigrationHistoryPoint, MigrationStep, PerformanceMetrics } from './types';
import { getStepRecordCount } from './migration-data';

// Calculate data volume in KB
export const calculateDataVolume = (steps: MigrationStep[]): number => {
  let volume = 0;
  steps.forEach(step => {
    const stepTotal = getStepRecordCount(step.name);
    const stepProcessed = stepTotal * (step.progress / 100);
    volume += stepProcessed * (step.recordSize || 5); // Default to 5KB if recordSize not specified
  });
  return volume;
};

// Calculate total records processed based on steps progress
export const calculateProcessedRecords = (steps: MigrationStep[]): number => {
  return steps.reduce((acc, step) => {
    const stepTotal = getStepRecordCount(step.name);
    return acc + (stepTotal * (step.progress / 100));
  }, 0);
};

// Calculate records per second with rolling average
export const calculateRecordsPerSecond = (
  history: MigrationHistoryPoint[]
): number => {
  if (history.length < 2) return 0;
  
  const earliest = history[0];
  const latest = history[history.length - 1];
  const timeSpanSeconds = (latest.timestamp - earliest.timestamp) / 1000;
  const recordsDiff = latest.records - earliest.records;
  
  if (timeSpanSeconds <= 0) return 0;
  return recordsDiff / timeSpanSeconds;
};

// Calculate estimated time remaining with smoothing
export const calculateTimeRemaining = (
  rps: number,
  totalRecords: number,
  processedRecords: number,
  previousEstimate?: number
): number => {
  if (rps <= 0) return 0;
  
  const remainingRecords = totalRecords - processedRecords;
  const rawEstimatedSecondsRemaining = remainingRecords / rps;
  
  // Apply a smoothing factor if there's a previous estimate
  if (previousEstimate !== undefined) {
    // Weighted average - 70% previous estimate, 30% new estimate
    return (previousEstimate * 0.7) + (rawEstimatedSecondsRemaining * 0.3);
  }
  
  return rawEstimatedSecondsRemaining;
};

// Update performance metrics based on current state
export const updatePerformanceMetrics = (
  steps: MigrationStep[],
  history: MigrationHistoryPoint[],
  startTime: Date | null,
  previousPeakRps: number,
  previousEstimate?: number
): [Partial<PerformanceMetrics>, number] => {
  if (!startTime) return [{}, previousPeakRps];
  
  const elapsedMs = Date.now() - startTime.getTime();
  const elapsedSeconds = elapsedMs / 1000;
  
  if (elapsedSeconds <= 0) return [{}, previousPeakRps];
  
  const totalRecords = steps.reduce((acc, step) => acc + getStepRecordCount(step.name), 0);
  const processedRecords = calculateProcessedRecords(steps);
  
  // Calculate records per second with jitter for realism
  const rps = calculateRecordsPerSecond(history);
  const jitter = rps * 0.1 * (Math.random() - 0.5); // +/- 10% randomness
  const finalRps = Math.max(0.1, rps + jitter);
  
  // Track peak RPS
  const newPeakRps = finalRps > previousPeakRps ? finalRps : previousPeakRps;
  
  // Calculate estimated time remaining
  const smoothedEstimate = calculateTimeRemaining(
    finalRps,
    totalRecords,
    processedRecords,
    previousEstimate
  );
  
  // Calculate data volume
  const dataVolume = calculateDataVolume(steps);
  
  return [
    {
      averageRecordsPerSecond: finalRps,
      peakRecordsPerSecond: newPeakRps,
      estimatedTimeRemaining: Math.round(smoothedEstimate),
      totalRecordsProcessed: Math.round(processedRecords),
      dataVolume
    },
    newPeakRps
  ];
};
