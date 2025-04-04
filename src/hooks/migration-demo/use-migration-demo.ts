import { useState, useEffect, useCallback } from "react";
import { toast } from "@/hooks/use-toast";
import { 
  MigrationStep, 
  MigrationStatus, 
  MigrationHistoryPoint,
  UseMigrationDemoReturn
} from './types';
import { initialMigrationSteps, getTotalRecords } from './migration-data';
import { updatePerformanceMetrics, calculateProcessedRecords } from './performance-utils';

export const useMigrationDemo = (): UseMigrationDemoReturn => {
  const [migrationStatus, setMigrationStatus] = useState<MigrationStatus>("idle");
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [steps, setSteps] = useState<MigrationStep[]>(initialMigrationSteps);
  const [activeStep, setActiveStep] = useState<MigrationStep | undefined>(undefined);
  const [overallProgress, setOverallProgress] = useState(0);
  const [performanceMetrics, setPerformanceMetrics] = useState<{
    averageRecordsPerSecond?: number;
    peakRecordsPerSecond?: number;
    estimatedTimeRemaining?: number;
    totalRecordsProcessed?: number;
    dataVolume?: number;
  }>({});
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [recordsProcessedHistory, setRecordsProcessedHistory] = useState<MigrationHistoryPoint[]>([]);
  const [peakRps, setPeakRps] = useState(0);
  
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
  
  // Update progress and step states
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
            
            // Show toast notification when a step completes
            toast({
              title: `${currentStep.name} Migration Complete`,
              description: `Successfully migrated all ${currentStep.name} data.`,
            });
            
            // Move to the next step if there is one
            if (currentStepIndex < newSteps.length - 1) {
              const nextStep = newSteps[currentStepIndex + 1];
              nextStep.status = 'in_progress';
              setCurrentStepIndex(prevIndex => prevIndex + 1);
              
              // Show toast notification when a new step starts
              toast({
                title: `Starting ${nextStep.name} Migration`,
                description: `Beginning to migrate ${nextStep.name} data...`,
              });
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
    }, 100); // Reduced interval time for smoother animations
    
    return () => clearInterval(interval);
  }, [currentStepIndex, migrationStatus]);
  
  // Handle starting/resetting the migration demo
  const handleMigrationDemo = useCallback(() => {
    if (migrationStatus === "loading") return;
    
    // If already completed, reset to idle and return
    if (migrationStatus === "success") {
      setMigrationStatus("idle");
      setCurrentStepIndex(0);
      setOverallProgress(0);
      setActiveStep(undefined);
      setPerformanceMetrics({});
      setStartTime(null);
      setPeakRps(0);
      setRecordsProcessedHistory([]);
      setSteps(initialMigrationSteps.map(step => ({ ...step })));
      
      toast({
        title: "Migration Reset",
        description: "The migration demo has been reset. Click to start again.",
      });
      
      return;
    }
    
    // Start migration process
    setMigrationStatus("loading");
    setStartTime(new Date());
    setRecordsProcessedHistory([{timestamp: Date.now(), records: 0}]);
    
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
