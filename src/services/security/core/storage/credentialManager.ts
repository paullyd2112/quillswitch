
import { supabase } from '@/integrations/supabase/client';
import type { 
  SecureCredentialData, 
  CredentialListResult 
} from '../../types/credentialTypes';
import { jsonToRecord } from '../../types/credentialTypes';

export class CredentialManager {
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
