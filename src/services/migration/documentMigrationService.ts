
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { handleServiceError } from "../utils/serviceUtils";
import { v4 as uuidv4 } from 'uuid';

export interface DocumentInfo {
  sourceId: string;
  fileName: string;
  contentType: string;
  fileSize: number;
  sourceUrl?: string;
  destinationPath?: string;
  content?: Blob;
  relationships?: Array<{
    recordType: string;
    recordId: string;
    relationshipType?: string;
  }>;
}

export interface DocumentMigrationParams {
  projectId: string;
  sourceSystem: string;
  recordType: string;
  recordId: string;
}

/**
 * Initialize document extraction for a record
 */
export const initDocumentExtraction = async (params: DocumentMigrationParams): Promise<string | null> => {
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
 * Batch process multiple documents for a project
 */
export const batchProcessDocuments = async (
  params: DocumentMigrationParams, 
  documents: DocumentInfo[], 
  destinationSystem: string,
  progressCallback?: (processed: number, total: number) => void
): Promise<{ success: number, failed: number }> => {
  let success = 0;
  let failed = 0;
  
  // Process documents in batches to avoid overwhelming the server
  const batchSize = 5;
  const batches = [];
  
  for (let i = 0; i < documents.length; i += batchSize) {
    batches.push(documents.slice(i, i + batchSize));
  }
  
  for (const [index, batch] of batches.entries()) {
    const batchPromises = batch.map(async (document) => {
      try {
        // Create a unique migration ID for each document
        const migrationId = await initDocumentExtraction({
          ...params,
          recordId: `${params.recordId}_doc_${document.sourceId || uuidv4().substring(0, 8)}`
        });
        
        if (!migrationId) return false;
        
        return processDocumentTransfer(migrationId, document, destinationSystem);
      } catch (err) {
        console.error('Error processing document:', err);
        return false;
      }
    });
    
    const results = await Promise.all(batchPromises);
    
    results.forEach(result => {
      if (result) success++;
      else failed++;
    });
    
    // Call progress callback if provided
    if (progressCallback) {
      progressCallback((index + 1) * batchSize > documents.length ? documents.length : (index + 1) * batchSize, documents.length);
    }
  }
  
  return { success, failed };
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
