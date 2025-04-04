
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";

export type MigrationStep = {
  name: string;
  status: 'pending' | 'in_progress' | 'complete';
  progress: number;
};

export type PerformanceMetrics = {
  averageRecordsPerSecond: number;
  peakRecordsPerSecond: number;
  estimatedTimeRemaining: number;
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
  const [performanceMetrics, setPerformanceMetrics] = useState<{
    averageRecordsPerSecond?: number;
    estimatedTimeRemaining?: number;
  }>({});
  const [startTime, setStartTime] = useState<Date | null>(null);
  
  // Simulate performance metrics
  useEffect(() => {
    if (migrationStatus !== "loading" || !startTime) return;
    
    const updatePerformanceMetrics = () => {
      const elapsedMs = Date.now() - startTime.getTime();
      const elapsedSeconds = elapsedMs / 1000;
      
      if (elapsedSeconds <= 0) return;
      
      // Calculate total records processed based on steps progress
      const totalRecords = steps.reduce((acc, step) => acc + (step.name === "Contacts" ? 1250 : step.name === "Accounts & Companies" ? 87 : 150), 0);
      const processedRecords = steps.reduce((acc, step) => {
        const stepTotal = step.name === "Contacts" ? 1250 : step.name === "Accounts & Companies" ? 87 : 150;
        return acc + (stepTotal * (step.progress / 100));
      }, 0);
      
      // Calculate records per second with some randomness for realism
      const baseRps = processedRecords / elapsedSeconds;
      const jitter = baseRps * 0.2 * (Math.random() - 0.5); // +/- 20% randomness
      const rps = Math.max(0.1, baseRps + jitter);
      
      // Calculate estimated time remaining
      const remainingRecords = totalRecords - processedRecords;
      const estimatedSecondsRemaining = remainingRecords / rps;
      
      setPerformanceMetrics({
        averageRecordsPerSecond: rps,
        estimatedTimeRemaining: estimatedSecondsRemaining
      });
    };
    
    const intervalId = setInterval(updatePerformanceMetrics, 2000);
    return () => clearInterval(intervalId);
  }, [migrationStatus, steps, startTime]);
  
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
              setPerformanceMetrics({});
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
      setPerformanceMetrics({});
      setStartTime(null);
      setSteps(steps.map(step => ({ ...step, status: 'pending', progress: 0 })));
      return;
    }
    
    // Start migration process
    setMigrationStatus("loading");
    setStartTime(new Date());
    
    // Initialize performance metrics
    setPerformanceMetrics({
      averageRecordsPerSecond: 0,
      estimatedTimeRemaining: 0
    });
    
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
    performanceMetrics,
    handleMigrationDemo
  };
};
