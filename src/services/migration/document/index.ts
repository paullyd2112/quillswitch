
// Document Migration Types
export type { 
  DocumentInfo,
  DocumentMigrationParams,
  DocumentMigrationResult,
  DocumentMigrationStatus
} from './types';

// Export the utility function as well
export { generateUniqueDocId } from './types';

// Document Migration Services
export { initDocumentExtraction } from './extractionService';
export { processDocumentTransfer } from './transferService';
export { getDocumentMigrationStatus, getDocumentMigrationsForProject, updateDocumentMigrationStatus } from './statusService';
export { batchProcessDocuments } from './batchService';
