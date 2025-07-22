
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface MigrationProject {
  id: string;
  user_id: string;
  company_name: string;
  source_crm: string;
  destination_crm: string;
  migration_strategy: string;
  status: string; // Changed from union type to string to match database
  created_at: string;
  updated_at: string;
  completed_at: string | null;
  total_objects: number;
  migrated_objects: number;
  failed_objects: number;
  workspace_id?: string | null; // Added missing field from database
}

export const useMigrationProject = (projectId?: string) => {
  const [project, setProject] = useState<MigrationProject | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!projectId) {
      setLoading(false);
      return;
    }

    const fetchProject = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('migration_projects')
          .select('*')
          .eq('id', projectId)
          .single();

        if (error) throw error;
        
        // Use data directly since status is now string type
        const typedData = data as MigrationProject;
        
        setProject(typedData);
      } catch (err: any) {
        console.error('Error fetching migration project:', err);
        setError(err);
        toast.error("Failed to load migration project data");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  return { project, loading, error };
};

export default useMigrationProject;
