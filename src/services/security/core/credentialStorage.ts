
import { supabase } from '@/integrations/supabase/client';
import { sanitizeForLogging } from '@/utils/encryptionUtils';
import type { 
  SecureCredentialData, 
  CredentialStorageResult,
  CredentialRetrievalResult,
  CredentialListResult 
} from '../types/credentialTypes';
import { recordToJson, jsonToRecord } from '../types/credentialTypes';

export class CredentialStorage {
  /**
   * Store a credential securely using Supabase encryption
   */
  public async storeCredential(credential: SecureCredentialData): Promise<CredentialStorageResult> {
    try {
      console.log('Storing credential securely:', sanitizeForLogging(credential));

      const { data, error } = await supabase.rpc('encrypt_and_store_credential', {
        p_service_name: credential.serviceName,
        p_credential_name: credential.credentialName,
        p_credential_type: credential.credentialType,
        p_credential_value: credential.credentialValue,
        p_environment: credential.environment || null,
        p_expires_at: credential.expiresAt || null,
        p_metadata: recordToJson(credential.metadata),
        p_tags: credential.tags || []
      });

      if (error) {
        console.error('Failed to store credential:', error);
        return { success: false, error: error.message };
      }

      return { success: true, id: data };
    } catch (error) {
      console.error('Error storing credential:', error);
      return { success: false, error: 'Failed to store credential securely' };
    }
  }

  /**
   * Retrieve a credential securely (with audit logging)
   */
  public async getCredential(credentialId: string): Promise<CredentialRetrievalResult> {
    try {
      const { data, error } = await supabase.rpc('get_decrypted_credential_with_logging', {
        p_credential_id: credentialId
      });

      if (error) {
        console.error('Failed to retrieve credential:', error);
        return { success: false, error: error.message };
      }

      if (!data || data.length === 0) {
        return { success: false, error: 'Credential not found' };
      }

      const record = data[0];
      const credential: SecureCredentialData = {
        id: record.id,
        serviceName: record.service_name,
        credentialName: record.credential_name,
        credentialType: record.credential_type as SecureCredentialData['credentialType'],
        credentialValue: record.credential_value,
        environment: record.environment as SecureCredentialData['environment'],
        expiresAt: record.expires_at,
        metadata: jsonToRecord(record.metadata),
        tags: record.tags
      };

      return { success: true, credential };
    } catch (error) {
      console.error('Error retrieving credential:', error);
      return { success: false, error: 'Failed to retrieve credential' };
    }
  }

  /**
   * List user's credentials (without sensitive values)
   */
  public async listCredentials(): Promise<CredentialListResult> {
    try {
      const { data, error } = await supabase
        .from('service_credentials')
        .select('id, service_name, credential_name, credential_type, environment, expires_at, metadata, tags, created_at, updated_at');

      if (error) {
        console.error('Failed to list credentials:', error);
        return { success: false, error: error.message };
      }

      const credentials = data?.map(record => ({
        id: record.id,
        serviceName: record.service_name,
        credentialName: record.credential_name,
        credentialType: record.credential_type as SecureCredentialData['credentialType'],
        environment: record.environment as SecureCredentialData['environment'],
        expiresAt: record.expires_at,
        metadata: jsonToRecord(record.metadata),
        tags: record.tags
      })) || [];

      return { success: true, credentials };
    } catch (error) {
      console.error('Error listing credentials:', error);
      return { success: false, error: 'Failed to list credentials' };
    }
  }

  /**
   * Delete a credential securely
   */
  public async deleteCredential(credentialId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('service_credentials')
        .delete()
        .eq('id', credentialId);

      if (error) {
        console.error('Failed to delete credential:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Error deleting credential:', error);
      return { success: false, error: 'Failed to delete credential' };
    }
  }
}
