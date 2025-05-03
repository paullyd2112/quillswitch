
import { supabase } from "@/integrations/supabase/client";
import { DocumentMigrationStatus } from "./types";

/**
 * Get the status of a document migration
 */
export const getDocumentMigrationStatus = async (
  migrationId: string
): Promise<DocumentMigrationStatus | null> => {
  try {
    const { data, error } = await supabase
      .from('document_migration')
      .select('*')
      .eq('id', migrationId)
      .single();

    if (error) throw error;
    
    if (!data) return null;
    
    // Transform data to match expected DocumentMigrationStatus interface
    const result: DocumentMigrationStatus = {
      id: data.id,
      status: data.migration_status,
      fileName: data.original_file_name,
      sourceSystem: data.source_system,
      destinationDocumentId: data.destination_document_id,
      errorMessage: data.error_message
    };
    
    return result;
  } catch (error) {
    console.error('Error fetching document migration status:', error);
    return null;
  }
};

/**
 * Get all document migrations for a project
 */
export const getDocumentMigrationsForProject = async (
  projectId: string
): Promise<DocumentMigrationStatus[] | null> => {
  try {
    const { data, error } = await supabase
      .from('document_migration')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    if (!data) return null;
    
    // Transform data to match expected DocumentMigrationStatus interface
    const results: DocumentMigrationStatus[] = data.map(item => ({
      id: item.id,
      status: item.migration_status,
      fileName: item.original_file_name,
      sourceSystem: item.source_system,
      destinationDocumentId: item.destination_document_id,
      errorMessage: item.error_message
    }));
    
    return results;
  } catch (error) {
    console.error('Error fetching document migrations:', error);
    return null;
  }
};

/**
 * Update the status of a document migration
 */
export const updateDocumentMigrationStatus = async (
  migrationId: string,
  status: Partial<DocumentMigrationStatus>
): Promise<boolean> => {
  try {
    // Convert from DocumentMigrationStatus to document_migration table format
    const updateData: Record<string, any> = {};
    
    if (status.status) updateData.migration_status = status.status;
    if (status.fileName) updateData.original_file_name = status.fileName;
    if (status.destinationDocumentId) updateData.destination_document_id = status.destinationDocumentId;
    if (status.errorMessage) updateData.error_message = status.errorMessage;
    
    const { error } = await supabase
      .from('document_migration')
      .update(updateData)
      .eq('id', migrationId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating document migration status:', error);
    return false;
  }
};
