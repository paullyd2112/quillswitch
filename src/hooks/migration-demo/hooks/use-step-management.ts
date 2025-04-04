
import { useState, useEffect } from "react";
import { MigrationStep, MigrationStatus } from '../types';
import { toast } from "@/hooks/use-toast";
import { initialMigrationSteps } from '../migration-data';

type UseStepManagementReturnType = {
  steps: MigrationStep[];
  setSteps: React.Dispatch<React.SetStateAction<MigrationStep[]>>;
  activeStep: MigrationStep | undefined;
  setActiveStep: React.Dispatch<React.SetStateAction<MigrationStep | undefined>>;
  resetSteps: () => void;
  updateStepProgress: (status: MigrationStatus, currentStepIndex: number, setCurrentStepIndex: (index: number) => void) => void;
};

/**
 * Hook to manage step statuses and progression
 */
export const useStepManagement = (migrationStatus: MigrationStatus): UseStepManagementReturnType => {
  const [steps, setSteps] = useState<MigrationStep[]>(initialMigrationSteps);
  const [activeStep, setActiveStep] = useState<MigrationStep | undefined>(undefined);
  
  // Reset steps to initial state
  const resetSteps = () => {
    setSteps(initialMigrationSteps.map(step => ({ ...step })));
    setActiveStep(undefined);
  };
  
  // Update current step progress
  const updateStepProgress = (
    status: MigrationStatus, 
    currentStepIndex: number,
    setCurrentStepIndex: (index: number) => void
  ) => {
    if (status !== "loading") return;
    
    const interval = setInterval(() => {
      setSteps(prevSteps => {
        const newSteps = [...prevSteps];
        const currentStep = newSteps[currentStepIndex];
        
        // Update progress of current step with smaller increments for smoother animation
        if (currentStep && currentStep.status === 'in_progress') {
          // Set active step for display purposes
          setActiveStep(currentStep);
          
          // Smaller increments (5 instead of 10) for smoother transitions
          currentStep.progress = Math.min(100, currentStep.progress + 5);
          
          // If step is complete, move to next step
          if (currentStep.progress === 100) {
            currentStep.status = 'complete';
            
            // Show toast notification when a step completes
            toast({
              title: `${currentStep.name} Migration Complete`,
              description: `Successfully migrated all ${currentStep.name} data.`,
            });
            
            // Move to the next step if there is one
            if (currentStepIndex < newSteps.length - 1) {
              const nextStep = newSteps[currentStepIndex + 1];
              nextStep.status = 'in_progress';
              setCurrentStepIndex(currentStepIndex + 1);
              
              // Show toast notification when a new step starts
              toast({
                title: `Starting ${nextStep.name} Migration`,
                description: `Beginning to migrate ${nextStep.name} data...`,
              });
            } else {
              // All steps complete
              clearInterval(interval);
            }
          }
        }
        
        return newSteps;
      });
    }, 100); // Reduced interval time for smoother animations
    
    return () => clearInterval(interval);
  };

  return {
    steps,
    setSteps,
    activeStep,
    setActiveStep,
    resetSteps,
    updateStepProgress
  };
};
