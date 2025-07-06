
import { useState, useCallback } from "react";
import { toast } from "@/hooks/use-toast";
import { MigrationStatus, MigrationStep } from '../types';
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
      console.log("Starting migration demo...");
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
      
      // Create the migration
      try {
        // For production, we would pass actual migration data
        const migrationData = {
          name: "CRM Migration",
          source: { type: "demo", credentials: {} },
          destination: { type: "demo", credentials: {} },
          dataTypes: [{ type: "contacts" }],
          schedule: { startNow: true }
        };
        
        const migrationId = await createMigration(migrationData);
        console.log("Migration created with ID:", migrationId);
      } catch (error) {
        console.warn("Failed to create migration, but continuing with demo:", error);
        // For the demo, we'll continue even if the API call fails
      }
      
      // Start the first step
      setSteps(prevSteps => {
        const newSteps = [...prevSteps];
        if (newSteps.length > 0) {
          newSteps[0].status = 'in-progress';
          setActiveStep(newSteps[0]);
          
          // Show toast notification when migration starts
          toast({
            title: "Migration Started",
            description: `Starting with ${newSteps[0].name} migration...`,
          });
        }
        
        return newSteps;
      });
    } catch (error) {
      console.error("Failed to start migration:", error);
      setMigrationStatus("error");
      toast({
        title: "Migration Error",
        description: "Failed to start migration. Please try again.",
        variant: "destructive"
      });
    }
  }, [createMigration, setActiveStep, setPerformanceMetrics, setStartTime, setSteps]);
  
  // Reset migration to initial state
  const handleResetMigration = useCallback(() => {
    console.log("Resetting migration demo...");
    setMigrationStatus("idle");
    setCurrentStepIndex(0);
    setOverallProgress(0);
    resetSteps();
    resetMetrics();
    resetError();
    setActiveStep(undefined);
    
    toast({
      title: "Migration Reset",
      description: "The migration demo has been reset. Click to start again.",
    });
  }, [resetError, resetMetrics, resetSteps, setCurrentStepIndex, setOverallProgress, setActiveStep]);
  
  return {
    migrationStatus,
    setMigrationStatus,
    handleStartMigration,
    handleResetMigration
  };
};
