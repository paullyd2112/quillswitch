
import { useState, useEffect } from "react";
import { MigrationStep, MigrationStatus } from '../types';

type UseProgressReturnType = {
  currentStepIndex: number;
  setCurrentStepIndex: React.Dispatch<React.SetStateAction<number>>;
  overallProgress: number;
  setOverallProgress: React.Dispatch<React.SetStateAction<number>>;
  handleProgressUpdate: (migrationStatus: MigrationStatus, steps: MigrationStep[], currentStep: number) => void;
};

/**
 * Hook to manage migration progress state and updates
 */
export const useMigrationProgress = (): UseProgressReturnType => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [overallProgress, setOverallProgress] = useState(0);
  
  // Calculates and updates the overall progress based on steps
  const handleProgressUpdate = (
    migrationStatus: MigrationStatus, 
    steps: MigrationStep[], 
    currentStep: number
  ) => {
    if (migrationStatus !== "loading") return;
    
    // Calculate overall progress
    const totalProgress = steps.reduce((acc, step) => acc + step.progress, 0);
    const newOverallProgress = Math.round(totalProgress / (steps.length * 100) * 100);
    setOverallProgress(newOverallProgress);
  };

  return {
    currentStepIndex,
    setCurrentStepIndex,
    overallProgress,
    setOverallProgress,
    handleProgressUpdate
  };
};
