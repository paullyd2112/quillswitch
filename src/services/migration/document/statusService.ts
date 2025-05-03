
import { supabase } from "@/integrations/supabase/client";
import { handleServiceError } from "../../utils/serviceUtils";
import { DocumentMigrationStatus } from "./types";

/**
 * Get the status of a document migration
 */
export const getDocumentMigrationStatus = async (migrationId: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('document-migration', {
      body: {
        operation: 'get-document-status',
        migrationId
      }
    });

    if (error) throw error;
    if (!data.success) throw new Error(data.error || 'Failed to get document status');

    return data;
  } catch (error) {
    return handleServiceError(error, "Error fetching document migration status", true);
  }
};

/**
 * Get all document migrations for a project
 */
export const getDocumentMigrationsForProject = async (projectId: string) => {
  try {
    const { data, error } = await supabase
      .from('document_migration')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    return handleServiceError(error, "Error fetching project document migrations", true);
  }
};

/**
 * Update document migration status
 */
export const updateDocumentMigrationStatus = async (
  migrationId: string, 
  status: string, 
  details?: { destinationDocumentId?: string, errorMessage?: string }
) => {
  try {
    const updates: Record<string, any> = {
      migration_status: status,
      updated_at: new Date().toISOString()
    };
    
    if (details) {
      if (details.destinationDocumentId) {
        updates.destination_document_id = details.destinationDocumentId;
      }
      if (details.errorMessage) {
        updates.error_message = details.errorMessage;
      }
    }
    
    const { error } = await supabase
      .from('document_migration')
      .update(updates)
      .eq('id', migrationId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating document migration status:', error);
    return false;
  }
};
