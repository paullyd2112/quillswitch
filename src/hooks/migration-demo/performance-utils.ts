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

// Calculate network transfer rate in KB/s
export const calculateNetworkSpeed = (
  history: MigrationHistoryPoint[],
  recordSize: number = 5 // Default to 5KB per record
): number => {
  if (history.length < 2) return 0;
  
  const earliest = history[0];
  const latest = history[history.length - 1];
  const timeSpanSeconds = (latest.timestamp - earliest.timestamp) / 1000;
  
  if (timeSpanSeconds <= 0) return 0;
  
  const recordsDiff = latest.records - earliest.records;
  const dataSizeKB = recordsDiff * recordSize;
  
  return dataSizeKB / timeSpanSeconds;
};

// Simulate memory usage patterns with some randomness for realism
export const simulateMemoryUsage = (
  processedRecords: number,
  baseMemory: number = 25 // Base memory usage in MB
): number => {
  // Memory increases with processed records but has some fluctuation
  const calculatedMemory = baseMemory + (processedRecords / 1000) * 2;
  
  // Add some random fluctuation (+/- 10%) for realism
  const fluctuation = calculatedMemory * 0.1 * (Math.random() - 0.5);
  
  // Simulate occasional garbage collection
  const gcTrigger = Math.random() > 0.9;
  const gcReduction = gcTrigger ? calculatedMemory * 0.15 * Math.random() : 0;
  
  return Math.max(baseMemory, calculatedMemory + fluctuation - gcReduction);
};

// Simulate CPU utilization
export const simulateCpuUtilization = (
  currentLoad: number = 50,
  minLoad: number = 30,
  maxLoad: number = 85
): number => {
  // CPU fluctuates around current load
  const fluctuation = 10 * (Math.random() - 0.5);
  
  // Occasionally spike higher
  const spike = Math.random() > 0.9 ? 15 * Math.random() : 0;
  
  // Calculate new load with constraints
  return Math.min(maxLoad, Math.max(minLoad, currentLoad + fluctuation + spike));
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
  previousEstimate?: number,
  previousMetrics?: Partial<PerformanceMetrics>
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
  
  // Calculate/simulate new metrics
  const networkSpeed = calculateNetworkSpeed(history);
  const memoryUsage = simulateMemoryUsage(processedRecords);
  const cpuUtilization = simulateCpuUtilization(previousMetrics?.cpuUtilization);
  
  // Create history point for this update
  const newHistoryPoint: MigrationHistoryPoint = {
    timestamp: Date.now(),
    records: Math.round(processedRecords),
    memoryUsage,
    networkSpeed
  };
  
  // Get existing history or create new array
  const progressHistory = previousMetrics?.progressHistory || [];
  
  // Add new history point and keep only last 50 points
  const updatedHistory = [...progressHistory, newHistoryPoint].slice(-50);
  
  return [
    {
      averageRecordsPerSecond: finalRps,
      peakRecordsPerSecond: newPeakRps,
      estimatedTimeRemaining: Math.round(smoothedEstimate),
      totalRecordsProcessed: Math.round(processedRecords),
      dataVolume,
      memoryUsage,
      networkSpeed,
      cpuUtilization,
      progressHistory: updatedHistory
    },
    newPeakRps
  ];
};
