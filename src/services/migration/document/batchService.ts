
import { v4 as uuidv4 } from 'uuid';
import { DocumentInfo, DocumentMigrationParams, generateUniqueDocId } from "./types";
import { initDocumentExtraction } from "./extractionService";
import { processDocumentTransfer } from "./transferService";

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
