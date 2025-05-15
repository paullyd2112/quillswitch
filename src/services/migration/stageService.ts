
import { supabase } from "@/integrations/supabase/client";
import { MigrationStage } from "@/integrations/supabase/migrationTypes";
import { handleServiceError } from "../utils/serviceUtils";

/**
 * Get all migration stages for a project
 */
export const getMigrationStages = async (projectId: string): Promise<MigrationStage[]> => {
  try {
    const { data, error } = await supabase
      .from('migration_stages')
      .select('*')
      .eq('project_id', projectId)
      .order('sequence_order', { ascending: true });
    
    if (error) throw error;
    
    return data as MigrationStage[];
  } catch (error: any) {
    handleServiceError(error, "Error fetching migration stages");
    return [];
  }
};

/**
 * Create a new migration stage
 */
export const createMigrationStage = async (stageData: Omit<MigrationStage, 'id'>): Promise<MigrationStage | null> => {
  try {
    const { data, error } = await supabase
      .from('migration_stages')
      .insert(stageData)
      .select()
      .single();
    
    if (error) throw error;
    
    return data as MigrationStage;
  } catch (error: any) {
    return handleServiceError(error, "Error creating migration stage");
  }
};

/**
 * Update a migration stage
 */
export const updateMigrationStage = async (id: string, updates: Partial<MigrationStage>): Promise<MigrationStage | null> => {
  try {
    const { data, error } = await supabase
      .from('migration_stages')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return data as MigrationStage;
  } catch (error: any) {
    return handleServiceError(error, "Error updating migration stage");
  }
};
