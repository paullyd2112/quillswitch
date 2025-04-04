import { useState, useEffect, useCallback } from "react";
import { toast } from "@/hooks/use-toast";

export type MigrationStep = {
  name: string;
  status: 'pending' | 'in_progress' | 'complete';
  progress: number;
  // Added record size to simulate data volume per record type
  recordSize?: number;
};

export type PerformanceMetrics = {
  averageRecordsPerSecond: number;
  peakRecordsPerSecond: number;
  estimatedTimeRemaining: number;
  totalRecordsProcessed: number;
  dataVolume: number;
};

export const useMigrationDemo = () => {
  const [migrationStatus, setMigrationStatus] = useState<"idle" | "loading" | "success">("idle");
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [steps, setSteps] = useState<MigrationStep[]>([
    { name: "Contacts", status: 'pending', progress: 0, recordSize: 5 }, // 5KB per record
    { name: "Opportunities & Deals", status: 'pending', progress: 0, recordSize: 8 }, // 8KB per record
    { name: "Activities & Tasks", status: 'pending', progress: 0, recordSize: 3 }, // 3KB per record
    { name: "Cases & Tickets", status: 'pending', progress: 0, recordSize: 10 }, // 10KB per record
    { name: "Accounts & Companies", status: 'pending', progress: 0, recordSize: 15 }, // 15KB per record
    { name: "Custom Objects", status: 'pending', progress: 0, recordSize: 20 }, // 20KB per record
  ]);
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
  const [recordsProcessedHistory, setRecordsProcessedHistory] = useState<{timestamp: number, records: number}[]>([]);
  const [peakRps, setPeakRps] = useState(0);
  
  // Get total records count
  const getTotalRecords = useCallback(() => {
    return steps.reduce((acc, step) => acc + (step.name === "Contacts" ? 1250 : step.name === "Accounts & Companies" ? 87 : 150), 0);
  }, [steps]);
  
  // Calculate data volume in KB
  const calculateDataVolume = useCallback((processedRecords: number): number => {
    let volume = 0;
    steps.forEach(step => {
      const stepTotal = step.name === "Contacts" ? 1250 : step.name === "Accounts & Companies" ? 87 : 150;
      const stepProcessed = stepTotal * (step.progress / 100);
      volume += stepProcessed * (step.recordSize || 5); // Default to 5KB if recordSize not specified
    });
    return volume;
  }, [steps]);
  
  // Simulate performance metrics with improved accuracy
  useEffect(() => {
    if (migrationStatus !== "loading" || !startTime) return;
    
    const updatePerformanceMetrics = () => {
      const elapsedMs = Date.now() - startTime.getTime();
      const elapsedSeconds = elapsedMs / 1000;
      
      if (elapsedSeconds <= 0) return;
      
      // Calculate total records processed based on steps progress
      const totalRecords = getTotalRecords();
      const processedRecords = steps.reduce((acc, step) => {
        const stepTotal = step.name === "Contacts" ? 1250 : step.name === "Accounts & Companies" ? 87 : 150;
        return acc + (stepTotal * (step.progress / 100));
      }, 0);
      
      // Store history for rolling averages
      const newHistory = [...recordsProcessedHistory, {timestamp: Date.now(), records: processedRecords}];
      
      // Only keep last 10 history points for efficiency
      if (newHistory.length > 10) {
        newHistory.shift();
      }
      
      setRecordsProcessedHistory(newHistory);
      
      // Calculate records per second with improved averaging
      let rps = 0;
      
      if (newHistory.length >= 2) {
        const earliest = newHistory[0];
        const latest = newHistory[newHistory.length - 1];
        const timeSpanSeconds = (latest.timestamp - earliest.timestamp) / 1000;
        const recordsDiff = latest.records - earliest.records;
        
        if (timeSpanSeconds > 0) {
          rps = recordsDiff / timeSpanSeconds;
        }
      } else {
        // Fallback to simple calculation if not enough history
        rps = processedRecords / elapsedSeconds;
      }
      
      // Add some realistic variation (slight jitter)
      const jitter = rps * 0.1 * (Math.random() - 0.5); // +/- 10% randomness
      const finalRps = Math.max(0.1, rps + jitter);
      
      // Track peak RPS
      if (finalRps > peakRps) {
        setPeakRps(finalRps);
      }
      
      // Calculate estimated time remaining with smoothing
      const remainingRecords = totalRecords - processedRecords;
      const rawEstimatedSecondsRemaining = remainingRecords / finalRps;
      
      // Apply a smoothing factor to avoid jumpy estimates
      let smoothedEstimate = rawEstimatedSecondsRemaining;
      
      if (performanceMetrics.estimatedTimeRemaining) {
        const prevEstimate = performanceMetrics.estimatedTimeRemaining;
        // Weighted average - 70% previous estimate, 30% new estimate to smooth changes
        smoothedEstimate = (prevEstimate * 0.7) + (rawEstimatedSecondsRemaining * 0.3);
      }
      
      // Calculate data volume
      const dataVolume = calculateDataVolume(processedRecords);
      
      setPerformanceMetrics({
        averageRecordsPerSecond: finalRps,
        peakRecordsPerSecond: peakRps,
        estimatedTimeRemaining: Math.round(smoothedEstimate),
        totalRecordsProcessed: Math.round(processedRecords),
        dataVolume
      });
    };
    
    const intervalId = setInterval(updatePerformanceMetrics, 1000);
    return () => clearInterval(intervalId);
  }, [migrationStatus, steps, startTime, recordsProcessedHistory, peakRps, 
      performanceMetrics.estimatedTimeRemaining, getTotalRecords, calculateDataVolume]);
  
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
              
              // Save final metrics for summary display
              const finalMetrics = {...performanceMetrics};
              
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
  }, [currentStepIndex, migrationStatus, performanceMetrics, toast]);
  
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
      setPeakRps(0);
      setRecordsProcessedHistory([]);
      setSteps(steps.map(step => ({ ...step, status: 'pending', progress: 0 })));
      
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
