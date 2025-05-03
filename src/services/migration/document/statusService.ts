
import { supabase } from "@/integrations/supabase/client";
import { DocumentMigrationStatus } from "./types";

/**
 * Get the status of a document migration
 */
export const getDocumentMigrationStatus = async (
  migrationId: string
): Promise<DocumentMigrationStatus | null> => {
  try {
    const { data, error } = await supabase.functions.invoke('document-migration', {
      body: {
        operation: 'get-document-status',
        migrationId
      }
    });

    if (error) throw error;
    if (!data.success) throw new Error(data.error || 'Failed to get document status');

    const document = data.document;

    // Convert the DB record to the expected DocumentMigrationStatus format
    return {
      id: document.id,
      status: document.migration_status,
      fileName: document.original_file_name,
      sourceSystem: document.source_system,
      destinationDocumentId: document.destination_document_id,
      errorMessage: document.error_message
    };
  } catch (error) {
    console.error('Error getting document migration status:', error);
    return null;
  }
};

/**
 * Get all document migrations for a project
 */
export const getDocumentMigrationsForProject = async (
  projectId: string
): Promise<DocumentMigrationStatus[]> => {
  try {
    const { data, error } = await supabase
      .from('document_migration')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Convert the DB records to the expected DocumentMigrationStatus format
    return data.map(doc => ({
      id: doc.id,
      status: doc.migration_status,
      fileName: doc.original_file_name,
      sourceSystem: doc.source_system,
      destinationDocumentId: doc.destination_document_id,
      errorMessage: doc.error_message
    }));
  } catch (error) {
    console.error('Error getting document migrations:', error);
    return [];
  }
};

/**
 * Update the status of a document migration
 */
export const updateDocumentMigrationStatus = async (
  migrationId: string,
  status: string,
  errorMessage?: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('document_migration')
      .update({
        migration_status: status,
        error_message: errorMessage,
        updated_at: new Date().toISOString()
      })
      .eq('id', migrationId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating document migration status:', error);
    return false;
  }
};
