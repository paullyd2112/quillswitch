import { supabase } from "@/integrations/supabase/client";
import { SyncProject, SyncMap, SyncConflict, SyncRecord, ConflictResolutionResult } from "./types";
import { SalesforceClient } from "@/services/salesforce/client";

export class QuillSyncEngine {
  private projectId: string;
  private project: SyncProject | null = null;
  private syncMaps: SyncMap[] = [];

  constructor(projectId: string) {
    this.projectId = projectId;
  }

  async initialize(): Promise<void> {
    // Load project configuration
    const { data: project, error: projectError } = await supabase
      .from('sync_projects')
      .select('*')
      .eq('id', this.projectId)
      .single();

    if (projectError || !project) {
      throw new Error('Failed to load sync project configuration');
    }

    this.project = project as SyncProject;

    // Load sync mappings
    const { data: maps, error: mapsError } = await supabase
      .from('sync_maps')
      .select('*')
      .eq('sync_project_id', this.projectId);

    if (mapsError) {
      throw new Error('Failed to load sync mappings');
    }

    this.syncMaps = (maps || []) as SyncMap[];
  }

  async runSyncCycle(): Promise<void> {
    if (!this.project) {
      throw new Error('Sync engine not initialized');
    }

    console.log(`Starting sync cycle for project: ${this.project.project_name}`);

    try {
      // Update project status to active
      await this.updateProjectStatus('active');

      // Process each sync mapping
      for (const syncMap of this.syncMaps) {
        await this.processSyncMap(syncMap);
      }

      // Update last sync run time
      await this.updateLastSyncRun();
      
      console.log('Sync cycle completed successfully');
    } catch (error) {
      console.error('Sync cycle failed:', error);
      await this.updateProjectStatus('error');
      throw error;
    }
  }

  private async processSyncMap(syncMap: SyncMap): Promise<void> {
    if (!this.project) return;

    console.log(`Processing sync map: ${syncMap.source_object} -> ${syncMap.destination_object}`);

    // Get source and destination records
    const sourceRecords = await this.getRecordsFromCRM(
      this.project.source_crm_id, 
      syncMap.source_object
    );
    
    const destinationRecords = await this.getRecordsFromCRM(
      this.project.destination_crm_id, 
      syncMap.destination_object
    );

    // Detect conflicts and apply resolution
    await this.detectAndResolveConflicts(syncMap, sourceRecords, destinationRecords);
  }

  private async getRecordsFromCRM(credentialId: string, objectType: string): Promise<SyncRecord[]> {
    // Get CRM credentials
    const { data: credential } = await supabase.rpc(
      'get_decrypted_credential_with_logging',
      { p_credential_id: credentialId }
    );

    if (!credential || credential.length === 0) {
      throw new Error('Failed to retrieve CRM credentials');
    }

    const crmData = credential[0];
    
    // For now, only handle Salesforce
    if (crmData.service_name === 'salesforce') {
      return this.getSalesforceRecords(crmData, objectType);
    }

    throw new Error(`Unsupported CRM: ${crmData.service_name}`);
  }

  private async getSalesforceRecords(credential: any, objectType: string): Promise<SyncRecord[]> {
    // Parse Salesforce credentials
    const salesforceCredentials = JSON.parse(credential.credential_value);
    const client = new SalesforceClient(salesforceCredentials);

    let records: any[] = [];

    // Get records based on object type
    switch (objectType.toLowerCase()) {
      case 'contact':
        records = await client.getContacts();
        break;
      case 'account':
        records = await client.getAccounts();
        break;
      case 'opportunity':
        records = await client.getOpportunities();
        break;
      default:
        throw new Error(`Unsupported object type: ${objectType}`);
    }

    // Transform to SyncRecord format
    return records.map(record => ({
      id: record.Id,
      external_id: record.Id,
      object_type: objectType,
      data: record,
      updated_at: record.LastModifiedDate || record.CreatedDate,
      source_system: 'salesforce'
    }));
  }

