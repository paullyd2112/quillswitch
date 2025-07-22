
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface CloudMigrationRequest {
  projectId: string;
  sourceCredentials: {
    type: string;
    connectionId: string;
  };
  destinationCredentials: {
    type: string;
    connectionId: string;
  };
  objectTypes: string[];
  fieldMappings: Record<string, any>;
  schedule?: {
    immediate?: boolean;
    scheduledAt?: string;
    recurring?: boolean;
    cronExpression?: string;
  };
}

export interface MigrationProgress {
  stage: string;
  percentage: number;
  currentObject: string;
  processedRecords: number;
  totalRecords: number;
  throughputPerSecond: number;
  estimatedTimeRemaining: number;
  errors: any[];
}

export class CloudMigrationService {
  private static instance: CloudMigrationService;

  public static getInstance(): CloudMigrationService {
    if (!CloudMigrationService.instance) {
      CloudMigrationService.instance = new CloudMigrationService();
    }
    return CloudMigrationService.instance;
  }

  /**
   * Start a cloud-based migration that runs independently
   */
  async startCloudMigration(request: CloudMigrationRequest): Promise<{ success: boolean; projectId: string }> {
    try {
      console.log('Starting cloud migration for project:', request.projectId);
      
      const { data, error } = await supabase.functions.invoke('migration-orchestrator', {
        body: {
          action: 'start_migration',
          ...request
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      toast.success('Cloud migration started successfully!', {
        description: 'Your migration is now running in the cloud and will continue even if you close this page.'
      });

      return { success: true, projectId: request.projectId };
    } catch (error: any) {
      console.error('Failed to start cloud migration:', error);
      toast.error('Failed to start migration', {
        description: error.message || 'Unknown error occurred'
      });
      throw error;
    }
  }

  /**
   * Get real-time migration progress
   */
  async getMigrationProgress(projectId: string): Promise<MigrationProgress> {
    try {
      const { data, error } = await supabase.functions.invoke('migration-orchestrator', {
        body: {
          action: 'get_progress',
          projectId
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      return data.progress;
    } catch (error: any) {
      console.error('Failed to get migration progress:', error);
      throw error;
    }
  }

  /**
   * Pause a running migration
   */
  async pauseMigration(projectId: string): Promise<void> {
    try {
      const { error } = await supabase.functions.invoke('migration-orchestrator', {
        body: {
          action: 'pause_migration',
          projectId
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      toast.success('Migration paused successfully');
    } catch (error: any) {
      console.error('Failed to pause migration:', error);
      toast.error('Failed to pause migration', {
        description: error.message
      });
      throw error;
    }
  }

  /**
   * Resume a paused migration
   */
  async resumeMigration(projectId: string): Promise<void> {
    try {
      const { error } = await supabase.functions.invoke('migration-orchestrator', {
        body: {
          action: 'resume_migration',
          projectId
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      toast.success('Migration resumed successfully');
    } catch (error: any) {
      console.error('Failed to resume migration:', error);
      toast.error('Failed to resume migration', {
        description: error.message
      });
      throw error;
    }
  }

  /**
   * Cancel a migration
   */
  async cancelMigration(projectId: string): Promise<void> {
    try {
      const { error } = await supabase.functions.invoke('migration-orchestrator', {
        body: {
          action: 'cancel_migration',
          projectId
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      toast.success('Migration cancelled successfully');
    } catch (error: any) {
      console.error('Failed to cancel migration:', error);
      toast.error('Failed to cancel migration', {
        description: error.message
      });
      throw error;
    }
  }

  /**
   * Schedule a recurring migration
   */
  async scheduleRecurringMigration(schedule: {
    name: string;
    description?: string;
    cronExpression: string;
    migrationConfig: CloudMigrationRequest;
    workspaceId: string;
  }): Promise<void> {
    try {
      const { error } = await supabase
        .from('migration_schedules')
        .insert({
          name: schedule.name,
          description: schedule.description,
          cron_expression: schedule.cronExpression,
          migration_config: JSON.parse(JSON.stringify(schedule.migrationConfig)),
          workspace_id: schedule.workspaceId,
          user_id: (await supabase.auth.getUser()).data.user?.id!,
          is_active: true,
          next_run_at: this.getNextRunTime(schedule.cronExpression)
        });

      if (error) {
        throw new Error(error.message);
      }

      toast.success('Migration scheduled successfully!', {
        description: `Your migration will run automatically based on the schedule: ${schedule.cronExpression}`
      });
    } catch (error: any) {
      console.error('Failed to schedule migration:', error);
      toast.error('Failed to schedule migration', {
        description: error.message
      });
      throw error;
    }
  }

  /**
   * Get all migration schedules for a workspace
   */
  async getMigrationSchedules(workspaceId: string) {
    try {
      const { data, error } = await supabase
        .from('migration_schedules')
        .select('*')
        .eq('workspace_id', workspaceId)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data || [];
    } catch (error: any) {
      console.error('Failed to get migration schedules:', error);
      throw error;
    }
  }

  /**
   * Subscribe to real-time migration progress updates
   */
  subscribeToMigrationUpdates(projectId: string, callback: (progress: MigrationProgress) => void) {
    const channel = supabase
      .channel(`migration-${projectId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'migration_stages',
          filter: `project_id=eq.${projectId}`
        },
        async () => {
          // Fetch latest progress when stages are updated
          try {
            const progress = await this.getMigrationProgress(projectId);
            callback(progress);
          } catch (error) {
            console.error('Error fetching progress update:', error);
          }
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }

  private getNextRunTime(cronExpression: string): string {
    // Simple implementation - in production, use a proper cron library
    const now = new Date();
    const next = new Date(now);
    next.setHours(next.getHours() + 1); // Run in 1 hour for demo
    return next.toISOString();
  }
}

export const cloudMigrationService = CloudMigrationService.getInstance();
