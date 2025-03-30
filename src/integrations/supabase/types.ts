export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
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
        }
        Relationships: []
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
