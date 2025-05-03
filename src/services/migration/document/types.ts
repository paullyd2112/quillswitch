
export interface DocumentInfo {
  id: string;
  name: string;
  size?: number;
  type?: string;
  url?: string;
  content?: string;
  metadata?: Record<string, any>;
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
