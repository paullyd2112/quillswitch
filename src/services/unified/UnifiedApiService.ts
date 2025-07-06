import { supabase } from '@/integrations/supabase/client';

export interface UnifiedConnection {
  id: string;
  type: string;
  name: string;
  status: 'connected' | 'disconnected' | 'error';
  created_at: string;
  last_sync?: string;
}

export interface ConnectionHealth {
  status: 'healthy' | 'warning' | 'error';
  lastCheck: Date;
  issues: string[];
}

/**
 * Service for managing Unified.to API integrations
 * Replaces OAuth-specific logic with unified API management
 */
export class UnifiedApiService {
  private static instance: UnifiedApiService;

  public static getInstance(): UnifiedApiService {
    if (!UnifiedApiService.instance) {
      UnifiedApiService.instance = new UnifiedApiService();
    }
    return UnifiedApiService.instance;
  }

  /**
   * Get available integration types
   */
  async getAvailableIntegrations(): Promise<{id: string, name: string, category: string}[]> {
    try {
      const { data, error } = await supabase.functions.invoke('unified-get-schema', {
        method: 'GET'
      });

      if (error) throw error;

      return data.integrations || [
        { id: 'salesforce', name: 'Salesforce', category: 'crm' },
        { id: 'hubspot', name: 'HubSpot', category: 'crm' },
        { id: 'zoho', name: 'Zoho CRM', category: 'crm' },
        { id: 'pipedrive', name: 'Pipedrive', category: 'crm' },
        { id: 'dynamics365', name: 'Microsoft Dynamics 365', category: 'crm' }
      ];
    } catch (error) {
      console.error('Failed to get available integrations:', error);
      // Fallback to default list
      return [
        { id: 'salesforce', name: 'Salesforce', category: 'crm' },
        { id: 'hubspot', name: 'HubSpot', category: 'crm' },
        { id: 'zoho', name: 'Zoho CRM', category: 'crm' },
        { id: 'pipedrive', name: 'Pipedrive', category: 'crm' },
        { id: 'dynamics365', name: 'Microsoft Dynamics 365', category: 'crm' }
      ];
    }
  }

  /**
   * Initiate connection to a CRM system
   */
  async initiateConnection(integrationId: string, returnUrl?: string): Promise<{authUrl: string}> {
    try {
      const { data, error } = await supabase.functions.invoke('unified-oauth-authorize', {
        method: 'POST',
        body: {
          integration_id: integrationId,
          return_url: returnUrl || `${window.location.origin}/app/connections`
        }
      });

      if (error) throw error;

      return { authUrl: data.auth_url };
    } catch (error) {
      console.error('Failed to initiate connection:', error);
      throw new Error('Failed to start connection process. Please try again.');
    }
  }

  /**
   * Get user's active connections
   */
  async getUserConnections(): Promise<UnifiedConnection[]> {
    try {
      // Get connections from service_credentials table
      const { data: credentials, error } = await supabase
        .from('service_credentials')
        .select('*')
        .eq('credential_type', 'unified_connection')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (credentials || []).map(cred => ({
        id: cred.id,
        type: cred.service_name,
        name: cred.credential_name,
        status: 'connected' as const,
        created_at: cred.created_at,
        last_sync: cred.last_used
      }));
    } catch (error) {
      console.error('Failed to get user connections:', error);
      return [];
    }
  }

  /**
   * Test connection health
   */
  async testConnection(connectionId: string): Promise<ConnectionHealth> {
    try {
      const { data, error } = await supabase.functions.invoke('test-unified', {
        method: 'POST',
        body: { connection_id: connectionId }
      });

      if (error) throw error;

      return {
        status: data.success ? 'healthy' : 'error',
        lastCheck: new Date(),
        issues: data.issues || []
      };
    } catch (error) {
      console.error('Connection test failed:', error);
      return {
        status: 'error',
        lastCheck: new Date(),
        issues: ['Failed to test connection']
      };
    }
  }

  /**
   * Remove a connection
   */
  async removeConnection(connectionId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('service_credentials')
        .delete()
        .eq('id', connectionId);

      if (error) throw error;

      console.log('Connection removed successfully');
    } catch (error) {
      console.error('Failed to remove connection:', error);
      throw new Error('Failed to remove connection. Please try again.');
    }
  }

  /**
   * Get schema information for a connected system
   */
  async getConnectionSchema(connectionId: string): Promise<{
    objects: Array<{name: string, fields: Array<{name: string, type: string, required: boolean}>}>
  }> {
    try {
      const { data, error } = await supabase.functions.invoke('unified-get-schema', {
        method: 'POST',
        body: { connection_id: connectionId }
      });

      if (error) throw error;

      return data.schema || { objects: [] };
    } catch (error) {
      console.error('Failed to get connection schema:', error);
      return { objects: [] };
    }
  }
}

export const unifiedApiService = UnifiedApiService.getInstance();