  private async detectAndResolveConflicts(
    syncMap: SyncMap,
    sourceRecords: SyncRecord[],
    destinationRecords: SyncRecord[]
  ): Promise<void> {
    console.log(`Detecting conflicts for ${syncMap.source_object} <-> ${syncMap.destination_object}`);

    // Create lookup maps by external ID
    const sourceMap = new Map(sourceRecords.map(r => [r.external_id, r]));
    const destinationMap = new Map(destinationRecords.map(r => [r.external_id, r]));

    // Check for conflicts since last sync
    const lastSyncTime = this.project?.last_sync_run || new Date(0).toISOString();

    for (const [recordId, sourceRecord] of sourceMap) {
      const destinationRecord = destinationMap.get(recordId);

      if (!destinationRecord) {
        // Record only exists in source - create in destination
        console.log(`Record ${recordId} only in source, will create in destination`);
        continue;
      }

      // Check if both records were modified since last sync
      const sourceModified = new Date(sourceRecord.updated_at) > new Date(lastSyncTime);
      const destinationModified = new Date(destinationRecord.updated_at) > new Date(lastSyncTime);

      if (sourceModified && destinationModified) {
        // Conflict detected!
        console.log(`Conflict detected for record ${recordId}`);
        await this.handleConflict(syncMap, sourceRecord, destinationRecord);
      } else if (sourceModified && !destinationModified) {
        // Source is newer - update destination
        console.log(`Source is newer for record ${recordId}, updating destination`);
      } else if (!sourceModified && destinationModified) {
        // Destination is newer - update source (if bidirectional)
        if (syncMap.sync_direction === 'bidirectional') {
          console.log(`Destination is newer for record ${recordId}, updating source`);
        }
      }
    }
  }

  private async handleConflict(
    syncMap: SyncMap,
    sourceRecord: SyncRecord,
    destinationRecord: SyncRecord
  ): Promise<void> {
    if (!this.project) return;

    // Apply conflict resolution rule
    const resolution = this.resolveConflict(sourceRecord, destinationRecord);

    // Log the conflict
    const { error: conflictError } = await supabase
      .from('sync_conflicts')
      .insert({
        sync_project_id: this.project.id,
        record_id: sourceRecord.external_id,
        conflict_details: {
          source_record: sourceRecord.data,
          destination_record: destinationRecord.data,
          conflicting_fields: this.getConflictingFields(sourceRecord.data, destinationRecord.data),
          source_updated_at: sourceRecord.updated_at,
          destination_updated_at: destinationRecord.updated_at
        },
        status: resolution.action === 'manual_review' ? 'pending_review' : 'auto_resolved',
        resolution_rule: resolution.resolution_rule
      });

    if (conflictError) {
      console.error('Failed to log conflict:', conflictError);
    }

    console.log(`Conflict resolution for ${sourceRecord.external_id}: ${resolution.action}`);
  }

  private resolveConflict(
    sourceRecord: SyncRecord,
    destinationRecord: SyncRecord
  ): ConflictResolutionResult {
    // Simple "Last Update Wins" rule for now
    const sourceTime = new Date(sourceRecord.updated_at);
    const destinationTime = new Date(destinationRecord.updated_at);

    if (sourceTime > destinationTime) {
      return {
        action: 'update_destination',
        resolved_data: sourceRecord.data,
        winning_system: 'source',
        resolution_rule: 'last_update_wins'
      };
    } else if (destinationTime > sourceTime) {
      return {
        action: 'update_source',
        resolved_data: destinationRecord.data,
        winning_system: 'destination',
        resolution_rule: 'last_update_wins'
      };
    } else {
      // Same timestamp - require manual review
      return {
        action: 'manual_review',
        resolution_rule: 'manual_review'
      };
    }
  }

  private getConflictingFields(sourceData: any, destinationData: any): string[] {
    const conflictingFields: string[] = [];
    
    for (const key in sourceData) {
      if (destinationData.hasOwnProperty(key) && sourceData[key] !== destinationData[key]) {
        conflictingFields.push(key);
      }
    }
    
    return conflictingFields;
  }

  private async updateProjectStatus(status: SyncProject['sync_status']): Promise<void> {
    await supabase
      .from('sync_projects')
      .update({ sync_status: status })
      .eq('id', this.projectId);
  }

  private async updateLastSyncRun(): Promise<void> {
    await supabase
      .from('sync_projects')
      .update({ 
        last_sync_run: new Date().toISOString(),
        sync_status: 'paused' // Return to paused after successful sync
      })
      .eq('id', this.projectId);
  }
}