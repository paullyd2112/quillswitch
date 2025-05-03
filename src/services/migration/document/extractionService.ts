
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { DocumentMigrationParams, DocumentMigrationResult } from "./types";

/**
 * Initialize document extraction for a record
 */
export const initDocumentExtraction = async (
  params: DocumentMigrationParams
): Promise<string | null> => {
  try {
    const { data, error } = await supabase.functions.invoke('document-migration', {
      body: {
        operation: 'init-document-extraction',
        ...params
      }
    });

    if (error) throw error;
    if (!data.success) throw new Error(data.error || 'Failed to initialize document extraction');

    return data.migrationId;
  } catch (error) {
    console.error('Error initializing document extraction:', error);
    toast.error('Failed to initialize document extraction');
    return null;
  }
};
