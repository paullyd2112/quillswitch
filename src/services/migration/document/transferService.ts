
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { DocumentInfo } from "./types";

/**
 * Process document transfer after extraction
 */
export const processDocumentTransfer = async (
  migrationId: string,
  documentInfo: DocumentInfo,
  destinationSystem: string
): Promise<boolean> => {
  try {
    const { data, error } = await supabase.functions.invoke('document-migration', {
      body: {
        operation: 'process-document-transfer',
        migrationId,
        documentInfo,
        destinationSystem
      }
    });

    if (error) throw error;
    if (!data.success) throw new Error(data.error || 'Failed to process document transfer');

    return true;
  } catch (error) {
    console.error('Error processing document transfer:', error);
    return false;
  }
};

/**
 * Validate document access and permissions
 */
export const validateDocumentAccess = async (
  sourceSystem: string,
  documentIds: string[]
): Promise<{valid: boolean, inaccessibleDocs?: string[]}> => {
  try {
    const { data, error } = await supabase.functions.invoke('document-migration', {
      body: {
        operation: 'validate-document-access',
        sourceSystem,
        documentIds
      }
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error validating document access:', error);
    return { valid: false };
  }
};
