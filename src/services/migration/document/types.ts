
import { v4 as uuidv4 } from 'uuid';

export interface DocumentInfo {
  id: string;
  name: string;
  size?: number;
  type?: string;
  url?: string;
  content?: string;
  metadata?: Record<string, any>;
  sourceId?: string; // Added for compatibility with existing code
}

export interface DocumentMigrationParams {
  projectId: string;
  sourceSystem: string;
  documentInfo: DocumentInfo;
  associatedRecordId?: string;
  associatedRecordType?: string;
}

export interface DocumentMigrationResult {
  success: boolean;
  migrationId?: string;
  error?: string;
}

export interface DocumentMigrationStatus {
  id: string;
  status: string;
  fileName: string;
  sourceSystem: string;
  destinationDocumentId?: string;
  errorMessage?: string;
}

// Add the missing function that's used in batchService.ts
export const generateUniqueDocId = (recordId: string): string => {
  return `${recordId}_doc_${uuidv4().substring(0, 8)}`;
};
