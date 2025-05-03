
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
      .from('document_migrations')
      .select('*')
      .eq('id', migrationId)
      .single();

    if (error) throw error;
    return data;
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
      .from('document_migrations')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
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
    const { error } = await supabase
      .from('document_migrations')
      .update(status)
      .eq('id', migrationId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating document migration status:', error);
    return false;
  }
};
