
import { supabase } from '@/integrations/supabase/client';
import { sanitizeForLogging } from '@/utils/encryptionUtils';
import type { 
  SecureCredentialData, 
  CredentialStorageResult 
} from '../../types/credentialTypes';
import { recordToJson } from '../../types/credentialTypes';

export class CredentialWriter {
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
}
