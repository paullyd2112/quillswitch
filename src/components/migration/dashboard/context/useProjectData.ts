
import { useState, useEffect } from "react";
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
  setSelectedObjectTypeId: (id: string | null) => void;
  setFieldMappings: (mappings: FieldMapping[]) => void;
  setActivities: (activities: UserActivity[]) => void;
  setProject: (project: MigrationProject | null) => void;
}

export const useProjectData = ({ projectId }: UseProjectDataProps): UseProjectDataReturn => {
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

  useEffect(() => {
    if (!projectId) {
      navigate("/migrations");
      return;
    }

    const fetchMigrationData = async () => {
      setIsLoading(true);
      
      // Fetch project details
      const projectData = await getMigrationProject(projectId);
      if (!projectData) {
        toast({
          title: "Error",
          description: "Failed to load migration project.",
          variant: "destructive",
        });
        navigate("/migrations");
        return;
      }
      setProject(projectData);

      // Fetch stages
      const stagesData = await getMigrationStages(projectId);
      setStages(stagesData);

      // Fetch object types
      const objectTypesData = await getMigrationObjectTypes(projectId);
      setObjectTypes(objectTypesData);
      if (objectTypesData.length > 0) {
        setSelectedObjectTypeId(objectTypesData[0].id);
      }

      // Fetch errors
      const errorsData = await getMigrationErrors(projectId);
      setErrors(errorsData);

      // Fetch user activities
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
      }

      // Fetch field mappings for the first object type if available
      if (objectTypesData.length > 0) {
        const mappingsData = await getFieldMappings(objectTypesData[0].id);
        setFieldMappings(mappingsData);
      }

      setIsLoading(false);
    };

    fetchMigrationData();
  }, [projectId, navigate, toast]);

  return {
    project,
    stages,
    objectTypes,
    errors,
    activities,
    fieldMappings,
    selectedObjectTypeId,
    isLoading,
    setSelectedObjectTypeId,
    setFieldMappings,
    setActivities,
    setProject
  };
};
