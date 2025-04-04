
import { useState, useEffect, useCallback } from "react";
import { toast } from "@/hooks/use-toast";
import { UseMigrationDemoReturn, MigrationStatus } from './types';
import { useMigrationProgress } from './hooks/use-migration-progress';
import { usePerformanceMetrics } from './hooks/use-performance-metrics';
import { useStepManagement } from './hooks/use-step-management';
import { useMigrationError } from './hooks/use-migration-error';
import { useMigrationLifecycle } from './hooks/use-migration-lifecycle';

export const useMigrationDemo = (): UseMigrationDemoReturn => {
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
  } = useStepManagement("idle"); // Initial state is idle
  
  const {
    performanceMetrics,
    startTime,
    setStartTime,
    setPerformanceMetrics,
    resetMetrics
  } = usePerformanceMetrics("idle", steps); // Initial state is idle
  
  const {
    errorMessage,
  } = useMigrationError();
  
  const {
    migrationStatus,
    setMigrationStatus,
    handleStartMigration,
    handleResetMigration
  } = useMigrationLifecycle(
    setCurrentStepIndex,
    setOverallProgress,
    resetSteps,
    resetMetrics,
    setStartTime,
    setPerformanceMetrics,
    setSteps,
    setActiveStep
  );
  
  // Effect to update progress when steps change
  useEffect(() => {
    handleProgressUpdate(migrationStatus, steps, currentStepIndex);
  }, [steps, currentStepIndex, migrationStatus, handleProgressUpdate]);
  
  // Effect to handle step updates
  useEffect(() => {
    if (migrationStatus !== "loading") return;
    
    const cleanupFn = updateStepProgress(
      migrationStatus, 
      currentStepIndex, 
      setCurrentStepIndex
    );
    
    return cleanupFn;
  }, [currentStepIndex, migrationStatus, updateStepProgress, setCurrentStepIndex]);
  
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
  }, [steps, migrationStatus, setActiveStep, setMigrationStatus]);
  
  // Handle starting/resetting the migration demo
  const handleMigrationDemo = useCallback(async () => {
    if (migrationStatus === "loading") return;
    
    // If already completed, reset to idle and return
    if (migrationStatus === "success" || migrationStatus === "error") {
      handleResetMigration();
      return;
    }
    
    // Start migration process
    await handleStartMigration();
  }, [migrationStatus, handleResetMigration, handleStartMigration]);

  return {
    migrationStatus,
    steps,
    overallProgress,
    activeStep,
    performanceMetrics,
    errorMessage,
    handleMigrationDemo
  };
};
