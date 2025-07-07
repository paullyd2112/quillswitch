import { supabase } from "@/integrations/supabase/client";
import { MigrationProject, MigrationStage, MigrationObjectType } from "@/integrations/supabase/migrationTypes";
import { toast } from "sonner";
import { updateMigrationProject } from "./projectService";
import { updateMigrationStage } from "./stageService";
import { updateMigrationObjectType } from "./objectTypeService";
import { logUserActivity } from "./activityService";
import { createNotification } from "./notificationService";

export interface MigrationExecutionConfig {
  projectId: string;
  batchSize?: number;
  concurrency?: number;
  validateFirst?: boolean;
  dryRun?: boolean;
}

export interface MigrationProgress {
  stage: string;
  currentObject: string;
  totalRecords: number;
  processedRecords: number;
  failedRecords: number;
  percentage: number;
  throughputPerSecond: number;
  estimatedTimeRemaining: number;
}

export class MigrationExecutionEngine {
  private config: MigrationExecutionConfig;
  private isRunning = false;
  private shouldStop = false;
  private progressCallback?: (progress: MigrationProgress) => void;

  constructor(config: MigrationExecutionConfig) {
    this.config = config;
  }

  onProgress(callback: (progress: MigrationProgress) => void) {
    this.progressCallback = callback;
  }

  async startMigration(): Promise<boolean> {
    if (this.isRunning) {
      toast.error("Migration is already running");
      return false;
    }

    try {
      this.isRunning = true;
      this.shouldStop = false;

      // Update project status
      await updateMigrationProject(this.config.projectId, { status: 'in_progress' });
      
      // Log migration start
      await logUserActivity({
        project_id: this.config.projectId,
        activity_type: 'migration_started',
        activity_description: 'Migration execution started',
        activity_details: { config: this.config }
      });

      // Create notification
      await createNotification(
        this.config.projectId,
        'Migration Started',
        'Your migration is now running. You can monitor progress in real-time.',
        'migration_started'
      );

      // Get project stages and object types
      const stages = await this.getProjectStages();
      const objectTypes = await this.getProjectObjectTypes();

      // Execute migration stages
      for (const stage of stages) {
        if (this.shouldStop) break;
        
        await this.executeStage(stage, objectTypes);
      }

      // Complete migration
      if (!this.shouldStop) {
        await this.completeMigration();
      }

      return true;
    } catch (error) {
      console.error("Migration execution failed:", error);
      await this.handleMigrationError(error);
      return false;
    } finally {
      this.isRunning = false;
    }
  }

  async pauseMigration(): Promise<void> {
    if (!this.isRunning) {
      toast.error("No migration is currently running");
      return;
    }

    this.shouldStop = true;
    await updateMigrationProject(this.config.projectId, { status: 'paused' });
    
    await logUserActivity({
      project_id: this.config.projectId,
      activity_type: 'migration_paused',
      activity_description: 'Migration execution paused',
      activity_details: {}
    });

    toast.success("Migration paused successfully");
  }

  async resumeMigration(): Promise<void> {
    const { data: project } = await supabase
      .from('migration_projects')
      .select('*')
      .eq('id', this.config.projectId)
      .single();

    if (project?.status !== 'paused') {
      toast.error("Migration is not in paused state");
      return;
    }

    await this.startMigration();
  }

  private async getProjectStages(): Promise<MigrationStage[]> {
    const { data: stages, error } = await supabase
      .from('migration_stages')
      .select('*')
      .eq('project_id', this.config.projectId)
      .order('sequence_order');

    if (error) throw error;
    return (stages || []) as MigrationStage[];
  }

  private async getProjectObjectTypes(): Promise<MigrationObjectType[]> {
    const { data: objectTypes, error } = await supabase
      .from('migration_object_types')
      .select('*')
      .eq('project_id', this.config.projectId);

    if (error) throw error;
    return (objectTypes || []) as MigrationObjectType[];
  }

  private async executeStage(stage: MigrationStage, objectTypes: MigrationObjectType[]): Promise<void> {
    // Update stage status
    await updateMigrationStage(stage.id, {
      status: 'in_progress',
      started_at: new Date().toISOString(),
      percentage_complete: 0
    });

    // Log stage start
    await logUserActivity({
      project_id: this.config.projectId,
      activity_type: 'stage_started',
      activity_description: `Started ${stage.name}`,
      activity_details: { stage: stage.name }
    });

    try {
      switch (stage.name) {
        case 'Data Extraction':
          await this.executeDataExtraction(stage, objectTypes);
          break;
        case 'Data Mapping':
          await this.executeDataMapping(stage, objectTypes);
          break;
        case 'Data Transformation':
          await this.executeDataTransformation(stage, objectTypes);
          break;
        case 'Data Validation':
          await this.executeDataValidation(stage, objectTypes);
          break;
        case 'Data Import':
          await this.executeDataImport(stage, objectTypes);
          break;
        case 'Verification':
          await this.executeVerification(stage, objectTypes);
          break;
        default:
          throw new Error(`Unknown stage: ${stage.name}`);
      }

      // Complete stage
      await updateMigrationStage(stage.id, {
        status: 'completed',
        completed_at: new Date().toISOString(),
        percentage_complete: 100
      });

      await logUserActivity({
        project_id: this.config.projectId,
        activity_type: 'stage_completed',
        activity_description: `Completed ${stage.name}`,
        activity_details: { stage: stage.name }
      });

    } catch (error) {
      await updateMigrationStage(stage.id, {
        status: 'failed'
      });
      throw error;
    }
  }

