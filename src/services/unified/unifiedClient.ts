import UnifiedTo from '@unified-api/typescript-sdk';

/**
 * Unified.to API Client
 * Provides access to CRM data through Unified.to's unified API
 */
export class UnifiedClient {
  private apiKey: string;
  private static instance: UnifiedClient;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || '';
  }

  public static getInstance(apiKey?: string): UnifiedClient {
    if (!UnifiedClient.instance) {
      UnifiedClient.instance = new UnifiedClient(apiKey);
    }
    return UnifiedClient.instance;
  }

  /**
   * Set API key for authentication
   */
  public setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
  }

  /**
   * Get API key
   */
  public getApiKey(): string {
    return this.apiKey;
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const baseUrl = 'https://api.unified.to';
    const url = `${baseUrl}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Unified.to API error: ${response.status} ${errorText}`);
    }

    return response.json();
  }

  /**
   * Get activated integrations for a workspace
   */
  public async getActivatedIntegrations(workspaceId: string, categories?: string[]) {
    try {
      const params = new URLSearchParams();
      if (categories) {
        params.append('categories', categories.join(','));
      }
      
      const endpoint = `/unified/integrations/${workspaceId}${params.toString() ? '?' + params.toString() : ''}`;
      return await this.makeRequest(endpoint);
    } catch (error) {
      console.error('Error fetching activated integrations:', error);
      throw error;
    }
  }

  /**
   * Get CRM integrations specifically
   */
  public async getCrmIntegrations(workspaceId: string) {
    return this.getActivatedIntegrations(workspaceId, ['crm']);
  }

  /**
   * Create an authorization URL for a specific integration
   */
  public async createAuthUrl(params: {
    workspaceId: string;
    integrationType: string;
    redirectUri: string;
    state?: string;
  }) {
    try {
      const endpoint = `/unified/integrations/auth/${params.integrationType}`;
      return await this.makeRequest(endpoint, {
        method: 'POST',
        body: JSON.stringify({
          workspace_id: params.workspaceId,
          redirect_uri: params.redirectUri,
          state: params.state,
        }),
      });
    } catch (error) {
      console.error('Error creating auth URL:', error);
      throw error;
    }
  }

  /**
   * Exchange authorization code for connection
   */
  public async createConnection(params: {
    workspaceId: string;
    integrationType: string;
    code: string;
    redirectUri: string;
  }) {
    try {
      const endpoint = '/unified/connections';
      return await this.makeRequest(endpoint, {
        method: 'POST',
        body: JSON.stringify({
          workspace_id: params.workspaceId,
          integration_type: params.integrationType,
          code: params.code,
          redirect_uri: params.redirectUri,
        }),
      });
    } catch (error) {
      console.error('Error creating connection:', error);
      throw error;
    }
  }

  /**
   * Get all connections for a workspace
   */
  public async getConnections(workspaceId: string) {
    try {
      const endpoint = `/unified/connections/${workspaceId}`;
      return await this.makeRequest(endpoint);
    } catch (error) {
      console.error('Error fetching connections:', error);
      throw error;
    }
  }

  /**
   * Get CRM contacts from a specific connection
   */
  public async getCrmContacts(connectionId: string, params?: {
    limit?: number;
    offset?: number;
    updatedGte?: string;
  }) {
    try {
      const searchParams = new URLSearchParams();
      if (params?.limit) searchParams.append('limit', params.limit.toString());
      if (params?.offset) searchParams.append('offset', params.offset.toString());
      if (params?.updatedGte) searchParams.append('updated_gte', params.updatedGte);

      const endpoint = `/crm/${connectionId}/contacts${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
      return await this.makeRequest(endpoint);
    } catch (error) {
      console.error('Error fetching CRM contacts:', error);
      throw error;
    }
  }

  /**
   * Get CRM companies/accounts from a specific connection
   */
  public async getCrmCompanies(connectionId: string, params?: {
    limit?: number;
    offset?: number;
    updatedGte?: string;
  }) {
    try {
      const searchParams = new URLSearchParams();
      if (params?.limit) searchParams.append('limit', params.limit.toString());
      if (params?.offset) searchParams.append('offset', params.offset.toString());
      if (params?.updatedGte) searchParams.append('updated_gte', params.updatedGte);

      const endpoint = `/crm/${connectionId}/companies${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
      return await this.makeRequest(endpoint);
    } catch (error) {
      console.error('Error fetching CRM companies:', error);
      throw error;
    }
  }

  /**
   * Get CRM opportunities/deals from a specific connection
   */
  public async getCrmDeals(connectionId: string, params?: {
    limit?: number;
    offset?: number;
    updatedGte?: string;
  }) {
    try {
      const searchParams = new URLSearchParams();
      if (params?.limit) searchParams.append('limit', params.limit.toString());
      if (params?.offset) searchParams.append('offset', params.offset.toString());
      if (params?.updatedGte) searchParams.append('updated_gte', params.updatedGte);

      const endpoint = `/crm/${connectionId}/deals${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
      return await this.makeRequest(endpoint);
    } catch (error) {
      console.error('Error fetching CRM deals:', error);
      throw error;
    }
  }

  /**
   * Create CRM contacts in destination
   */
  public async createCrmContacts(connectionId: string, contacts: any[]) {
    try {
      const results = [];
      for (const contact of contacts) {
        const endpoint = `/crm/${connectionId}/contacts`;
        const response = await this.makeRequest(endpoint, {
          method: 'POST',
          body: JSON.stringify(contact),
        });
        results.push(response);
      }
      return results;
    } catch (error) {
      console.error('Error creating CRM contacts:', error);
      throw error;
    }
  }

  /**
   * Create CRM companies in destination
   */
  public async createCrmCompanies(connectionId: string, companies: any[]) {
    try {
      const results = [];
      for (const company of companies) {
        const endpoint = `/crm/${connectionId}/companies`;
        const response = await this.makeRequest(endpoint, {
          method: 'POST',
          body: JSON.stringify(company),
        });
        results.push(response);
      }
      return results;
    } catch (error) {
      console.error('Error creating CRM companies:', error);
      throw error;
    }
  }

  /**
   * Create CRM deals in destination
   */
  public async createCrmDeals(connectionId: string, deals: any[]) {
    try {
      const results = [];
      for (const deal of deals) {
        const endpoint = `/crm/${connectionId}/deals`;
        const response = await this.makeRequest(endpoint, {
          method: 'POST',
          body: JSON.stringify(deal),
        });
        results.push(response);
      }
      return results;
    } catch (error) {
      console.error('Error creating CRM deals:', error);
      throw error;
    }
  }

  /**
   * Get webhook events for a connection
   */
  public async getWebhookEvents(connectionId: string) {
    try {
      const endpoint = `/unified/webhooks/${connectionId}`;
      return await this.makeRequest(endpoint);
    } catch (error) {
      console.error('Error fetching webhook events:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const unifiedClient = UnifiedClient.getInstance();