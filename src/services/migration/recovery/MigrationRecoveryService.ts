import { supabase } from '@/integrations/supabase/client';

export interface RecoveryPoint {
  id: string;
  project_id: string;
  object_type: string;
  snapshot_data: Record<string, any>;
  created_at: string;
  record_count: number;
  status: 'active' | 'restored' | 'expired';
}

export interface RollbackOperation {
  id: string;
  project_id: string;
  initiated_at: string;
  completed_at?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  rollback_type: 'full' | 'partial' | 'object_type';
  target_object_types: string[];
  records_rolled_back: number;
  errors: string[];
}

export class MigrationRecoveryService {
  static async createRecoveryPoint(
    projectId: string,
    objectType: string,
    description?: string
  ): Promise<string> {
    try {
      // Get current migration state
      const { data: migrationRecords, error: recordsError } = await supabase
        .from('migration_records')
        .select('*')
        .eq('project_id', projectId)
        .eq('object_type', objectType)
        .eq('status', 'migrated');

      if (recordsError) throw recordsError;

      const { data: objectTypeData, error: objectError } = await supabase
        .from('migration_object_types')
        .select('*')
        .eq('project_id', projectId)
        .eq('name', objectType)
        .single();

      if (objectError) throw objectError;

      // Create snapshot
      const snapshotData = {
        migration_records: migrationRecords || [],
        object_type_status: objectTypeData,
        timestamp: new Date().toISOString(),
        description: description || `Auto-created recovery point for ${objectType}`
      };

      // Store recovery point in a dedicated table (would need to create this)
      // For now, store in user_activities with special type
      const { data, error } = await supabase
        .from('user_activities')
        .insert({
          project_id: projectId,
          activity_type: 'recovery_point',
          activity_description: `Recovery point created for ${objectType}`,
          activity_details: {
            object_type: objectType,
            snapshot_data: snapshotData,
            record_count: migrationRecords?.length || 0
          }
        })
        .select('id')
        .single();

      if (error) throw error;

      console.log(`Recovery point created for ${objectType}: ${data.id}`);
      return data.id;
    } catch (error) {
      console.error('Failed to create recovery point:', error);
      throw error;
    }
  }

  static async initiateRollback(
    projectId: string,
    rollbackType: 'full' | 'partial' | 'object_type',
    targetObjectTypes: string[] = [],
    recoveryPointId?: string
  ): Promise<string> {
    try {
      // Log rollback initiation
      const { data: rollbackRecord, error: logError } = await supabase
        .from('user_activities')
        .insert({
          project_id: projectId,
          activity_type: 'rollback_initiated',
          activity_description: `Rollback initiated: ${rollbackType}`,
          activity_details: {
            rollback_type: rollbackType,
            target_object_types: targetObjectTypes,
            recovery_point_id: recoveryPointId,
            initiated_at: new Date().toISOString(),
            status: 'pending'
          }
        })
        .select('id')
        .single();

      if (logError) throw logError;

      // Start rollback process
      await this.executeRollback(projectId, rollbackType, targetObjectTypes, rollbackRecord.id);

      return rollbackRecord.id;
    } catch (error) {
      console.error('Failed to initiate rollback:', error);
      throw error;
    }
  }

  static async executeRollback(
    projectId: string,
    rollbackType: 'full' | 'partial' | 'object_type',
    targetObjectTypes: string[],
    rollbackId: string
  ): Promise<void> {
    try {
      // Update rollback status
      await supabase
        .from('user_activities')
        .update({
          activity_details: {
            status: 'in_progress',
            started_at: new Date().toISOString()
          }
        })
        .eq('id', rollbackId);

      let recordsRolledBack = 0;
      const errors: string[] = [];

      if (rollbackType === 'full') {
        // Full rollback: reset entire project
        recordsRolledBack = await this.rollbackFullProject(projectId);
      } else if (rollbackType === 'object_type') {
        // Object-specific rollback
        for (const objectType of targetObjectTypes) {
          try {
            const count = await this.rollbackObjectType(projectId, objectType);
            recordsRolledBack += count;
          } catch (error) {
            errors.push(`Failed to rollback ${objectType}: ${error instanceof Error ? error.message : 'Unknown error'}`);
          }
        }
      } else if (rollbackType === 'partial') {
        // Partial rollback: rollback failed records only
        recordsRolledBack = await this.rollbackFailedRecords(projectId, targetObjectTypes);
      }

      // Update rollback completion status
      await supabase
        .from('user_activities')
        .update({
          activity_details: {
            status: errors.length > 0 ? 'completed_with_errors' : 'completed',
            completed_at: new Date().toISOString(),
            records_rolled_back: recordsRolledBack,
            errors: errors
          }
        })
        .eq('id', rollbackId);

      console.log(`Rollback completed: ${recordsRolledBack} records, ${errors.length} errors`);
    } catch (error) {
      console.error('Rollback execution failed:', error);
      
      // Update rollback failure status
      await supabase
        .from('user_activities')
        .update({
          activity_details: {
            status: 'failed',
            failed_at: new Date().toISOString(),
            error: error instanceof Error ? error.message : 'Unknown error'
          }
        })
        .eq('id', rollbackId);

      throw error;
    }
  }

