
import { useState, useCallback } from "react";
import { toast } from "@/hooks/use-toast";
import { MigrationStatus, MigrationStep } from '../types';
import { useMigrationProgress } from './use-migration-progress';
import { usePerformanceMetrics } from './use-performance-metrics';
import { useStepManagement } from './use-step-management';
import { useMigrationApi } from './use-migration-api';
import { useMigrationError } from './use-migration-error';

type UseMigrationLifecycleReturn = {
  migrationStatus: MigrationStatus;
  setMigrationStatus: React.Dispatch<React.SetStateAction<MigrationStatus>>;
  handleStartMigration: () => Promise<void>;
  handleResetMigration: () => void;
};

/**
 * Hook to manage the migration lifecycle, including starting, resetting, and status
 */
export const useMigrationLifecycle = (
  setCurrentStepIndex: React.Dispatch<React.SetStateAction<number>>,
  setOverallProgress: React.Dispatch<React.SetStateAction<number>>,
  resetSteps: () => void,
  resetMetrics: () => void,
  setStartTime: React.Dispatch<React.SetStateAction<Date | null>>,
  setPerformanceMetrics: React.Dispatch<React.SetStateAction<Partial<any>>>,
  setSteps: React.Dispatch<React.SetStateAction<MigrationStep[]>>,
  setActiveStep: React.Dispatch<React.SetStateAction<MigrationStep | undefined>>
): UseMigrationLifecycleReturn => {
  const [migrationStatus, setMigrationStatus] = useState<MigrationStatus>("idle");
  const { createMigration } = useMigrationApi();
  const { resetError } = useMigrationError();
  
  // Start migration process
  const handleStartMigration = useCallback(async () => {
    try {
      setMigrationStatus("loading");
      setStartTime(new Date());
      
      // Initialize performance metrics
      setPerformanceMetrics({
        averageRecordsPerSecond: 0,
        peakRecordsPerSecond: 0,
        estimatedTimeRemaining: 0,
        totalRecordsProcessed: 0,
        dataVolume: 0
      });
      
      // Create the migration in the API
      await createMigration();
      
      // Start the first step
      setSteps(prevSteps => {
        const newSteps = [...prevSteps];
        newSteps[0].status = 'in_progress';
        setActiveStep(newSteps[0]);
        
        // Show toast notification when migration starts
        toast({
          title: "Migration Started",
          description: `Starting with ${newSteps[0].name} migration...`,
        });
        
        return newSteps;
      });
    } catch (error) {
      console.error("Failed to start migration:", error);
      setMigrationStatus("error");
      // Error is already handled in createMigration
    }
  }, [createMigration, setActiveStep, setPerformanceMetrics, setStartTime, setSteps]);
  
  // Reset migration to initial state
  const handleResetMigration = useCallback(() => {
    setMigrationStatus("idle");
    setCurrentStepIndex(0);
    setOverallProgress(0);
    resetSteps();
    resetMetrics();
    resetError();
    
    toast({
      title: "Migration Reset",
      description: "The migration demo has been reset. Click to start again.",
    });
  }, [resetError, resetMetrics, resetSteps, setCurrentStepIndex, setOverallProgress]);
  
  return {
    migrationStatus,
    setMigrationStatus,
    handleStartMigration,
    handleResetMigration
  };
};
