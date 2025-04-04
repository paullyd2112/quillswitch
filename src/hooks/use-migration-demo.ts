
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";

export type MigrationStep = {
  name: string;
  status: 'pending' | 'in_progress' | 'complete';
  progress: number;
};

export const useMigrationDemo = () => {
  const [migrationStatus, setMigrationStatus] = useState<"idle" | "loading" | "success">("idle");
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [steps, setSteps] = useState<MigrationStep[]>([
    { name: "Contacts", status: 'pending', progress: 0 },
    { name: "Opportunities & Deals", status: 'pending', progress: 0 },
    { name: "Activities & Tasks", status: 'pending', progress: 0 },
    { name: "Cases & Tickets", status: 'pending', progress: 0 },
    { name: "Accounts & Companies", status: 'pending', progress: 0 },
    { name: "Custom Objects", status: 'pending', progress: 0 }
  ]);
  const [activeStep, setActiveStep] = useState<MigrationStep | undefined>(undefined);
  const [overallProgress, setOverallProgress] = useState(0);
  
  // Update the progress of the current step with smoother animation
  useEffect(() => {
    if (migrationStatus !== "loading") return;
    
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
            
            // Move to the next step if there is one
            if (currentStepIndex < newSteps.length - 1) {
              const nextStep = newSteps[currentStepIndex + 1];
              nextStep.status = 'in_progress';
              setCurrentStepIndex(prevIndex => prevIndex + 1);
            } else {
              // All steps complete
              clearInterval(interval);
              setMigrationStatus("success");
              setActiveStep(undefined);
              toast({
                title: "Migration Complete",
                description: "Your migration has completed successfully!",
              });
            }
          }
        }
        
        // Calculate overall progress
        const totalProgress = newSteps.reduce((acc, step) => acc + step.progress, 0);
        const newOverallProgress = Math.round(totalProgress / (newSteps.length * 100) * 100);
        setOverallProgress(newOverallProgress);
        
        return newSteps;
      });
    }, 100); // Reduced interval time (100ms instead of 200ms) for smoother animations
    
    return () => clearInterval(interval);
  }, [currentStepIndex, migrationStatus]);
  
  const handleMigrationDemo = () => {
    if (migrationStatus === "loading") return;
    
    // If already completed, reset to idle and return
    if (migrationStatus === "success") {
      setMigrationStatus("idle");
      setCurrentStepIndex(0);
      setOverallProgress(0);
      setActiveStep(undefined);
      setSteps(steps.map(step => ({ ...step, status: 'pending', progress: 0 })));
      return;
    }
    
    // Start migration process
    setMigrationStatus("loading");
    
    // Start the first step
    setSteps(prevSteps => {
      const newSteps = [...prevSteps];
      newSteps[0].status = 'in_progress';
      setActiveStep(newSteps[0]);
      return newSteps;
    });
  };

  return {
    migrationStatus,
    steps,
    overallProgress,
    activeStep,
    handleMigrationDemo
  };
};
