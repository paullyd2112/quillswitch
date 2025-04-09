
import {
  MigrationProject,
  MigrationStage,
  MigrationObjectType,
  MigrationError,
  UserActivity,
  FieldMapping
} from "@/integrations/supabase/migrationTypes";

export interface DashboardContextType {
  project: MigrationProject | null;
  projectId: string; // Add projectId to the type
  stages: MigrationStage[];
  objectTypes: MigrationObjectType[];
  errors: MigrationError[];
  activities: UserActivity[];
  selectedObjectTypeId: string | null;
  fieldMappings: FieldMapping[];
  isProcessing: boolean;
  handleObjectTypeSelect: (objectTypeId: string) => void;
  handleToggleMigrationStatus: () => Promise<void>;
  handleSaveDeltaConfig: (config: any) => Promise<void>;
  refreshFieldMappings: () => void; // Add refreshFieldMappings function
}
