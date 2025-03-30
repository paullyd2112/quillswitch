
export type MigrationProject = {
  id: string;
  user_id: string;
  company_name: string;
  source_crm: string;
  destination_crm: string;
  migration_strategy: string;
  status: "pending" | "in_progress" | "completed" | "failed" | "paused";
  created_at: string;
  updated_at: string;
  completed_at: string | null;
  total_objects: number;
  migrated_objects: number;
  failed_objects: number;
};

export type MigrationStage = {
  id: string;
  project_id: string;
  name: string;
  description: string | null;
  status: "pending" | "in_progress" | "completed" | "failed" | "paused";
  sequence_order: number;
  started_at: string | null;
  completed_at: string | null;
  percentage_complete: number;
};

export type MigrationObjectType = {
  id: string;
  project_id: string;
  name: string;
  description: string | null;
  total_records: number;
  processed_records: number;
  failed_records: number;
  status: "pending" | "in_progress" | "completed" | "failed";
};

export type FieldMapping = {
  id: string;
  project_id: string;
  object_type_id: string;
  source_field: string;
  destination_field: string;
  transformation_rule: string | null;
  is_required: boolean;
};

export type MigrationError = {
  id: string;
  project_id: string;
  object_type_id: string;
  record_id: string | null;
  error_type: string;
  error_message: string;
  error_details: any | null;
  created_at: string;
  resolved: boolean;
  resolution_notes: string | null;
};

export type UserActivity = {
  id: string;
  project_id: string;
  user_id: string;
  activity_type: string;
  activity_description: string;
  activity_details: any | null;
  created_at: string;
};

export type ValidationReport = {
  id: string;
  project_id: string;
  object_type_id: string;
  report_type: string;
  report_data: any;
  created_at: string;
  valid_records: number;
  invalid_records: number;
};

export type MigrationNotification = {
  id: string;
  project_id: string;
  user_id: string;
  title: string;
  message: string;
  notification_type: string;
  is_read: boolean;
  created_at: string;
};
