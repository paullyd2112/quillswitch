
import { supabase } from "@/integrations/supabase/client";
import { FieldMapping } from "@/integrations/supabase/migrationTypes";
import { handleServiceError } from "../utils/serviceUtils";

/**
 * Get field mappings for an object type
 */
export const getFieldMappings = async (objectTypeId: string): Promise<FieldMapping[]> => {
  try {
    const { data, error } = await supabase
      .from('field_mappings')
      .select('*')
      .eq('object_type_id', objectTypeId);
    
    if (error) throw error;
    
    return data || [];
  } catch (error: any) {
    handleServiceError(error, "Error fetching field mappings");
    return [];
  }
};

/**
 * Create a new field mapping
 */
export const createFieldMapping = async (mappingData: Omit<FieldMapping, 'id'>): Promise<FieldMapping | null> => {
  try {
    const { data, error } = await supabase
      .from('field_mappings')
      .insert(mappingData)
      .select()
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error: any) {
    return handleServiceError(error, "Error creating field mapping");
  }
};

/**
 * Update a field mapping
 */
export const updateFieldMapping = async (id: string, updates: Partial<FieldMapping>): Promise<FieldMapping | null> => {
  try {
    const { data, error } = await supabase
      .from('field_mappings')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error: any) {
    return handleServiceError(error, "Error updating field mapping");
  }
};
