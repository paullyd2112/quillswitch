import { supabase } from '@/integrations/supabase/client';
import { salesforceService } from '@/services/salesforce';
import { createDataTransformer, SourceContact, SourceAccount, SourceOpportunity } from '@/services/salesforce/dataTransform';

export interface MigrationProject {
  id: string;
  source_crm: string;
  destination_crm: string;
  company_name: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  total_objects?: number;
  migrated_objects?: number;
  failed_objects?: number;
}

export interface MigrationProgress {
  currentStage: string;
  overallProgress: number;
  stageProgress: number;
  eta?: string;
  recordsProcessed: number;
  totalRecords: number;
}

export interface MigrationError {
  id: string;
  object_type: string;
  error_message: string;
  record_id?: string;
  resolved: boolean;
}

export class MigrationOrchestrator {
  private projectId: string;
  private sourceCredentialId: string;
  private destinationCredentialId: string;

  constructor(projectId: string, sourceCredentialId: string, destinationCredentialId: string) {
    this.projectId = projectId;
    this.sourceCredentialId = sourceCredentialId;
    this.destinationCredentialId = destinationCredentialId;
  }

  async startMigration(): Promise<{ success: boolean; message: string }> {
    try {
      // Update project status to running
      await this.updateProjectStatus('running');
      
      // Initialize Salesforce connection (destination)
      const salesforceClient = await salesforceService.initializeConnection(this.destinationCredentialId);
      
      // Test Salesforce connection
      const connectionTest = await salesforceClient.testConnection();
      if (!connectionTest.success) {
        throw new Error(`Salesforce connection failed: ${connectionTest.message}`);
      }

      // Create migration stages
      await this.createMigrationStages();
      
      // Start the migration process
      await this.executeMigration();
      
      return { success: true, message: 'Migration started successfully' };
    } catch (error) {
      console.error('Migration start failed:', error);
      await this.updateProjectStatus('failed');
      
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  private async executeMigration(): Promise<void> {
    const transformer = createDataTransformer();
    
    try {
      // Stage 1: Migrate Accounts
      await this.updateStageStatus('Migrating Accounts', 0);
      const accounts = await this.extractAccountsFromSource();
      const transformedAccounts = transformer.transformAccounts(accounts);
      const { valid: validAccounts, invalid: invalidAccounts } = transformer.validateAccounts(transformedAccounts);
      
      if (invalidAccounts.length > 0) {
        await this.logValidationErrors('Account', invalidAccounts);
      }
      
      const salesforceClient = salesforceService.getClient();
      await salesforceClient.createAccounts(validAccounts);
      await this.updateStageStatus('Migrating Accounts', 100);

      // Stage 2: Migrate Contacts
      await this.updateStageStatus('Migrating Contacts', 0);
      const contacts = await this.extractContactsFromSource();
      const transformedContacts = transformer.transformContacts(contacts);
      const { valid: validContacts, invalid: invalidContacts } = transformer.validateContacts(transformedContacts);
      
      if (invalidContacts.length > 0) {
        await this.logValidationErrors('Contact', invalidContacts);
      }
      
      await salesforceClient.createContacts(validContacts);
      await this.updateStageStatus('Migrating Contacts', 100);

      // Stage 3: Migrate Opportunities
      await this.updateStageStatus('Migrating Opportunities', 0);
      const opportunities = await this.extractOpportunitiesFromSource();
      const transformedOpportunities = transformer.transformOpportunities(opportunities);
      const { valid: validOpportunities, invalid: invalidOpportunities } = transformer.validateOpportunities(transformedOpportunities);
      
      if (invalidOpportunities.length > 0) {
        await this.logValidationErrors('Opportunity', invalidOpportunities);
      }
      
      await salesforceClient.createOpportunities(validOpportunities);
      await this.updateStageStatus('Migrating Opportunities', 100);

      // Complete migration
      await this.updateProjectStatus('completed');
      
    } catch (error) {
      console.error('Migration execution failed:', error);
      await this.updateProjectStatus('failed');
      throw error;
    }
  }

  private async extractAccountsFromSource(): Promise<SourceAccount[]> {
    // This would be implemented based on the source CRM
    // For now, return empty array - this would be extended to support different source CRMs
    return [];
  }

  private async extractContactsFromSource(): Promise<SourceContact[]> {
    // This would be implemented based on the source CRM
    // For now, return empty array - this would be extended to support different source CRMs
    return [];
  }

  private async extractOpportunitiesFromSource(): Promise<SourceOpportunity[]> {
    // This would be implemented based on the source CRM
    // For now, return empty array - this would be extended to support different source CRMs
    return [];
  }

  private async createMigrationStages(): Promise<void> {
    const stages = [
      { name: 'Migrating Accounts', sequence_order: 1, description: 'Migrating company and organization records' },
      { name: 'Migrating Contacts', sequence_order: 2, description: 'Migrating contact and lead records' },
      { name: 'Migrating Opportunities', sequence_order: 3, description: 'Migrating deals and opportunities' }
    ];

    for (const stage of stages) {
      await supabase
        .from('migration_stages')
        .insert({
          project_id: this.projectId,
          ...stage,
          status: 'pending'
        });
    }
  }

  private async updateProjectStatus(status: string): Promise<void> {
    const updates: any = { status };
    
    if (status === 'completed') {
      updates.completed_at = new Date().toISOString();
    }

    await supabase
      .from('migration_projects')
      .update(updates)
      .eq('id', this.projectId);
  }

  private async updateStageStatus(stageName: string, progress: number): Promise<void> {
    const updates: any = {
      percentage_complete: progress
    };

    if (progress === 0) {
      updates.started_at = new Date().toISOString();
      updates.status = 'running';
    } else if (progress === 100) {
      updates.completed_at = new Date().toISOString();
      updates.status = 'completed';
    }

    await supabase
      .from('migration_stages')
      .update(updates)
      .eq('project_id', this.projectId)
      .eq('name', stageName);
  }

  private async logValidationErrors(objectType: string, errors: Array<{ errors: string[] }>): Promise<void> {
    for (const errorItem of errors) {
      for (const error of errorItem.errors) {
        await supabase
          .from('migration_errors')
          .insert({
            project_id: this.projectId,
            object_type_id: objectType, // This would need to be mapped to actual object type IDs
            error_type: 'validation',
            error_message: error,
            resolved: false
          });
      }
    }
  }

  async getProgress(): Promise<MigrationProgress> {
    try {
      const { data: stages } = await supabase
        .from('migration_stages')
        .select('*')
        .eq('project_id', this.projectId)
        .order('sequence_order');

      if (!stages || stages.length === 0) {
        return {
          currentStage: 'Preparing',
          overallProgress: 0,
          stageProgress: 0,
          recordsProcessed: 0,
          totalRecords: 0
        };
      }

      const completedStages = stages.filter(s => s.status === 'completed').length;
      const currentStage = stages.find(s => s.status === 'running') || stages.find(s => s.status === 'pending');
      const overallProgress = (completedStages / stages.length) * 100;

      return {
        currentStage: currentStage?.name || 'Completed',
        overallProgress,
        stageProgress: currentStage?.percentage_complete || 0,
        recordsProcessed: 0, // Would be calculated from actual migration data
        totalRecords: 0 // Would be calculated from actual migration data
      };
    } catch (error) {
      console.error('Failed to get migration progress:', error);
      throw error;
    }
  }

  async getErrors(): Promise<MigrationError[]> {
    try {
      const { data: errors } = await supabase
        .from('migration_errors')
        .select('id, object_type_id, error_message, record_id, resolved')
        .eq('project_id', this.projectId)
        .order('created_at', { ascending: false });

      return (errors || []).map(error => ({
        id: error.id,
        object_type: error.object_type_id,
        error_message: error.error_message,
        record_id: error.record_id,
        resolved: error.resolved
      }));
    } catch (error) {
      console.error('Failed to get migration errors:', error);
      return [];
    }
  }
}

// Factory function for creating migration orchestrators
export const createMigrationOrchestrator = (
  projectId: string,
  sourceCredentialId: string,
  destinationCredentialId: string
) => {
  return new MigrationOrchestrator(projectId, sourceCredentialId, destinationCredentialId);
};