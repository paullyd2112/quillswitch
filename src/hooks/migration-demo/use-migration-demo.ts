
import { useState, useEffect, useCallback } from "react";
import { toast } from "@/hooks/use-toast";
import { UseMigrationDemoReturn, MigrationStatus } from './types';
import { useMigrationProgress } from './hooks/use-migration-progress';
import { usePerformanceMetrics } from './hooks/use-performance-metrics';
import { useStepManagement } from './hooks/use-step-management';

export const useMigrationDemo = (): UseMigrationDemoReturn => {
  const [migrationStatus, setMigrationStatus] = useState<MigrationStatus>("idle");
  
  // Use our extracted hooks
  const { 
    currentStepIndex, 
    setCurrentStepIndex,
    overallProgress, 
    setOverallProgress,
    handleProgressUpdate 
  } = useMigrationProgress();
  
  const {
    steps,
    setSteps,
    activeStep,
    setActiveStep,
    resetSteps,
    updateStepProgress
  } = useStepManagement(migrationStatus);
  
  const {
    performanceMetrics,
    startTime,
    setStartTime,
    resetMetrics
  } = usePerformanceMetrics(migrationStatus, steps);
  
  // Effect to update progress when steps change
  useEffect(() => {
    handleProgressUpdate(migrationStatus, steps, currentStepIndex);
  }, [steps, currentStepIndex, migrationStatus]);
  
  // Effect to handle step updates
  useEffect(() => {
    if (migrationStatus !== "loading") return;
    
    const cleanupFn = updateStepProgress(
      migrationStatus, 
      currentStepIndex, 
      setCurrentStepIndex
    );
    
    return cleanupFn;
  }, [currentStepIndex, migrationStatus]);
  
  // Effect to check for migration completion
  useEffect(() => {
    // Check if all steps are complete
    if (migrationStatus === "loading" && 
        steps.every(step => step.status === 'complete')) {
      
      setMigrationStatus("success");
      setActiveStep(undefined);
      
      toast({
        title: "Migration Complete",
        description: "Your migration has completed successfully!",
      });
    }
  }, [steps, migrationStatus]);
  
  // Handle starting/resetting the migration demo
  const handleMigrationDemo = useCallback(() => {
    if (migrationStatus === "loading") return;
    
    // If already completed, reset to idle and return
    if (migrationStatus === "success") {
      setMigrationStatus("idle");
      setCurrentStepIndex(0);
      setOverallProgress(0);
      resetSteps();
      resetMetrics();
      
      toast({
        title: "Migration Reset",
        description: "The migration demo has been reset. Click to start again.",
      });
      
      return;
    }
    
    // Start migration process
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
  }, [migrationStatus]);

  return {
    migrationStatus,
    steps,
    overallProgress,
    activeStep,
    performanceMetrics,
    handleMigrationDemo
  };
};
