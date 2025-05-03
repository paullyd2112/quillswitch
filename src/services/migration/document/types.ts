
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
  [key: string]: any;
}

export const generateUniqueDocId = (recordId: string): string => {
  return `${recordId}_doc_${uuidv4().substring(0, 8)}`;
};