  static async rollbackFullProject(projectId: string): Promise<number> {
    try {
      // Get all migrated records
      const { data: migratedRecords, error: fetchError } = await supabase
        .from('migration_records')
        .select('*')
        .eq('project_id', projectId)
        .eq('status', 'migrated');

      if (fetchError) throw fetchError;

      if (!migratedRecords || migratedRecords.length === 0) {
        return 0;
      }

      // Update all migrated records back to extracted status
      const { error: updateError } = await supabase
        .from('migration_records')
        .update({
          status: 'extracted',
          destination_system: null,
          updated_at: new Date().toISOString()
        })
        .eq('project_id', projectId)
        .eq('status', 'migrated');

      if (updateError) throw updateError;

      // Reset object type statuses
      const { error: objectUpdateError } = await supabase
        .from('migration_object_types')
        .update({
          processed_records: 0,
          failed_records: 0,
          status: 'extracted'
        })
        .eq('project_id', projectId);

      if (objectUpdateError) throw objectUpdateError;

      // Reset project status
      const { error: projectUpdateError } = await supabase
        .from('migration_projects')
        .update({
          status: 'extracted',
          migrated_objects: 0,
          failed_objects: 0,
          updated_at: new Date().toISOString(),
          completed_at: null
        })
        .eq('id', projectId);

      if (projectUpdateError) throw projectUpdateError;

      return migratedRecords.length;
    } catch (error) {
      console.error('Full project rollback failed:', error);
      throw error;
    }
  }

  static async rollbackObjectType(projectId: string, objectType: string): Promise<number> {
    try {
      // Get migrated records for this object type
      const { data: migratedRecords, error: fetchError } = await supabase
        .from('migration_records')
        .select('id')
        .eq('project_id', projectId)
        .eq('object_type', objectType)
        .eq('status', 'migrated');

      if (fetchError) throw fetchError;

      if (!migratedRecords || migratedRecords.length === 0) {
        return 0;
      }

      // Update records back to extracted status
      const { error: updateError } = await supabase
        .from('migration_records')
        .update({
          status: 'extracted',
          destination_system: null,
          updated_at: new Date().toISOString()
        })
        .eq('project_id', projectId)
        .eq('object_type', objectType)
        .eq('status', 'migrated');

      if (updateError) throw updateError;

      // Reset object type status
      const { error: objectUpdateError } = await supabase
        .from('migration_object_types')
        .update({
          processed_records: 0,
          failed_records: 0,
          status: 'extracted'
        })
        .eq('project_id', projectId)
        .eq('name', objectType);

      if (objectUpdateError) throw objectUpdateError;

      return migratedRecords.length;
    } catch (error) {
      console.error(`Object type ${objectType} rollback failed:`, error);
      throw error;
    }
  }

  static async rollbackFailedRecords(projectId: string, objectTypes: string[]): Promise<number> {
    try {
      let totalRolledBack = 0;

      for (const objectType of objectTypes) {
        // Get failed records
        const { data: failedRecords, error: fetchError } = await supabase
          .from('migration_records')
          .select('id')
          .eq('project_id', projectId)
          .eq('object_type', objectType)
          .eq('status', 'failed');

        if (fetchError) throw fetchError;

        if (failedRecords && failedRecords.length > 0) {
          // Reset failed records to extracted status for retry
          const { error: updateError } = await supabase
            .from('migration_records')
            .update({
              status: 'extracted',
              updated_at: new Date().toISOString()
            })
            .eq('project_id', projectId)
            .eq('object_type', objectType)
            .eq('status', 'failed');

          if (updateError) throw updateError;

          totalRolledBack += failedRecords.length;
        }

        // Update object type failed count
        const { error: objectUpdateError } = await supabase
          .from('migration_object_types')
          .update({
            failed_records: 0,
            status: 'partial' // Indicates ready for retry
          })
          .eq('project_id', projectId)
          .eq('name', objectType);

        if (objectUpdateError) throw objectUpdateError;
      }

      return totalRolledBack;
    } catch (error) {
      console.error('Failed records rollback failed:', error);
      throw error;
    }
  }

