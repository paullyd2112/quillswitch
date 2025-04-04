
import { useState, useEffect } from "react";
import { MigrationHistoryPoint, MigrationStep, PerformanceMetrics, MigrationStatus } from '../types';
import { updatePerformanceMetrics, calculateProcessedRecords } from '../performance-utils';

type UsePerformanceMetricsReturnType = {
  performanceMetrics: Partial<PerformanceMetrics>;
  startTime: Date | null;
  setStartTime: React.Dispatch<React.SetStateAction<Date | null>>;
  setPerformanceMetrics: React.Dispatch<React.SetStateAction<Partial<PerformanceMetrics>>>;
  resetMetrics: () => void;
};

/**
 * Hook to manage and update performance metrics during migration
 */
export const usePerformanceMetrics = (initialStatus: MigrationStatus, steps: MigrationStep[]): UsePerformanceMetricsReturnType => {
  const [performanceMetrics, setPerformanceMetrics] = useState<Partial<PerformanceMetrics>>({});
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [recordsProcessedHistory, setRecordsProcessedHistory] = useState<MigrationHistoryPoint[]>([]);
  const [peakRps, setPeakRps] = useState(0);
  const [migrationStatus, setMigrationStatus] = useState<MigrationStatus>(initialStatus);
  
  // Update migration status when parameter changes
  useEffect(() => {
    setMigrationStatus(initialStatus);
  }, [initialStatus]);
  
  // Reset all performance metrics
  const resetMetrics = () => {
    setPerformanceMetrics({});
    setStartTime(null);
    setRecordsProcessedHistory([]);
    setPeakRps(0);
  };
  
  // Update performance metrics effect
  useEffect(() => {
    if (migrationStatus !== "loading" || !startTime) return;
    
    const updateMetrics = () => {
      const elapsedMs = Date.now() - startTime.getTime();
      const elapsedSeconds = elapsedMs / 1000;
      
      if (elapsedSeconds <= 0) return;
      
      // Calculate processed records
      const processedRecords = calculateProcessedRecords(steps);
      
      // Store history for rolling averages
      const newHistory = [...recordsProcessedHistory, {timestamp: Date.now(), records: processedRecords}];
      
      // Only keep last 10 history points for efficiency
      if (newHistory.length > 10) {
        newHistory.shift();
      }
      
      setRecordsProcessedHistory(newHistory);
      
      // Update metrics
      const [newMetrics, newPeakRps] = updatePerformanceMetrics(
        steps,
        newHistory,
        startTime,
        peakRps,
        performanceMetrics.estimatedTimeRemaining
      );
      
      setPeakRps(newPeakRps);
      setPerformanceMetrics(newMetrics);
    };
    
    const intervalId = setInterval(updateMetrics, 1000);
    return () => clearInterval(intervalId);
  }, [
    migrationStatus, 
    steps, 
    startTime, 
    recordsProcessedHistory, 
    peakRps, 
    performanceMetrics.estimatedTimeRemaining
  ]);

  return {
    performanceMetrics,
    startTime,
    setStartTime,
    setPerformanceMetrics,
    resetMetrics
  };
};
