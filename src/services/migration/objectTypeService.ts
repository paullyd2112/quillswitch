
import { supabase } from "@/integrations/supabase/client";
import { MigrationObjectType } from "@/integrations/supabase/migrationTypes";
import { handleServiceError } from "../utils/serviceUtils";

/**
 * Get all migration object types for a project
 */
export const getMigrationObjectTypes = async (projectId: string): Promise<MigrationObjectType[]> => {
  try {
    const { data, error } = await supabase
      .from('migration_object_types')
      .select('*')
      .eq('project_id', projectId);
    
    if (error) throw error;
    
    return data as MigrationObjectType[];
  } catch (error: any) {
    handleServiceError(error, "Error fetching migration object types", true);
    return [];
  }
};

/**
 * Create a new migration object type
 */
export const createMigrationObjectType = async (objectTypeData: Omit<MigrationObjectType, 'id'>): Promise<MigrationObjectType | null> => {
  try {
    const { data, error } = await supabase
      .from('migration_object_types')
      .insert(objectTypeData)
      .select()
      .single();
    
    if (error) throw error;
    
    return data as MigrationObjectType;
  } catch (error: any) {
    return handleServiceError(error, "Error creating migration object type", true);
  }
};

/**
 * Update a migration object type
 */
export const updateMigrationObjectType = async (id: string, updates: Partial<MigrationObjectType>): Promise<MigrationObjectType | null> => {
  try {
    const { data, error } = await supabase
      .from('migration_object_types')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return data as MigrationObjectType;
  } catch (error: any) {
    return handleServiceError(error, "Error updating migration object type", true);
  }
};