  static async getRecoveryPoints(projectId: string): Promise<RecoveryPoint[]> {
    try {
      const { data, error } = await supabase
        .from('user_activities')
        .select('*')
        .eq('project_id', projectId)
        .eq('activity_type', 'recovery_point')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(activity => ({
        id: activity.id,
        project_id: activity.project_id!,
        object_type: (activity.activity_details as any)?.object_type || 'unknown',
        snapshot_data: (activity.activity_details as any)?.snapshot_data || {},
        created_at: activity.created_at,
        record_count: (activity.activity_details as any)?.record_count || 0,
        status: 'active' as const
      }));
    } catch (error) {
      console.error('Failed to get recovery points:', error);
      return [];
    }
  }

  static async getRollbackHistory(projectId: string): Promise<RollbackOperation[]> {
    try {
      const { data, error } = await supabase
        .from('user_activities')
        .select('*')
        .eq('project_id', projectId)
        .in('activity_type', ['rollback_initiated', 'rollback_completed'])
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(activity => ({
        id: activity.id,
        project_id: activity.project_id!,
        initiated_at: activity.created_at,
        completed_at: (activity.activity_details as any)?.completed_at,
        status: (activity.activity_details as any)?.status || 'pending',
        rollback_type: (activity.activity_details as any)?.rollback_type || 'partial',
        target_object_types: (activity.activity_details as any)?.target_object_types || [],
        records_rolled_back: (activity.activity_details as any)?.records_rolled_back || 0,
        errors: (activity.activity_details as any)?.errors || []
      }));
    } catch (error) {
      console.error('Failed to get rollback history:', error);
      return [];
    }
  }

  static async validateRecoveryState(projectId: string): Promise<{
    isConsistent: boolean;
    issues: string[];
    recommendations: string[];
  }> {
    const issues: string[] = [];
    const recommendations: string[] = [];

    try {
      // Check for orphaned records
      const { data: records, error: recordsError } = await supabase
        .from('migration_records')
        .select('object_type, status')
        .eq('project_id', projectId);

      if (recordsError) throw recordsError;

      const { data: objectTypes, error: objectTypesError } = await supabase
        .from('migration_object_types')
        .select('*')
        .eq('project_id', projectId);

      if (objectTypesError) throw objectTypesError;

      // Validate record counts match object type counts
      const recordCounts = records?.reduce((acc, record) => {
        acc[record.object_type] = acc[record.object_type] || { extracted: 0, migrated: 0, failed: 0 };
        acc[record.object_type][record.status]++;
        return acc;
      }, {} as Record<string, Record<string, number>>) || {};

      for (const objectType of objectTypes || []) {
        const actualCounts = recordCounts[objectType.name] || { extracted: 0, migrated: 0, failed: 0 };
        const expectedProcessed = objectType.processed_records || 0;
        const expectedFailed = objectType.failed_records || 0;

        if (actualCounts.migrated !== expectedProcessed) {
          issues.push(`${objectType.name}: Migrated count mismatch (actual: ${actualCounts.migrated}, expected: ${expectedProcessed})`);
        }

        if (actualCounts.failed !== expectedFailed) {
          issues.push(`${objectType.name}: Failed count mismatch (actual: ${actualCounts.failed}, expected: ${expectedFailed})`);
        }
      }

      // Check for stale statuses
      const staleStatuses = ['extracting', 'migrating'];
      for (const objectType of objectTypes || []) {
        if (staleStatuses.includes(objectType.status)) {
          issues.push(`${objectType.name}: Stuck in ${objectType.status} status`);
          recommendations.push(`Consider resetting ${objectType.name} status to extracted for retry`);
        }
      }

      return {
        isConsistent: issues.length === 0,
        issues,
        recommendations
      };
    } catch (error) {
      console.error('Recovery state validation failed:', error);
      return {
        isConsistent: false,
        issues: ['Failed to validate recovery state due to database error'],
        recommendations: ['Check database connectivity and permissions']
      };
    }
  }
}