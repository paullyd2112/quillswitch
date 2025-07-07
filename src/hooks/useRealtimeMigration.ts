import { useEffect, useState } from 'react';
import { useRealtime } from '@/contexts/RealtimeContext';

export interface MigrationProgressData {
  projectId: string;
  totalRecords: number;
  processedRecords: number;
  failedRecords: number;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'paused';
  currentStage: string;
  estimatedTimeRemaining?: number;
  throughputPerSecond?: number;
  lastUpdate: Date;
  activeUsers: string[];
}

export const useRealtimeMigration = (projectId: string) => {
  const { 
    subscribeMigrationUpdates, 
    broadcastMigrationUpdate, 
    sendNotification 
  } = useRealtime();
  
  const [migrationData, setMigrationData] = useState<MigrationProgressData | null>(null);

  useEffect(() => {
    if (projectId) {
      subscribeMigrationUpdates(projectId);
    }
  }, [projectId, subscribeMigrationUpdates]);

  const updateMigrationProgress = (update: Partial<MigrationProgressData>) => {
    const newData = {
      ...migrationData,
      ...update,
      projectId,
      lastUpdate: new Date(),
    } as MigrationProgressData;
    
    setMigrationData(newData);
    broadcastMigrationUpdate(projectId, update);
  };

  const notifyMigrationEvent = (
    type: 'migration_update' | 'error' | 'completion', 
    title: string, 
    message: string,
    data?: any
  ) => {
    sendNotification({
      type,
      title,
      message,
      project_id: projectId,
      data
    });
  };

  const startMigration = () => {
    updateMigrationProgress({
      status: 'running',
      currentStage: 'Initializing migration...'
    });
    
    notifyMigrationEvent(
      'migration_update',
      'Migration Started',
      `Migration for project ${projectId} has begun`
    );
  };

  const completeMigration = () => {
    updateMigrationProgress({
      status: 'completed',
      currentStage: 'Migration completed successfully',
      processedRecords: migrationData?.totalRecords || 0
    });
    
    notifyMigrationEvent(
      'completion',
      'Migration Complete',
      `All ${migrationData?.totalRecords || 0} records migrated successfully`
    );
  };

  const failMigration = (error: string) => {
    updateMigrationProgress({
      status: 'failed',
      currentStage: `Migration failed: ${error}`
    });
    
    notifyMigrationEvent(
      'error',
      'Migration Failed',
      error
    );
  };

  return {
    migrationData,
    updateMigrationProgress,
    notifyMigrationEvent,
    startMigration,
    completeMigration,
    failMigration
  };
};