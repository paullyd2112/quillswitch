
import { useState, useEffect, useCallback } from "react";
import { toast } from "@/hooks/use-toast";
import { UseMigrationDemoReturn, MigrationStatus } from './types';
import { useMigrationProgress } from './hooks/use-migration-progress';
import { usePerformanceMetrics } from './hooks/use-performance-metrics';
import { useStepManagement } from './hooks/use-step-management';
import { apiClient } from "@/services/migration/apiClient";

export const useMigrationDemo = (): UseMigrationDemoReturn => {
  const [migrationStatus, setMigrationStatus] = useState<MigrationStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
  
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
    setPerformanceMetrics,
    resetMetrics
  } = usePerformanceMetrics(migrationStatus, steps);
  
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
  }, [steps, migrationStatus]);

  // Create a migration using the API
  const createMigration = useCallback(async () => {
    try {
      // Prepare migration data for API
      const migrationData = {
        name: "Demo CRM Migration",
        source: {
          type: "salesforce",
          credentials: {
            accessToken: "demo_token_sf",
            instanceUrl: "https://demo.salesforce.com"
          }
        },
        destination: {
          type: "hubspot",
          credentials: {
            apiKey: "demo_hubspot_key"
          }
        },
        dataTypes: [
          {
            type: "contacts",
            filters: {
              updatedAfter: "2023-01-01T00:00:00Z"
            },
            fieldMapping: {
              firstName: "firstName",
              lastName: "lastName",
              email: "email"
            }
          },
          {
            type: "accounts",
            fieldMapping: {
              name: "name",
              industry: "industry"
            }
          }
        ],
        schedule: {
          startNow: true
        }
      };

      console.log("Creating migration with data:", migrationData);
      
      // Call the migrations API
      const response = await apiClient.createMigration(migrationData);
      console.log("Migration created successfully:", response);
      
      return response.data.migrationId;
    } catch (error) {
      console.error("Error creating migration:", error);
      setErrorMessage(error instanceof Error ? error.message : "Failed to start migration");
      setMigrationStatus("error");
      toast({
        title: "Migration Error",
        description: "Failed to start migration. Please try again.",
        variant: "destructive"
      });
      throw error;
    }
  }, []);
  
  // Handle starting/resetting the migration demo
  const handleMigrationDemo = useCallback(async () => {
    if (migrationStatus === "loading") return;
    
    // If already completed, reset to idle and return
    if (migrationStatus === "success" || migrationStatus === "error") {
      setMigrationStatus("idle");
      setCurrentStepIndex(0);
      setOverallProgress(0);
      resetSteps();
      resetMetrics();
      setErrorMessage(undefined);
      
      toast({
        title: "Migration Reset",
        description: "The migration demo has been reset. Click to start again.",
      });
      
      return;
    }
    
    // Start migration process
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
      // Error is already handled in createMigration
    }
  }, [migrationStatus, setCurrentStepIndex, setOverallProgress, resetSteps, resetMetrics, setStartTime, setPerformanceMetrics, setSteps, setActiveStep, createMigration]);

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
