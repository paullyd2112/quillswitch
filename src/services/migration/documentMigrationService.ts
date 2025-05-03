
// Re-export all document migration services through this index file
// This provides backward compatibility with existing code while maintaining a clean structure

export { 
  DocumentInfo, 
  DocumentMigrationParams, 
  DocumentMigrationResult, 
  DocumentMigrationStatus 
} from './document/types';

export { 
  initDocumentExtraction, 
  processDocumentTransfer,
  getDocumentMigrationStatus,
  batchProcessDocuments,
  getDocumentMigrationsForProject,
  updateDocumentMigrationStatus
} from './document/index';
