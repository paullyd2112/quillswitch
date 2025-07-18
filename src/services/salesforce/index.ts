import { supabase } from '@/integrations/supabase/client';
import { SalesforceClient, createSalesforceClient } from './client';
import { SalesforceCredential } from './types';

export * from './types';
export * from './client';
export * from './oauth';

export class SalesforceService {
  private client: SalesforceClient | null = null;

  async initializeConnection(credentialId: string): Promise<SalesforceClient> {
    try {
      // Get decrypted credential from Supabase
      const { data: credentials, error } = await supabase
        .rpc('get_decrypted_credential_with_logging', {
          p_credential_id: credentialId
        });

      if (error || !credentials || credentials.length === 0) {
        throw new Error('Failed to retrieve Salesforce credentials');
      }

      const credentialData: SalesforceCredential = JSON.parse(credentials[0].credential_value);
      
      // Check if token needs refresh
      if (await this.isTokenExpired(credentialData)) {
        const refreshedCredential = await this.refreshToken(credentialData, credentialId);
        this.client = createSalesforceClient(refreshedCredential);
      } else {
        this.client = createSalesforceClient(credentialData);
      }

      return this.client;
    } catch (error) {
      console.error('Error initializing Salesforce connection:', error);
      throw error;
    }
  }

  private async isTokenExpired(credential: SalesforceCredential): Promise<boolean> {
    try {
      const testClient = new SalesforceClient(credential);
      const result = await testClient.testConnection();
      return !result.success;
    } catch (error) {
      return true; // Assume expired if test fails
    }
  }

  private async refreshToken(credential: SalesforceCredential, credentialId: string): Promise<SalesforceCredential> {
    try {
      const { data, error } = await supabase.functions.invoke('salesforce-oauth', {
        body: {
          action: 'refresh',
          refreshToken: credential.refresh_token,
          redirectUri: window.location.origin + '/oauth/callback'
        }
      });

      if (error || !data.success) {
        throw new Error('Failed to refresh Salesforce token');
      }

      const newCredential: SalesforceCredential = {
        ...credential,
        access_token: data.tokens.access_token,
        issued_at: data.tokens.issued_at
      };

      // Update stored credential
      await supabase
        .from('service_credentials')
        .update({ 
          credential_value: JSON.stringify(newCredential),
          updated_at: new Date().toISOString()
        })
        .eq('id', credentialId);

      return newCredential;
    } catch (error) {
      console.error('Error refreshing Salesforce token:', error);
      throw error;
    }
  }

  async startOAuthFlow(sandbox = false): Promise<{ authUrl: string; state: string }> {
    try {
      const redirectUri = `${window.location.origin}/oauth/callback`;
      
      const { data, error } = await supabase.functions.invoke('salesforce-oauth', {
        body: {
          action: 'authorize',
          redirectUri,
          sandbox
        }
      });

      if (error || !data.success) {
        throw new Error('Failed to start Salesforce OAuth flow');
      }

      return {
        authUrl: data.authUrl,
        state: data.state
      };
    } catch (error) {
      console.error('Error starting Salesforce OAuth flow:', error);
      throw error;
    }
  }

  async handleOAuthCallback(code: string, state: string, sandbox = false): Promise<{ credentialId: string; instanceUrl: string }> {
    try {
      const redirectUri = `${window.location.origin}/oauth/callback`;
      
      const { data, error } = await supabase.functions.invoke('salesforce-oauth', {
        body: {
          action: 'callback',
          code,
          state,
          redirectUri,
          sandbox
        }
      });

      if (error || !data.success) {
        throw new Error('Failed to complete Salesforce OAuth flow');
      }

      return {
        credentialId: data.credentialId,
        instanceUrl: data.instanceUrl
      };
    } catch (error) {
      console.error('Error handling Salesforce OAuth callback:', error);
      throw error;
    }
  }

  async disconnectSalesforce(credentialId: string): Promise<void> {
    try {
      // Get the credential first to revoke the token
      const { data: credentials, error: getError } = await supabase
        .rpc('get_decrypted_credential_with_logging', {
          p_credential_id: credentialId
        });

      if (!getError && credentials && credentials.length > 0) {
        const credentialData: SalesforceCredential = JSON.parse(credentials[0].credential_value);
        
        // Revoke the token with Salesforce
        await supabase.functions.invoke('salesforce-oauth', {
          body: {
            action: 'revoke',
            refreshToken: credentialData.refresh_token,
            redirectUri: window.location.origin + '/oauth/callback'
          }
        });
      }

      // Delete the credential from our database
      const { error: deleteError } = await supabase
        .from('service_credentials')
        .delete()
        .eq('id', credentialId);

      if (deleteError) {
        throw deleteError;
      }
    } catch (error) {
      console.error('Error disconnecting Salesforce:', error);
      throw error;
    }
  }

  getClient(): SalesforceClient {
    if (!this.client) {
      throw new Error('Salesforce client not initialized. Call initializeConnection first.');
    }
    return this.client;
  }
}

// Export singleton instance
export const salesforceService = new SalesforceService();