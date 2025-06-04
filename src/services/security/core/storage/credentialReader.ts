
import { supabase } from '@/integrations/supabase/client';
import type { 
  SecureCredentialData, 
  CredentialRetrievalResult 
} from '../../types/credentialTypes';
import { jsonToRecord } from '../../types/credentialTypes';

export class CredentialReader {
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
}
