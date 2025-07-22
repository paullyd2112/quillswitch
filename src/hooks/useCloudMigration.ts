
import { useState, useEffect, useCallback } from 'react';
import { cloudMigrationService, CloudMigrationRequest, MigrationProgress } from '@/services/cloud/CloudMigrationService';

export const useCloudMigration = (projectId?: string) => {
  const [isStarting, setIsStarting] = useState(false);
  const [progress, setProgress] = useState<MigrationProgress | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!projectId) return;

    const unsubscribe = cloudMigrationService.subscribeToMigrationUpdates(
      projectId,
      (newProgress) => {
        setProgress(newProgress);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [projectId]);

  // Fetch initial progress
  useEffect(() => {
    if (!projectId) return;

    const fetchProgress = async () => {
      setIsLoading(true);
      try {
        const currentProgress = await cloudMigrationService.getMigrationProgress(projectId);
        setProgress(currentProgress);
        setError(null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProgress();
  }, [projectId]);

  const startMigration = useCallback(async (request: CloudMigrationRequest) => {
    setIsStarting(true);
    setError(null);
    
    try {
      const result = await cloudMigrationService.startCloudMigration(request);
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsStarting(false);
    }
  }, []);

  const pauseMigration = useCallback(async () => {
    if (!projectId) return;
    
    try {
      await cloudMigrationService.pauseMigration(projectId);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, [projectId]);

  const resumeMigration = useCallback(async () => {
    if (!projectId) return;
    
    try {
      await cloudMigrationService.resumeMigration(projectId);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, [projectId]);

  const cancelMigration = useCallback(async () => {
    if (!projectId) return;
    
    try {
      await cloudMigrationService.cancelMigration(projectId);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, [projectId]);

  const scheduleRecurring = useCallback(async (schedule: {
    name: string;
    description?: string;
    cronExpression: string;
    migrationConfig: CloudMigrationRequest;
    workspaceId: string;
  }) => {
    try {
      await cloudMigrationService.scheduleRecurringMigration(schedule);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, []);

  return {
    // State
    isStarting,
    progress,
    isLoading,
    error,
    
    // Actions
    startMigration,
    pauseMigration,
    resumeMigration,
    cancelMigration,
    scheduleRecurring,
    
    // Computed
    isRunning: progress?.stage !== 'Completed' && progress?.stage !== 'Failed',
    isPaused: progress?.stage === 'Paused',
    isCompleted: progress?.stage === 'Completed',
    isFailed: progress?.stage === 'Failed'
  };
};
