
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  getMigrationProject,
  getMigrationStages,
  getMigrationObjectTypes,
  getMigrationErrors,
  getFieldMappings
} from "@/services/migrationService";
import {
  MigrationProject,
  MigrationStage,
  MigrationObjectType,
  MigrationError,
  UserActivity,
  FieldMapping
} from "@/integrations/supabase/migrationTypes";

interface UseProjectDataProps {
  projectId: string;
  onError?: (error: Error) => void;
  onLoaded?: () => void;  // Fixed the syntax error here by adding parentheses
  retryOnError?: boolean;
  retryCount?: number;
}

interface UseProjectDataReturn {
  project: MigrationProject | null;
  stages: MigrationStage[];
  objectTypes: MigrationObjectType[];
  errors: MigrationError[];
  activities: UserActivity[];
  fieldMappings: FieldMapping[];
  selectedObjectTypeId: string | null;
  isLoading: boolean;
  isRefreshing: boolean;
  hasError: boolean;
  errorMessage: string | null;
  refreshData: () => Promise<void>;
  setSelectedObjectTypeId: (id: string | null) => void;
  setFieldMappings: (mappings: FieldMapping[]) => void;
  setActivities: (activities: UserActivity[]) => void;
  setProject: (project: MigrationProject | null) => void;
}

export const useProjectData = ({ 
  projectId, 
  onError, 
  onLoaded,
  retryOnError = false,
  retryCount = 3
}: UseProjectDataProps): UseProjectDataReturn => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [project, setProject] = useState<MigrationProject | null>(null);
  const [stages, setStages] = useState<MigrationStage[]>([]);
  const [objectTypes, setObjectTypes] = useState<MigrationObjectType[]>([]);
  const [errors, setErrors] = useState<MigrationError[]>([]);
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [selectedObjectTypeId, setSelectedObjectTypeId] = useState<string | null>(null);
  const [fieldMappings, setFieldMappings] = useState<FieldMapping[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [internalRetryCount, setInternalRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  const fetchMigrationData = useCallback(async (isRefresh = false) => {
    if (!projectId) {
      navigate("/migrations");
      return;
    }

    const loadingState = isRefresh ? setIsRefreshing : setIsLoading;
    loadingState(true);
    setHasError(false);
    setErrorMessage(null);
    
    try {
      // Fetch project details
      const projectData = await getMigrationProject(projectId);
      if (!projectData) {
        throw new Error("Migration project not found");
      }
      setProject(projectData);

      // Fetch stages
      const stagesData = await getMigrationStages(projectId);
      setStages(stagesData);

      // Fetch object types
      const objectTypesData = await getMigrationObjectTypes(projectId);
      setObjectTypes(objectTypesData);
      
      // Set selected object type if not already set or if current selection doesn't exist anymore
      const currentIdExists = objectTypesData.some(ot => ot.id === selectedObjectTypeId);
      if (!currentIdExists && objectTypesData.length > 0) {
        setSelectedObjectTypeId(objectTypesData[0].id);
      }

      // Fetch errors
      const errorsData = await getMigrationErrors(projectId);
      setErrors(errorsData);

      // Fetch user activities with better error handling
      try {
        const { data, error } = await supabase
          .from('user_activities')
          .select('*')
          .eq('project_id', projectId)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        setActivities(data || []);
      } catch (error: any) {
        console.error("Error fetching activities:", error);
        // Non-critical error, continue without failing the whole operation
        toast({
          title: "Warning",
          description: "Could not load activity history: " + error.message,
          variant: "default",
        });
      }

      // Fetch field mappings for the selected object type
      if (selectedObjectTypeId || (objectTypesData.length > 0 && !selectedObjectTypeId)) {
        const targetObjectTypeId = selectedObjectTypeId || objectTypesData[0].id;
        const mappingsData = await getFieldMappings(targetObjectTypeId);
        setFieldMappings(mappingsData);
      }
      
      // Call onLoaded callback
      if (onLoaded) {
        onLoaded();
      }
      
      // Reset retry count on success
      setInternalRetryCount(0);
    } catch (error: any) {
      console.error("Error fetching migration data:", error);
      setHasError(true);
      setErrorMessage(error.message || "Failed to load migration data");
      
      // Pass error to callback if provided
      if (onError && error instanceof Error) {
        onError(error);
      } else {
        // Fallback error handling
        toast({
          title: "Error",
          description: error.message || "Failed to load migration data",
          variant: "destructive",
        });
      }
      
      // If retry is enabled and we haven't exceeded the max retries
      if (retryOnError && internalRetryCount < MAX_RETRIES) {
        const nextRetry = internalRetryCount + 1;
        setInternalRetryCount(nextRetry);
        
        // Calculate delay with exponential backoff (1s, 2s, 4s)
        const delay = Math.pow(2, internalRetryCount) * 1000;
        console.log(`Retrying in ${delay/1000} seconds (attempt ${nextRetry}/${MAX_RETRIES})...`);
        
        setTimeout(() => {
          fetchMigrationData(isRefresh);
        }, delay);
      }
    } finally {
      loadingState(false);
    }
  }, [projectId, navigate, toast, onError, onLoaded, selectedObjectTypeId, internalRetryCount, retryOnError]);

  // Initial data fetch
  useEffect(() => {
    fetchMigrationData();
  }, [fetchMigrationData]);

  // Public method to refresh data
  const refreshData = useCallback(async () => {
    await fetchMigrationData(true);
  }, [fetchMigrationData]);

  return {
    project,
    stages,
    objectTypes,
    errors,
    activities,
    fieldMappings,
    selectedObjectTypeId,
    isLoading,
    isRefreshing,
    hasError,
    errorMessage,
    refreshData,
    setSelectedObjectTypeId,
    setFieldMappings,
    setActivities,
    setProject
  };
};
