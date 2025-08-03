export interface CleansingJob {
  id: string;
  user_id: string;
  migration_project_id?: string;
  source_data: any;
  target_data?: any;
  total_records: number;
  processed_records: number;
  duplicates_found: number;
  confidence_threshold: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

export interface DuplicateMatch {
  id: string;
  cleansing_job_id: string;
  source_record_id: string;
  target_record_id?: string;
  source_record_data: any;
  target_record_data?: any;
  confidence_score: number;
  match_type: 'exact' | 'fuzzy' | 'phonetic' | 'semantic';
  conflict_fields: string[];
  suggested_action: 'merge' | 'overwrite' | 'keep_both' | 'skip';
  user_action?: 'approved' | 'rejected' | 'modified';
  reconciliation_strategy: any;
  created_at: string;
  updated_at: string;
}

export interface CleansingRule {
  id: string;
  user_id: string;
  rule_name: string;
  rule_type: 'matching_threshold' | 'field_priority' | 'auto_action' | 'custom_logic';
  conditions: any;
  actions: any;
  priority: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CleansingReport {
  id: string;
  cleansing_job_id: string;
  report_type: 'summary' | 'detailed' | 'conflicts';
  report_data: any;
  created_at: string;
}

export interface CleansingResult {
  success: boolean;
  jobId: string;
  summary: {
    totalRecords: number;
    duplicatesFound: number;
    highConfidenceMatches: number;
    mediumConfidenceMatches: number;
    exactMatches: number;
    fuzzyMatches: number;
    phoneticMatches: number;
    semanticMatches: number;
  };
  matches: DuplicateMatch[];
}