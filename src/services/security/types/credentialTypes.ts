
import type { Json } from '@/integrations/supabase/types';

export interface SecureCredentialData {
  id?: string;
  serviceName: string;
  credentialName: string;
  credentialType: 'api_key' | 'oauth_token' | 'secret' | 'certificate';
  credentialValue: string;
  environment?: 'production' | 'staging' | 'development';
  expiresAt?: string;
  metadata?: Record<string, any>;
  tags?: string[];
}

export interface CredentialStorageResult {
  success: boolean;
  id?: string;
  error?: string;
}

export interface CredentialRetrievalResult {
  success: boolean;
  credential?: SecureCredentialData;
  error?: string;
}

export interface CredentialListResult {
  success: boolean;
  credentials?: Omit<SecureCredentialData, 'credentialValue'>[];
  error?: string;
}

export interface MigrationResult {
  success: boolean;
  migrated: number;
  errors: string[];
}

// Helper function to safely convert Json to Record<string, any>
export const jsonToRecord = (json: Json | null): Record<string, any> => {
  if (!json || typeof json !== 'object' || Array.isArray(json)) {
    return {};
  }
  return json as Record<string, any>;
};

// Helper function to safely convert Record<string, any> to Json
export const recordToJson = (record: Record<string, any> | undefined): Json => {
  if (!record) return null;
  return record as Json;
};
