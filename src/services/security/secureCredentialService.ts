
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { sanitizeForLogging } from '@/utils/encryptionUtils';

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

export class SecureCredentialService {
  private static instance: SecureCredentialService;

  public static getInstance(): SecureCredentialService {
    if (!SecureCredentialService.instance) {
      SecureCredentialService.instance = new SecureCredentialService();
    }
    return SecureCredentialService.instance;
  }

  /**
   * Store a credential securely using Supabase encryption
   */
  public async storeCredential(credential: SecureCredentialData): Promise<{ success: boolean; id?: string; error?: string }> {
    try {
      console.log('Storing credential securely:', sanitizeForLogging(credential));

      const { data, error } = await supabase.rpc('encrypt_and_store_credential', {
        p_service_name: credential.serviceName,
        p_credential_name: credential.credentialName,
        p_credential_type: credential.credentialType,
        p_credential_value: credential.credentialValue,
        p_environment: credential.environment || null,
        p_expires_at: credential.expiresAt || null,
        p_metadata: credential.metadata || {},
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
  public async getCredential(credentialId: string): Promise<{ success: boolean; credential?: SecureCredentialData; error?: string }> {
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
        metadata: record.metadata,
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
  public async listCredentials(): Promise<{ success: boolean; credentials?: Omit<SecureCredentialData, 'credentialValue'>[]; error?: string }> {
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
        metadata: record.metadata,
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

  /**
   * Migrate localStorage credentials to secure storage
   */
  public async migrateLocalStorageCredentials(): Promise<{ success: boolean; migrated: number; errors: string[] }> {
    const migrated: string[] = [];
    const errors: string[] = [];

    try {
      // Find potential credentials in localStorage
      const credentialKeys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.includes('api_key') || key.includes('credential') || key.includes('token'))) {
          // Skip legitimate auth tokens
          if (key.includes('auth-token') || key.includes('supabase')) continue;
          credentialKeys.push(key);
        }
      }

      for (const key of credentialKeys) {
        try {
          const value = localStorage.getItem(key);
          if (!value) continue;

          // Attempt to migrate to secure storage
          const result = await this.storeCredential({
            serviceName: 'migrated',
            credentialName: key,
            credentialType: 'api_key',
            credentialValue: value,
            environment: 'development',
            metadata: { migratedFrom: 'localStorage', originalKey: key }
          });

          if (result.success) {
            localStorage.removeItem(key);
            migrated.push(key);
            console.log(`Migrated credential: ${key}`);
          } else {
            errors.push(`Failed to migrate ${key}: ${result.error}`);
          }
        } catch (error) {
          errors.push(`Error migrating ${key}: ${error}`);
        }
      }

      if (migrated.length > 0) {
        toast.success(`Migrated ${migrated.length} credentials to secure storage`);
      }

      return { success: true, migrated: migrated.length, errors };
    } catch (error) {
      console.error('Error during migration:', error);
      return { success: false, migrated: migrated.length, errors: [...errors, `Migration error: ${error}`] };
    }
  }
}

export const secureCredentialService = SecureCredentialService.getInstance();
