
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
  status: "pending" | "in_progress" | "completed" | "failed" | "paused";
  created_at: string;
  updated_at: string;
  completed_at: string | null;
  total_objects: number;
  migrated_objects: number;
  failed_objects: number;
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
        setProject(data);
      } catch (err: any) {
        console.error('Error fetching migration project:', err);
        setError(err);
        toast({
          title: "Error",
          description: "Failed to load migration project data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  return { project, loading, error };
};

export default useMigrationProject;
