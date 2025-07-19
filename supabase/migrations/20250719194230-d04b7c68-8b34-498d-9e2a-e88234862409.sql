-- Fix performance issues: Add missing indexes for foreign keys (corrected version)
-- This will significantly improve query performance for joins and lookups

-- Add indexes for foreign key constraints to improve join performance
CREATE INDEX IF NOT EXISTS idx_audit_log_user_id ON public.audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_custom_validation_rules_workspace_id ON public.custom_validation_rules(workspace_id);
CREATE INDEX IF NOT EXISTS idx_custom_validation_rules_user_id ON public.custom_validation_rules(user_id);
CREATE INDEX IF NOT EXISTS idx_demo_access_control_user_id ON public.demo_access_control(user_id);
CREATE INDEX IF NOT EXISTS idx_demo_data_session_id ON public.demo_data(session_id);
CREATE INDEX IF NOT EXISTS idx_demo_sessions_user_id ON public.demo_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_demo_sessions_source_connection_id ON public.demo_sessions(source_connection_id);
CREATE INDEX IF NOT EXISTS idx_demo_sessions_destination_connection_id ON public.demo_sessions(destination_connection_id);
CREATE INDEX IF NOT EXISTS idx_document_relationships_document_id ON public.document_relationships(document_id);
CREATE INDEX IF NOT EXISTS idx_field_mappings_extended_object_mapping_id ON public.field_mappings_extended(object_mapping_id);
CREATE INDEX IF NOT EXISTS idx_lookup_mappings_field_mapping_id ON public.lookup_mappings(field_mapping_id);
CREATE INDEX IF NOT EXISTS idx_picklist_value_mappings_field_mapping_id ON public.picklist_value_mappings(field_mapping_id);
CREATE INDEX IF NOT EXISTS idx_migration_stages_project_id ON public.migration_stages(project_id);
CREATE INDEX IF NOT EXISTS idx_integration_jobs_project_id ON public.integration_jobs(project_id);
CREATE INDEX IF NOT EXISTS idx_integration_jobs_object_mapping_id ON public.integration_jobs(object_mapping_id);
CREATE INDEX IF NOT EXISTS idx_object_mappings_project_id ON public.object_mappings(project_id);
CREATE INDEX IF NOT EXISTS idx_workspace_memberships_workspace_id ON public.workspace_memberships(workspace_id);
CREATE INDEX IF NOT EXISTS idx_workspace_memberships_user_id ON public.workspace_memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_migration_schedules_workspace_id ON public.migration_schedules(workspace_id);
CREATE INDEX IF NOT EXISTS idx_migration_schedules_user_id ON public.migration_schedules(user_id);

-- Add composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_credential_access_log_user_id_accessed_at ON public.credential_access_log(user_id, accessed_at);
CREATE INDEX IF NOT EXISTS idx_migration_records_user_id_project_id ON public.migration_records(user_id, project_id);
CREATE INDEX IF NOT EXISTS idx_user_activities_user_id_project_id ON public.user_activities(user_id, project_id);
CREATE INDEX IF NOT EXISTS idx_validation_issues_job_id_error_type ON public.validation_issues(job_id, error_type);

-- Add regular indexes for commonly filtered columns (without time-based predicates)
CREATE INDEX IF NOT EXISTS idx_service_credentials_expires_at ON public.service_credentials(expires_at) WHERE expires_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_migration_projects_status ON public.migration_projects(status);
CREATE INDEX IF NOT EXISTS idx_demo_sessions_processing_status ON public.demo_sessions(processing_status);