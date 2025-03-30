
import { supabase } from "@/integrations/supabase/client";
import { MigrationError } from "@/integrations/supabase/migrationTypes";
import { handleServiceError } from "../utils/serviceUtils";

/**
 * Get all migration errors for a project
 */
export const getMigrationErrors = async (projectId: string): Promise<MigrationError[]> => {
  try {
    const { data, error } = await supabase
      .from('migration_errors')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data || [];
  } catch (error: any) {
    handleServiceError(error, "Error fetching migration errors", true);
    return [];
  }
};

/**
 * Create a new migration error
 */
export const createMigrationError = async (errorData: Omit<MigrationError, 'id' | 'created_at'>): Promise<MigrationError | null> => {
  try {
    const { data, error } = await supabase
      .from('migration_errors')
      .insert(errorData)
      .select()
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error: any) {
    return handleServiceError(error, "Error logging migration error", true);
  }
};

/**
 * Mark a migration error as resolved
 */
export const resolveError = async (errorId: string, notes: string): Promise<MigrationError | null> => {
  try {
    const { data, error } = await supabase
      .from('migration_errors')
      .update({
        resolved: true,
        resolution_notes: notes
      })
      .eq('id', errorId)
      .select()
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error: any) {
    return handleServiceError(error, "Error resolving migration error", true);
  }
};
