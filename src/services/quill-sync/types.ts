export interface SyncProject {
  id: string;
  user_id: string;
  project_name: string;
  source_crm_id: string;
  destination_crm_id: string;
  sync_status: 'active' | 'paused' | 'error' | 'initializing';
  last_sync_run?: string;
  sync_settings: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface SyncMap {
  id: string;
  sync_project_id: string;
  source_object: string;
  destination_object: string;
  field_map: Record<string, string>;
  sync_direction: 'source_to_destination' | 'destination_to_source' | 'bidirectional';
  created_at: string;
  updated_at: string;
}

export interface SyncConflict {
  id: string;
  sync_project_id: string;
  record_id: string;
  conflict_details: {
    source_record: any;
    destination_record: any;
    conflicting_fields: string[];
    source_updated_at: string;
    destination_updated_at: string;
  };
  status: 'pending_review' | 'auto_resolved' | 'manual_resolved' | 'ignored';
  resolution_rule?: 'last_update_wins' | 'manual_review' | 'source_wins' | 'destination_wins';
  created_at: string;
  resolved_at?: string;
  resolved_by?: string;
}

export interface SyncRecord {
  id: string;
  external_id: string;
  object_type: string;
  data: Record<string, any>;
  updated_at: string;
  source_system: string;
}

export interface ConflictResolutionResult {
  action: 'update_source' | 'update_destination' | 'no_action' | 'manual_review';
  resolved_data?: Record<string, any>;
  winning_system?: 'source' | 'destination';
  resolution_rule: string;
}