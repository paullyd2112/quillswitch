
import { 
  MigrationProject, 
  MigrationStage, 
  MigrationObjectType, 
  MigrationError,
  UserActivity,
  FieldMapping
} from "@/integrations/supabase/migrationTypes";

export interface DashboardContextType {
  project: MigrationProject;
  projectId: string;
  stages: MigrationStage[];
  objectTypes: MigrationObjectType[];
  errors: MigrationError[];
  activities: UserActivity[];
  selectedObjectTypeId: string | null;
  fieldMappings: FieldMapping[];
  isProcessing: boolean;
  isLoading: boolean;
  handleObjectTypeSelect: (objectTypeId: string) => void;
  handleToggleMigrationStatus: () => Promise<void>;
  handleSaveDeltaConfig: (config: any) => Promise<void>;
  refreshFieldMappings: () => Promise<void>;
}
