export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      audit_log: {
        Row: {
          action: string
          context_json: Json | null
          created_at: string
          id: string
          ip_address: unknown | null
          new_values: Json | null
          old_values: Json | null
          record_id: string | null
          table_name: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          context_json?: Json | null
          created_at?: string
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          context_json?: Json | null
          created_at?: string
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      cleansing_jobs: {
        Row: {
          completed_at: string | null
          confidence_threshold: number
          created_at: string
          duplicates_found: number
          id: string
          migration_project_id: string | null
          processed_records: number
          source_data: Json
          status: string
          target_data: Json | null
          total_records: number
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          confidence_threshold?: number
          created_at?: string
          duplicates_found?: number
          id?: string
          migration_project_id?: string | null
          processed_records?: number
          source_data: Json
          status?: string
          target_data?: Json | null
          total_records?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          confidence_threshold?: number
          created_at?: string
          duplicates_found?: number
          id?: string
          migration_project_id?: string | null
          processed_records?: number
          source_data?: Json
          status?: string
          target_data?: Json | null
          total_records?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cleansing_jobs_migration_project_id_fkey"
            columns: ["migration_project_id"]
            isOneToOne: false
            referencedRelation: "migration_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      cleansing_reports: {
        Row: {
          cleansing_job_id: string
          created_at: string
          id: string
          report_data: Json
          report_type: string
        }
        Insert: {
          cleansing_job_id: string
          created_at?: string
          id?: string
          report_data: Json
          report_type: string
        }
        Update: {
          cleansing_job_id?: string
          created_at?: string
          id?: string
          report_data?: Json
          report_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "cleansing_reports_cleansing_job_id_fkey"
            columns: ["cleansing_job_id"]
            isOneToOne: false
            referencedRelation: "cleansing_jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      cleansing_rules: {
        Row: {
          actions: Json
          conditions: Json
          created_at: string
          id: string
          is_active: boolean
          priority: number
          rule_name: string
          rule_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          actions: Json
          conditions: Json
          created_at?: string
          id?: string
          is_active?: boolean
          priority?: number
          rule_name: string
          rule_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          actions?: Json
          conditions?: Json
          created_at?: string
          id?: string
          is_active?: boolean
          priority?: number
          rule_name?: string
          rule_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      credential_access_log: {
        Row: {
          accessed_at: string | null
          action: string
          credential_id: string | null
          id: number
          ip_address: unknown | null
          metadata: Json | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          accessed_at?: string | null
          action?: string
          credential_id?: string | null
          id?: number
          ip_address?: unknown | null
          metadata?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          accessed_at?: string | null
          action?: string
          credential_id?: string | null
          id?: number
          ip_address?: unknown | null
          metadata?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "credential_access_log_credential_id_fkey"
            columns: ["credential_id"]
            isOneToOne: false
            referencedRelation: "service_credentials"
            referencedColumns: ["id"]
          },
        ]
      }
      custom_validation_rules: {
        Row: {
          created_at: string
          description: string | null
          error_message: string
          field_type: string
          id: string
          is_active: boolean | null
          name: string
          rule_config: Json
          updated_at: string
          user_id: string
          validation_type: string
          workspace_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          error_message: string
          field_type: string
          id?: string
          is_active?: boolean | null
          name: string
          rule_config: Json
          updated_at?: string
          user_id: string
          validation_type: string
          workspace_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          error_message?: string
          field_type?: string
          id?: string
          is_active?: boolean | null
          name?: string
          rule_config?: Json
          updated_at?: string
          user_id?: string
          validation_type?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "custom_validation_rules_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      data_loading_jobs: {
        Row: {
          created_at: string
          duplicate_records: number | null
          error_count: number | null
          id: string
          metadata: Json | null
          processed_records: number | null
          source_type: string
          status: string
          total_records: number | null
          updated_at: string
          user_id: string
          validated_records: number | null
        }
        Insert: {
          created_at?: string
          duplicate_records?: number | null
          error_count?: number | null
          id?: string
          metadata?: Json | null
          processed_records?: number | null
          source_type: string
          status?: string
          total_records?: number | null
          updated_at?: string
          user_id: string
          validated_records?: number | null
        }
        Update: {
          created_at?: string
          duplicate_records?: number | null
          error_count?: number | null
          id?: string
          metadata?: Json | null
          processed_records?: number | null
          source_type?: string
          status?: string
          total_records?: number | null
          updated_at?: string
          user_id?: string
          validated_records?: number | null
        }
        Relationships: []
      }
      demo_access_control: {
        Row: {
          access_granted_at: string
          created_at: string
          data_record_limit: number | null
          demo_count: number | null
          demo_type: string
          email_domain: string
          id: string
          is_blocked: boolean | null
          last_demo_at: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          access_granted_at?: string
          created_at?: string
          data_record_limit?: number | null
          demo_count?: number | null
          demo_type?: string
          email_domain: string
          id?: string
          is_blocked?: boolean | null
          last_demo_at?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          access_granted_at?: string
          created_at?: string
          data_record_limit?: number | null
          demo_count?: number | null
          demo_type?: string
          email_domain?: string
          id?: string
          is_blocked?: boolean | null
          last_demo_at?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      demo_completion_leads: {
        Row: {
          company_name: string
          created_at: string
          current_crm: string | null
          demo_session_id: string | null
          email: string
          estimated_records: number | null
          follow_up_scheduled: boolean | null
          id: string
          lead_status: string
          name: string
          pain_points: string | null
          phone: string | null
          target_crm: string | null
          timeline: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          company_name: string
          created_at?: string
          current_crm?: string | null
          demo_session_id?: string | null
          email: string
          estimated_records?: number | null
          follow_up_scheduled?: boolean | null
          id?: string
          lead_status?: string
          name: string
          pain_points?: string | null
          phone?: string | null
          target_crm?: string | null
          timeline?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          company_name?: string
          created_at?: string
          current_crm?: string | null
          demo_session_id?: string | null
          email?: string
          estimated_records?: number | null
          follow_up_scheduled?: boolean | null
          id?: string
          lead_status?: string
          name?: string
          pain_points?: string | null
          phone?: string | null
          target_crm?: string | null
          timeline?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "demo_completion_leads_demo_session_id_fkey"
            columns: ["demo_session_id"]
            isOneToOne: false
            referencedRelation: "demo_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      demo_data: {
        Row: {
          created_at: string
          data: Json
          external_id: string | null
          id: string
          object_type: string
          session_id: string | null
          source_system: string
        }
        Insert: {
          created_at?: string
          data: Json
          external_id?: string | null
          id?: string
          object_type: string
          session_id?: string | null
          source_system: string
        }
        Update: {
          created_at?: string
          data?: Json
          external_id?: string | null
          id?: string
          object_type?: string
          session_id?: string | null
          source_system?: string
        }
        Relationships: [
          {
            foreignKeyName: "demo_data_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "demo_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      demo_sessions: {
        Row: {
          created_at: string
          data_source_type: string
          demo_type: string
          destination_connection_id: string | null
          expires_at: string
          id: string
          processing_status: string | null
          record_count: number | null
          session_data: Json | null
          session_token: string
          source_connection_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          data_source_type: string
          demo_type: string
          destination_connection_id?: string | null
          expires_at?: string
          id?: string
          processing_status?: string | null
          record_count?: number | null
          session_data?: Json | null
          session_token?: string
          source_connection_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          data_source_type?: string
          demo_type?: string
          destination_connection_id?: string | null
          expires_at?: string
          id?: string
          processing_status?: string | null
          record_count?: number | null
          session_data?: Json | null
          session_token?: string
          source_connection_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      document_migration: {
        Row: {
          associated_record_id: string | null
          associated_record_type: string | null
          content_type: string | null
          created_at: string | null
          destination_document_id: string | null
          destination_path: string | null
          error_message: string | null
          file_size: number | null
          id: string
          migration_status: string | null
          original_file_name: string
          project_id: string | null
          retry_count: number | null
          source_document_id: string | null
          source_system: string
          source_url: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          associated_record_id?: string | null
          associated_record_type?: string | null
          content_type?: string | null
          created_at?: string | null
          destination_document_id?: string | null
          destination_path?: string | null
          error_message?: string | null
          file_size?: number | null
          id?: string
          migration_status?: string | null
          original_file_name: string
          project_id?: string | null
          retry_count?: number | null
          source_document_id?: string | null
          source_system: string
          source_url?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          associated_record_id?: string | null
          associated_record_type?: string | null
          content_type?: string | null
          created_at?: string | null
          destination_document_id?: string | null
          destination_path?: string | null
          error_message?: string | null
          file_size?: number | null
          id?: string
          migration_status?: string | null
          original_file_name?: string
          project_id?: string | null
          retry_count?: number | null
          source_document_id?: string | null
          source_system?: string
          source_url?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "document_migration_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "migration_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      document_relationships: {
        Row: {
          created_at: string | null
          document_id: string | null
          id: string
          related_record_id: string
          related_record_type: string
          relationship_type: string
        }
        Insert: {
          created_at?: string | null
          document_id?: string | null
          id?: string
          related_record_id: string
          related_record_type: string
          relationship_type: string
        }
        Update: {
          created_at?: string | null
          document_id?: string | null
          id?: string
          related_record_id?: string
          related_record_type?: string
          relationship_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "document_relationships_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "document_migration"
            referencedColumns: ["id"]
          },
        ]
      }
      duplicate_matches: {
        Row: {
          cleansing_job_id: string
          confidence_score: number
          conflict_fields: Json | null
          created_at: string
          id: string
          match_type: string
          reconciliation_strategy: Json | null
          source_record_data: Json
          source_record_id: string
          suggested_action: string
          target_record_data: Json | null
          target_record_id: string | null
          updated_at: string
          user_action: string | null
        }
        Insert: {
          cleansing_job_id: string
          confidence_score: number
          conflict_fields?: Json | null
          created_at?: string
          id?: string
          match_type: string
          reconciliation_strategy?: Json | null
          source_record_data: Json
          source_record_id: string
          suggested_action: string
          target_record_data?: Json | null
          target_record_id?: string | null
          updated_at?: string
          user_action?: string | null
        }
        Update: {
          cleansing_job_id?: string
          confidence_score?: number
          conflict_fields?: Json | null
          created_at?: string
          id?: string
          match_type?: string
          reconciliation_strategy?: Json | null
          source_record_data?: Json
          source_record_id?: string
          suggested_action?: string
          target_record_data?: Json | null
          target_record_id?: string | null
          updated_at?: string
          user_action?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "duplicate_matches_cleansing_job_id_fkey"
            columns: ["cleansing_job_id"]
            isOneToOne: false
            referencedRelation: "cleansing_jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      encryption_status: {
        Row: {
          created_at: string
          credential_count: number
          encryption_algorithm: string
          id: string
          last_encrypted_at: string
          service_name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          credential_count?: number
          encryption_algorithm?: string
          id?: string
          last_encrypted_at?: string
          service_name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          credential_count?: number
          encryption_algorithm?: string
          id?: string
          last_encrypted_at?: string
          service_name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      field_mappings: {
        Row: {
          destination_field: string
          id: string
          is_required: boolean | null
          object_type_id: string
          project_id: string
          source_field: string
          transformation_rule: string | null
        }
        Insert: {
          destination_field: string
          id?: string
          is_required?: boolean | null
          object_type_id: string
          project_id: string
          source_field: string
          transformation_rule?: string | null
        }
        Update: {
          destination_field?: string
          id?: string
          is_required?: boolean | null
          object_type_id?: string
          project_id?: string
          source_field?: string
          transformation_rule?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "field_mappings_object_type_id_fkey"
            columns: ["object_type_id"]
            isOneToOne: false
            referencedRelation: "migration_object_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "field_mappings_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "migration_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      field_mappings_extended: {
        Row: {
          created_at: string
          data_type: Database["public"]["Enums"]["crm_data_type"]
          destination_field: string
          id: string
          is_primary_key: boolean
          is_required: boolean
          mapping_status: string
          object_mapping_id: string
          source_field: string
          transformation_rule: string | null
          transformation_type: Database["public"]["Enums"]["transformation_type"]
          updated_at: string
          validation_rules: Json | null
        }
        Insert: {
          created_at?: string
          data_type: Database["public"]["Enums"]["crm_data_type"]
          destination_field: string
          id?: string
          is_primary_key?: boolean
          is_required?: boolean
          mapping_status?: string
          object_mapping_id: string
          source_field: string
          transformation_rule?: string | null
          transformation_type?: Database["public"]["Enums"]["transformation_type"]
          updated_at?: string
          validation_rules?: Json | null
        }
        Update: {
          created_at?: string
          data_type?: Database["public"]["Enums"]["crm_data_type"]
          destination_field?: string
          id?: string
          is_primary_key?: boolean
          is_required?: boolean
          mapping_status?: string
          object_mapping_id?: string
          source_field?: string
          transformation_rule?: string | null
          transformation_type?: Database["public"]["Enums"]["transformation_type"]
          updated_at?: string
          validation_rules?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "field_mappings_extended_object_mapping_id_fkey"
            columns: ["object_mapping_id"]
            isOneToOne: false
            referencedRelation: "object_mappings"
            referencedColumns: ["id"]
          },
        ]
      }
      integration_jobs: {
        Row: {
          created_at: string
          id: string
          job_type: string
          object_mapping_id: string | null
          project_id: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          job_type: string
          object_mapping_id?: string | null
          project_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          job_type?: string
          object_mapping_id?: string | null
          project_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "integration_jobs_object_mapping_id_fkey"
            columns: ["object_mapping_id"]
            isOneToOne: false
            referencedRelation: "object_mappings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "integration_jobs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "integration_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      integration_projects: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      login_attempts: {
        Row: {
          attempted_at: string
          email: string
          id: string
          ip_address: unknown | null
          success: boolean
          user_agent: string | null
        }
        Insert: {
          attempted_at?: string
          email: string
          id?: string
          ip_address?: unknown | null
          success?: boolean
          user_agent?: string | null
        }
        Update: {
          attempted_at?: string
          email?: string
          id?: string
          ip_address?: unknown | null
          success?: boolean
          user_agent?: string | null
        }
        Relationships: []
      }
      lookup_mappings: {
        Row: {
          created_at: string
          destination_field: string
          destination_object: string
          fallback_value: string | null
          field_mapping_id: string
          id: string
          lookup_filter: Json | null
          source_field: string
          source_object: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          destination_field: string
          destination_object: string
          fallback_value?: string | null
          field_mapping_id: string
          id?: string
          lookup_filter?: Json | null
          source_field: string
          source_object: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          destination_field?: string
          destination_object?: string
          fallback_value?: string | null
          field_mapping_id?: string
          id?: string
          lookup_filter?: Json | null
          source_field?: string
          source_object?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lookup_mappings_field_mapping_id_fkey"
            columns: ["field_mapping_id"]
            isOneToOne: false
            referencedRelation: "field_mappings_extended"
            referencedColumns: ["id"]
          },
        ]
      }
      migration_errors: {
        Row: {
          created_at: string
          error_details: Json | null
          error_message: string
          error_type: string
          id: string
          object_type_id: string
          project_id: string
          record_id: string | null
          resolution_notes: string | null
          resolved: boolean | null
        }
        Insert: {
          created_at?: string
          error_details?: Json | null
          error_message: string
          error_type: string
          id?: string
          object_type_id: string
          project_id: string
          record_id?: string | null
          resolution_notes?: string | null
          resolved?: boolean | null
        }
        Update: {
          created_at?: string
          error_details?: Json | null
          error_message?: string
          error_type?: string
          id?: string
          object_type_id?: string
          project_id?: string
          record_id?: string | null
          resolution_notes?: string | null
          resolved?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "migration_errors_object_type_id_fkey"
            columns: ["object_type_id"]
            isOneToOne: false
            referencedRelation: "migration_object_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "migration_errors_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "migration_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      migration_notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean | null
          message: string
          notification_type: string
          project_id: string
          title: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message: string
          notification_type: string
          project_id: string
          title: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message?: string
          notification_type?: string
          project_id?: string
          title?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "migration_notifications_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "migration_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      migration_object_types: {
        Row: {
          description: string | null
          failed_records: number | null
          id: string
          name: string
          processed_records: number | null
          project_id: string
          status: string
          total_records: number | null
        }
        Insert: {
          description?: string | null
          failed_records?: number | null
          id?: string
          name: string
          processed_records?: number | null
          project_id: string
          status?: string
          total_records?: number | null
        }
        Update: {
          description?: string | null
          failed_records?: number | null
          id?: string
          name?: string
          processed_records?: number | null
          project_id?: string
          status?: string
          total_records?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "migration_object_types_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "migration_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      migration_projects: {
        Row: {
          company_name: string
          completed_at: string | null
          created_at: string
          destination_crm: string
          failed_objects: number | null
          id: string
          migrated_objects: number | null
          migration_strategy: string
          source_crm: string
          status: string
          total_objects: number | null
          updated_at: string
          user_id: string | null
          workspace_id: string | null
        }
        Insert: {
          company_name: string
          completed_at?: string | null
          created_at?: string
          destination_crm: string
          failed_objects?: number | null
          id?: string
          migrated_objects?: number | null
          migration_strategy: string
          source_crm: string
          status?: string
          total_objects?: number | null
          updated_at?: string
          user_id?: string | null
          workspace_id?: string | null
        }
        Update: {
          company_name?: string
          completed_at?: string | null
          created_at?: string
          destination_crm?: string
          failed_objects?: number | null
          id?: string
          migrated_objects?: number | null
          migration_strategy?: string
          source_crm?: string
          status?: string
          total_objects?: number | null
          updated_at?: string
          user_id?: string | null
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "migration_projects_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      migration_records: {
        Row: {
          created_at: string
          data: Json | null
          destination_system: string
          external_id: string
          id: string
          last_modified: string
          object_type: string
          project_id: string
          source_system: string
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          data?: Json | null
          destination_system: string
          external_id: string
          id?: string
          last_modified?: string
          object_type: string
          project_id: string
          source_system: string
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          data?: Json | null
          destination_system?: string
          external_id?: string
          id?: string
          last_modified?: string
          object_type?: string
          project_id?: string
          source_system?: string
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      migration_roi_reports: {
        Row: {
          created_at: string
          generated_at: string
          id: string
          metrics: Json
          project_id: string
          report_data: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          generated_at?: string
          id?: string
          metrics: Json
          project_id: string
          report_data: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          generated_at?: string
          id?: string
          metrics?: Json
          project_id?: string
          report_data?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "migration_roi_reports_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "migration_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      migration_schedules: {
        Row: {
          created_at: string
          cron_expression: string
          description: string | null
          id: string
          is_active: boolean | null
          last_run_at: string | null
          max_retries: number | null
          migration_config: Json
          name: string
          next_run_at: string | null
          retry_count: number | null
          updated_at: string
          user_id: string
          workspace_id: string
        }
        Insert: {
          created_at?: string
          cron_expression: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          last_run_at?: string | null
          max_retries?: number | null
          migration_config: Json
          name: string
          next_run_at?: string | null
          retry_count?: number | null
          updated_at?: string
          user_id: string
          workspace_id: string
        }
        Update: {
          created_at?: string
          cron_expression?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          last_run_at?: string | null
          max_retries?: number | null
          migration_config?: Json
          name?: string
          next_run_at?: string | null
          retry_count?: number | null
          updated_at?: string
          user_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "migration_schedules_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      migration_stages: {
        Row: {
          completed_at: string | null
          description: string | null
          id: string
          name: string
          percentage_complete: number | null
          project_id: string
          sequence_order: number
          started_at: string | null
          status: string
        }
        Insert: {
          completed_at?: string | null
          description?: string | null
          id?: string
          name: string
          percentage_complete?: number | null
          project_id: string
          sequence_order: number
          started_at?: string | null
          status?: string
        }
        Update: {
          completed_at?: string | null
          description?: string | null
          id?: string
          name?: string
          percentage_complete?: number | null
          project_id?: string
          sequence_order?: number
          started_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "migration_stages_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "migration_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      oauth_state: {
        Row: {
          code_verifier: string
          created_at: string
          expires_at: string
          id: string
          state_key: string
          user_id: string
        }
        Insert: {
          code_verifier: string
          created_at?: string
          expires_at?: string
          id?: string
          state_key: string
          user_id: string
        }
        Update: {
          code_verifier?: string
          created_at?: string
          expires_at?: string
          id?: string
          state_key?: string
          user_id?: string
        }
        Relationships: []
      }
      object_mappings: {
        Row: {
          created_at: string
          destination_object: string
          id: string
          project_id: string
          source_object: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          destination_object: string
          id?: string
          project_id: string
          source_object: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          destination_object?: string
          id?: string
          project_id?: string
          source_object?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "object_mappings_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "integration_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      offline_sync_queue: {
        Row: {
          created_at: string
          data: Json
          id: string
          last_error: string | null
          operation_type: string
          record_id: string | null
          retry_count: number | null
          status: string | null
          synced_at: string | null
          table_name: string
          user_id: string
          workspace_id: string | null
        }
        Insert: {
          created_at?: string
          data: Json
          id?: string
          last_error?: string | null
          operation_type: string
          record_id?: string | null
          retry_count?: number | null
          status?: string | null
          synced_at?: string | null
          table_name: string
          user_id: string
          workspace_id?: string | null
        }
        Update: {
          created_at?: string
          data?: Json
          id?: string
          last_error?: string | null
          operation_type?: string
          record_id?: string | null
          retry_count?: number | null
          status?: string | null
          synced_at?: string | null
          table_name?: string
          user_id?: string
          workspace_id?: string | null
        }
        Relationships: []
      }
      optimization_cache: {
        Row: {
          cache_data: Json
          cache_key: string
          cache_type: string
          created_at: string
          id: string
          object_type: string | null
          project_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          cache_data: Json
          cache_key: string
          cache_type: string
          created_at?: string
          id?: string
          object_type?: string | null
          project_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          cache_data?: Json
          cache_key?: string
          cache_type?: string
          created_at?: string
          id?: string
          object_type?: string | null
          project_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      picklist_value_mappings: {
        Row: {
          created_at: string
          destination_value: string
          field_mapping_id: string
          id: string
          is_default: boolean
          source_value: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          destination_value: string
          field_mapping_id: string
          id?: string
          is_default?: boolean
          source_value: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          destination_value?: string
          field_mapping_id?: string
          id?: string
          is_default?: boolean
          source_value?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "picklist_value_mappings_field_mapping_id_fkey"
            columns: ["field_mapping_id"]
            isOneToOne: false
            referencedRelation: "field_mappings_extended"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          first_name: string | null
          id: string
          last_name: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          first_name?: string | null
          id: string
          last_name?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
      rate_limits: {
        Row: {
          created_at: string
          key: string
          request_count: number
        }
        Insert: {
          created_at?: string
          key: string
          request_count?: number
        }
        Update: {
          created_at?: string
          key?: string
          request_count?: number
        }
        Relationships: []
      }
      service_credentials: {
        Row: {
          created_at: string
          credential_name: string
          credential_type: string
          credential_value: string
          environment: string | null
          expires_at: string | null
          id: string
          last_used: string | null
          metadata: Json | null
          service_name: string
          tags: string[] | null
          updated_at: string
          user_id: string
          workspace_id: string | null
        }
        Insert: {
          created_at?: string
          credential_name: string
          credential_type: string
          credential_value: string
          environment?: string | null
          expires_at?: string | null
          id?: string
          last_used?: string | null
          metadata?: Json | null
          service_name: string
          tags?: string[] | null
          updated_at?: string
          user_id: string
          workspace_id?: string | null
        }
        Update: {
          created_at?: string
          credential_name?: string
          credential_type?: string
          credential_value?: string
          environment?: string | null
          expires_at?: string | null
          id?: string
          last_used?: string | null
          metadata?: Json | null
          service_name?: string
          tags?: string[] | null
          updated_at?: string
          user_id?: string
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_credentials_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      user_activities: {
        Row: {
          activity_description: string
          activity_details: Json | null
          activity_type: string
          created_at: string
          id: string
          project_id: string
          user_id: string | null
        }
        Insert: {
          activity_description: string
          activity_details?: Json | null
          activity_type: string
          created_at?: string
          id?: string
          project_id: string
          user_id?: string | null
        }
        Update: {
          activity_description?: string
          activity_details?: Json | null
          activity_type?: string
          created_at?: string
          id?: string
          project_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_activities_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "migration_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      user_notification_preferences: {
        Row: {
          completions: boolean
          created_at: string
          data_validation: boolean
          email_address: string | null
          email_delivery: boolean
          errors: boolean
          id: string
          in_app_delivery: boolean
          mapping_changes: boolean
          phone_number: string | null
          sms_delivery: boolean
          status_changes: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          completions?: boolean
          created_at?: string
          data_validation?: boolean
          email_address?: string | null
          email_delivery?: boolean
          errors?: boolean
          id?: string
          in_app_delivery?: boolean
          mapping_changes?: boolean
          phone_number?: string | null
          sms_delivery?: boolean
          status_changes?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          completions?: boolean
          created_at?: string
          data_validation?: boolean
          email_address?: string | null
          email_delivery?: boolean
          errors?: boolean
          id?: string
          in_app_delivery?: boolean
          mapping_changes?: boolean
          phone_number?: string | null
          sms_delivery?: boolean
          status_changes?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_security_settings: {
        Row: {
          backup_codes: string[] | null
          created_at: string
          id: string
          last_totp_used_at: string | null
          totp_secret: string | null
          two_factor_enabled: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          backup_codes?: string[] | null
          created_at?: string
          id?: string
          last_totp_used_at?: string | null
          totp_secret?: string | null
          two_factor_enabled?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          backup_codes?: string[] | null
          created_at?: string
          id?: string
          last_totp_used_at?: string | null
          totp_secret?: string | null
          two_factor_enabled?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      validation_issues: {
        Row: {
          created_at: string
          error_message: string
          error_type: string
          field_name: string
          id: string
          job_id: string
          raw_value: string | null
          record_index: number
          suggestion: string | null
        }
        Insert: {
          created_at?: string
          error_message: string
          error_type: string
          field_name: string
          id?: string
          job_id: string
          raw_value?: string | null
          record_index: number
          suggestion?: string | null
        }
        Update: {
          created_at?: string
          error_message?: string
          error_type?: string
          field_name?: string
          id?: string
          job_id?: string
          raw_value?: string | null
          record_index?: number
          suggestion?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "validation_issues_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "data_loading_jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      validation_reports: {
        Row: {
          created_at: string
          id: string
          invalid_records: number | null
          object_type_id: string
          project_id: string
          report_data: Json
          report_type: string
          valid_records: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          invalid_records?: number | null
          object_type_id: string
          project_id: string
          report_data: Json
          report_type: string
          valid_records?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          invalid_records?: number | null
          object_type_id?: string
          project_id?: string
          report_data?: Json
          report_type?: string
          valid_records?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "validation_reports_object_type_id_fkey"
            columns: ["object_type_id"]
            isOneToOne: false
            referencedRelation: "migration_object_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "validation_reports_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "migration_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      workspace_memberships: {
        Row: {
          id: string
          invited_by: string | null
          joined_at: string
          role: string
          user_id: string
          workspace_id: string
        }
        Insert: {
          id?: string
          invited_by?: string | null
          joined_at?: string
          role?: string
          user_id: string
          workspace_id: string
        }
        Update: {
          id?: string
          invited_by?: string | null
          joined_at?: string
          role?: string
          user_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workspace_memberships_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      workspaces: {
        Row: {
          created_at: string
          id: string
          max_projects: number | null
          max_users: number | null
          name: string
          owner_id: string
          settings: Json | null
          slug: string
          subscription_tier: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          max_projects?: number | null
          max_users?: number | null
          name: string
          owner_id: string
          settings?: Json | null
          slug: string
          subscription_tier?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          max_projects?: number | null
          max_users?: number | null
          name?: string
          owner_id?: string
          settings?: Json | null
          slug?: string
          subscription_tier?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_account_lockout: {
        Args: { user_email: string; client_ip?: unknown }
        Returns: {
          is_locked: boolean
          lockout_until: string
        }[]
      }
      check_demo_access: {
        Args: { p_email_domain: string }
        Returns: {
          can_access: boolean
          demo_type: string
          record_limit: number
          reason: string
        }[]
      }
      check_rate_limit: {
        Args: {
          key_prefix: string
          max_requests: number
          window_minutes?: number
        }
        Returns: boolean
      }
      cleanup_expired_oauth_state: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      cleanup_old_records: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      encrypt_and_store_credential: {
        Args: {
          p_service_name: string
          p_credential_name: string
          p_credential_type: string
          p_credential_value: string
          p_environment?: string
          p_expires_at?: string
          p_metadata?: Json
          p_tags?: string[]
        }
        Returns: string
      }
      get_credential_security_metrics: {
        Args: Record<PropertyKey, never>
        Returns: {
          total_credentials: number
          expired_credentials: number
          expiring_soon: number
          last_rotation_days: number
        }[]
      }
      get_decrypted_credential_with_logging: {
        Args: { p_credential_id: string }
        Returns: {
          id: string
          service_name: string
          credential_name: string
          credential_type: string
          credential_value: string
          environment: string
          expires_at: string
          metadata: Json
          tags: string[]
        }[]
      }
      get_expiring_credentials: {
        Args: { days_ahead?: number }
        Returns: {
          id: string
          service_name: string
          credential_name: string
          expires_at: string
          days_until_expiry: number
        }[]
      }
      get_performance_metrics: {
        Args: Record<PropertyKey, never>
        Returns: {
          metric_name: string
          metric_value: number
          metric_unit: string
        }[]
      }
      get_rate_limit_violations: {
        Args: Record<PropertyKey, never>
        Returns: {
          user_id: string
          violation_count: number
          last_violation: string
        }[]
      }
      get_suspicious_credential_access: {
        Args: {
          p_time_window_hours?: number
          p_high_threshold?: number
          p_medium_threshold?: number
          p_min_count_to_report?: number
        }
        Returns: {
          user_id: string
          credential_id: string
          access_count: number
          last_access: string
          risk_level: string
        }[]
      }
      get_system_health_metrics: {
        Args: Record<PropertyKey, never>
        Returns: {
          metric_name: string
          metric_value: number
          metric_description: string
          last_updated: string
        }[]
      }
      get_user_workspaces: {
        Args: { user_uuid?: string }
        Returns: {
          workspace_id: string
          workspace_name: string
          workspace_slug: string
          user_role: string
          member_count: number
        }[]
      }
      log_login_attempt: {
        Args: {
          user_email: string
          client_ip?: unknown
          is_success?: boolean
          client_user_agent?: string
        }
        Returns: undefined
      }
      update_demo_access: {
        Args: {
          p_email_domain: string
          p_demo_type?: string
          p_data_record_limit?: number
        }
        Returns: string
      }
      validate_password_strength: {
        Args: { password: string }
        Returns: boolean
      }
    }
    Enums: {
      crm_data_type:
        | "TEXT"
        | "NUMBER"
        | "DATE"
        | "DATETIME"
        | "BOOLEAN"
        | "PICKLIST"
        | "MULTI_PICKLIST"
        | "LOOKUP"
        | "EMAIL"
        | "PHONE"
        | "URL"
        | "CURRENCY"
        | "PERCENT"
        | "ID"
      transformation_type:
        | "NONE"
        | "DIRECT"
        | "FORMULA"
        | "LOOKUP"
        | "PICKLIST_MAP"
        | "CONCATENATE"
        | "SPLIT"
        | "DATE_FORMAT"
        | "NUMBER_FORMAT"
        | "CUSTOM_FUNCTION"
      user_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      crm_data_type: [
        "TEXT",
        "NUMBER",
        "DATE",
        "DATETIME",
        "BOOLEAN",
        "PICKLIST",
        "MULTI_PICKLIST",
        "LOOKUP",
        "EMAIL",
        "PHONE",
        "URL",
        "CURRENCY",
        "PERCENT",
        "ID",
      ],
      transformation_type: [
        "NONE",
        "DIRECT",
        "FORMULA",
        "LOOKUP",
        "PICKLIST_MAP",
        "CONCATENATE",
        "SPLIT",
        "DATE_FORMAT",
        "NUMBER_FORMAT",
        "CUSTOM_FUNCTION",
      ],
      user_role: ["admin", "user"],
    },
  },
} as const
