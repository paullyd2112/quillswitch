
import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  getMigrationProject,
  getMigrationStages,
  getMigrationObjectTypes,
  getMigrationErrors,
  getFieldMappings,
  updateMigrationProject,
  logUserActivity,
} from "@/services/migrationService";
import { createNotification } from "@/services/migration/notificationService";
import { DashboardContextType } from "./types";

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
};

export const DashboardProvider: React.FC<{ 
  children: React.ReactNode; 
  projectId: string;
}> = ({ children, projectId }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [project, setProject] = useState<DashboardContextType["project"]>(null);
  const [stages, setStages] = useState<DashboardContextType["stages"]>([]);
  const [objectTypes, setObjectTypes] = useState<DashboardContextType["objectTypes"]>([]);
  const [errors, setErrors] = useState<DashboardContextType["errors"]>([]);
  const [activities, setActivities] = useState<DashboardContextType["activities"]>([]);
  const [selectedObjectTypeId, setSelectedObjectTypeId] = useState<string | null>(null);
  const [fieldMappings, setFieldMappings] = useState<DashboardContextType["fieldMappings"]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

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

  useEffect(() => {
    // Fetch field mappings when selected object type changes
    const fetchFieldMappings = async () => {
      if (selectedObjectTypeId) {
        const mappingsData = await getFieldMappings(selectedObjectTypeId);
        setFieldMappings(mappingsData);
      }
    };

    fetchFieldMappings();
  }, [selectedObjectTypeId]);

  const handleObjectTypeSelect = (objectTypeId: string) => {
    setSelectedObjectTypeId(objectTypeId);
  };

  const refreshFieldMappings = async () => {
    if (selectedObjectTypeId) {
      const mappingsData = await getFieldMappings(selectedObjectTypeId);
      setFieldMappings(mappingsData);
    }
  };

  const handleToggleMigrationStatus = async () => {
    if (!project) return;

    try {
      setIsProcessing(true);
      
      const newStatus = project.status === "in_progress" ? "paused" : "in_progress";
      const updatedProject = await updateMigrationProject(project.id, { status: newStatus });
      
      if (updatedProject) {
        setProject(updatedProject);
        
        // Log the activity
        await logUserActivity({
          project_id: project.id,
          activity_type: newStatus === "in_progress" ? "project_resumed" : "project_paused",
          activity_description: `Migration ${newStatus === "in_progress" ? "resumed" : "paused"}`
        });
        
        toast({
          title: newStatus === "in_progress" ? "Migration Resumed" : "Migration Paused",
          description: `Your migration has been ${newStatus === "in_progress" ? "resumed" : "paused"} successfully.`,
        });
        
        // Refresh activities
        const { data } = await supabase
          .from('user_activities')
          .select('*')
          .eq('project_id', project.id)
          .order('created_at', { ascending: false });
          
        if (data) {
          setActivities(data);
        }
      }
    } catch (error: any) {
      toast({
        title: "Action Failed",
        description: error.message || "Failed to update migration status.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveDeltaConfig = async (config: any) => {
    if (!project) return;
    
    try {
      // In a real app, we would save this to the database
      console.log("Delta migration config saved:", config);
      
      // Create a notification
      if (config.enabled) {
        await createNotification(
          project.id,
          "Delta Migration Enabled",
          `Delta migration configured with ${config.syncFrequency} frequency.`,
          "migration_started"
        );
      }
      
      toast({
        title: config.enabled ? "Delta Migration Enabled" : "Delta Migration Disabled",
        description: config.enabled 
          ? `Configuration saved with ${config.syncFrequency} updates.` 
          : "Delta migration has been disabled.",
      });
      
      // Log the activity
      await logUserActivity({
        project_id: project.id,
        activity_type: "delta_config_updated",
        activity_description: config.enabled 
          ? `Delta migration configured with ${config.syncFrequency} frequency` 
          : "Delta migration disabled",
        activity_details: config
      });
      
    } catch (error: any) {
      toast({
        title: "Action Failed",
        description: error.message || "Failed to save delta migration configuration.",
        variant: "destructive",
      });
    }
  };

  const value: DashboardContextType = {
    project,
    projectId, // Add projectId
    stages,
    objectTypes,
    errors,
    activities,
    selectedObjectTypeId,
    fieldMappings,
    isProcessing,
    handleObjectTypeSelect,
    handleToggleMigrationStatus,
    handleSaveDeltaConfig,
    refreshFieldMappings, // Add refreshFieldMappings
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-slate-50 dark:from-background dark:to-slate-900/50 hero-gradient">
        <div className="container px-4 pt-32 pb-20 flex items-center justify-center">
          <div className="text-center">
            <RefreshCw className="h-12 w-12 mx-auto mb-4 animate-spin text-brand-500" />
            <h2 className="text-xl font-medium">Loading migration data...</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

import { RefreshCw } from "lucide-react";