  private async executeDataExtraction(stage: MigrationStage, objectTypes: MigrationObjectType[]): Promise<void> {
    const totalObjects = objectTypes.length;
    let processedObjects = 0;

    for (const objectType of objectTypes) {
      if (this.shouldStop) break;

      await updateMigrationObjectType(objectType.id, { status: 'in_progress' });

      // Simulate data extraction
      const totalRecords = Math.floor(Math.random() * 1000) + 100;
      let processedRecords = 0;

      await updateMigrationObjectType(objectType.id, { total_records: totalRecords });

      // Process in batches
      const batchSize = this.config.batchSize || 50;
      while (processedRecords < totalRecords && !this.shouldStop) {
        const batchEnd = Math.min(processedRecords + batchSize, totalRecords);
        
        // Simulate processing
        await new Promise(resolve => setTimeout(resolve, 100));
        
        processedRecords = batchEnd;
        await updateMigrationObjectType(objectType.id, { processed_records: processedRecords });

        // Update progress
        const progress: MigrationProgress = {
          stage: stage.name,
          currentObject: objectType.name,
          totalRecords,
          processedRecords,
          failedRecords: 0,
          percentage: (processedRecords / totalRecords) * 100,
          throughputPerSecond: 10,
          estimatedTimeRemaining: Math.ceil((totalRecords - processedRecords) / 10)
        };

        this.progressCallback?.(progress);
      }

      await updateMigrationObjectType(objectType.id, { status: 'completed' });
      processedObjects++;

      // Update stage progress
      await updateMigrationStage(stage.id, {
        percentage_complete: (processedObjects / totalObjects) * 100
      });
    }
  }

  private async executeDataMapping(stage: MigrationStage, objectTypes: MigrationObjectType[]): Promise<void> {
    // Simulate data mapping process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    await logUserActivity({
      project_id: this.config.projectId,
      activity_type: 'mapping_completed',
      activity_description: 'Field mappings created and validated',
      activity_details: { objectTypes: objectTypes.length }
    });
  }

  private async executeDataTransformation(stage: MigrationStage, objectTypes: MigrationObjectType[]): Promise<void> {
    // Simulate data transformation
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    await logUserActivity({
      project_id: this.config.projectId,
      activity_type: 'transformation_completed',
      activity_description: 'Data transformation completed',
      activity_details: { objectTypes: objectTypes.length }
    });
  }

  private async executeDataValidation(stage: MigrationStage, objectTypes: MigrationObjectType[]): Promise<void> {
    // Simulate validation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    await logUserActivity({
      project_id: this.config.projectId,
      activity_type: 'validation_completed',
      activity_description: 'Data validation completed',
      activity_details: { objectTypes: objectTypes.length }
    });
  }

  private async executeDataImport(stage: MigrationStage, objectTypes: MigrationObjectType[]): Promise<void> {
    // Simulate data import
    for (const objectType of objectTypes) {
      if (this.shouldStop) break;
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      await logUserActivity({
        project_id: this.config.projectId,
        activity_type: 'import_progress',
        activity_description: `Imported ${objectType.name}`,
        activity_details: { objectType: objectType.name }
      });
    }
  }

  private async executeVerification(stage: MigrationStage, objectTypes: MigrationObjectType[]): Promise<void> {
    // Simulate verification
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    await logUserActivity({
      project_id: this.config.projectId,
      activity_type: 'verification_completed',
      activity_description: 'Migration verification completed',
      activity_details: { objectTypes: objectTypes.length }
    });
  }

  private async completeMigration(): Promise<void> {
    await updateMigrationProject(this.config.projectId, {
      status: 'completed',
      completed_at: new Date().toISOString()
    });

    await createNotification(
      this.config.projectId,
      'Migration Completed',
      'Your migration has been completed successfully!',
      'migration_completed'
    );

    await logUserActivity({
      project_id: this.config.projectId,
      activity_type: 'migration_completed',
      activity_description: 'Migration completed successfully',
      activity_details: {}
    });

    toast.success("Migration completed successfully!");
  }

  private async handleMigrationError(error: any): Promise<void> {
    await updateMigrationProject(this.config.projectId, { status: 'failed' });
    
    await logUserActivity({
      project_id: this.config.projectId,
      activity_type: 'migration_failed',
      activity_description: 'Migration failed',
      activity_details: { error: error.message }
    });

    await createNotification(
      this.config.projectId,
      'Migration Failed',
      `Migration failed: ${error.message}`,
      'error_occurred'
    );

    toast.error(`Migration failed: ${error.message}`);
  }
}

// Factory function to create execution engine
export function createMigrationEngine(config: MigrationExecutionConfig): MigrationExecutionEngine {
  return new MigrationExecutionEngine(config);
}

// Hook for starting migrations from setup wizard
export async function startMigrationFromSetup(projectId: string): Promise<boolean> {
  const engine = createMigrationEngine({
    projectId,
    batchSize: 100,
    concurrency: 3,
    validateFirst: true,
    dryRun: false
  });

  return await engine.startMigration();
}