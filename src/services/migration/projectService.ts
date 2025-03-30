
import { supabase } from "@/integrations/supabase/client";
import { MigrationProject } from "@/integrations/supabase/migrationTypes";
import { handleServiceError } from "../utils/serviceUtils";
import { toast } from "@/components/ui/use-toast";

/**
 * Create a new migration project
 */
export const createMigrationProject = async (projectData: Omit<MigrationProject, 'id' | 'created_at' | 'updated_at' | 'user_id'>): Promise<MigrationProject | null> => {
  try {
    const { data, error } = await supabase
      .from('migration_projects')
      .insert({
        ...projectData,
        user_id: (await supabase.auth.getUser()).data.user?.id
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return data as MigrationProject;
  } catch (error: any) {
    return handleServiceError(error, "Error creating migration project");
  }
};

/**
 * Get all migration projects
 */
export const getMigrationProjects = async (): Promise<MigrationProject[]> => {
  try {
    const { data, error } = await supabase
      .from('migration_projects')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data as MigrationProject[];
  } catch (error: any) {
    handleServiceError(error, "Error fetching migration projects");
    return [];
  }
};

/**
 * Get a specific migration project by ID
 */
export const getMigrationProject = async (id: string): Promise<MigrationProject | null> => {
  try {
    const { data, error } = await supabase
      .from('migration_projects')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    return data as MigrationProject;
  } catch (error: any) {
    return handleServiceError(error, "Error fetching migration project");
  }
};

/**
 * Update a migration project
 */
export const updateMigrationProject = async (id: string, updates: Partial<MigrationProject>): Promise<MigrationProject | null> => {
  try {
    const { data, error } = await supabase
      .from('migration_projects')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return data as MigrationProject;
  } catch (error: any) {
    return handleServiceError(error, "Error updating migration project");
  }
};

/**
 * Get project progress percentage
 */
export const getProjectProgress = (project: MigrationProject): number => {
  if (project.total_objects === 0) return 0;
  return Math.round((project.migrated_objects / project.total_objects) * 100);
};
