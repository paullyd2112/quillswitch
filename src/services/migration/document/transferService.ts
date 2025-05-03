
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { DocumentInfo } from "./types";

/**
 * Process document transfer between CRM systems
 */
export const processDocumentTransfer = async (
  migrationId: string, 
  documentInfo: DocumentInfo,
  destinationSystem: string
): Promise<boolean> => {
  try {
    // If we have a content blob, upload it to storage first
    if (documentInfo.content) {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      
      // Check if user exists and has an id
      if (!userData?.user?.id) throw new Error('User not authenticated');

      const filePath = `${userData.user.id}/${migrationId}/${documentInfo.fileName}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('document_migration')
        .upload(filePath, documentInfo.content, {
          contentType: documentInfo.contentType,
          upsert: true
        });

      if (uploadError) throw uploadError;
      
      // Get public URL for the uploaded file
      const { data: urlData } = await supabase.storage
        .from('document_migration')
        .createSignedUrl(filePath, 60 * 60 * 24 * 7); // 7 days

      if (urlData) {
        documentInfo.sourceUrl = urlData.signedUrl;
      }
    }

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
    toast.error('Failed to transfer document');
    return false;
  }
};
