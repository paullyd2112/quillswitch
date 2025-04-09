
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  updateMigrationProject,
  logUserActivity,
  getFieldMappings
} from "@/services/migrationService";
import { createNotification } from "@/services/migration/notificationService";
import { MigrationProject } from "@/integrations/supabase/migrationTypes";

interface UseProjectActionsProps {
  project: MigrationProject | null;
  selectedObjectTypeId: string | null;
  setFieldMappings: (mappings: any[]) => void;
  setActivities: (activities: any[]) => void;
  setProject: (project: MigrationProject | null) => void;
}

export const useProjectActions = ({
  project,
  selectedObjectTypeId,
  setFieldMappings,
  setActivities,
  setProject
}: UseProjectActionsProps) => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleObjectTypeSelect = async (objectTypeId: string) => {
    if (selectedObjectTypeId === objectTypeId) return;
    
    const mappingsData = await getFieldMappings(objectTypeId);
    setFieldMappings(mappingsData);
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

  return {
    isProcessing,
    handleObjectTypeSelect,
    refreshFieldMappings,
    handleToggleMigrationStatus,
    handleSaveDeltaConfig
  };
};
