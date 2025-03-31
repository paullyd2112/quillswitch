
import { supabase } from "@/integrations/supabase/client";

// Default API key for demo purposes
const DEFAULT_API_KEY = "demo_api_key_123456";

/**
 * Base API Client for interacting with the CRM Migration API
 */
export class ApiClient {
  private apiKey: string;
  
  constructor(apiKey: string = DEFAULT_API_KEY) {
    this.apiKey = apiKey;
  }
  
  /**
   * Set API key for authentication
   */
  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
  }
  
  /**
   * Get API key
   */
  getApiKey(): string {
    return this.apiKey;
  }
  
  /**
   * Make API request to core endpoints
   */
  private async request<T>(
    endpoint: string, 
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    data?: any
  ): Promise<T> {
    try {
      const { data: responseData, error } = await supabase.functions.invoke(`api-${endpoint}`, {
        method,
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: data,
      });
      
      if (error) {
        throw new Error(`API Error: ${error.message}`);
      }
      
      return responseData as T;
    } catch (error: any) {
      console.error('API request failed:', error);
      throw error;
    }
  }
  
  /**
   * Get available source CRMs
   */
  async getSources() {
    return this.request<{success: boolean, data: any}>('core/sources');
  }
  
  /**
   * Get available destination CRMs
   */
  async getDestinations() {
    return this.request<{success: boolean, data: any}>('core/destinations');
  }
  
  /**
   * Get contacts from source CRM
   */
  async getContacts(source: string, page: number = 1, limit: number = 20) {
    return this.request<{success: boolean, data: any, meta: any}>(
      `contacts/contacts?source=${source}&page=${page}&limit=${limit}`
    );
  }
  
  /**
   * Start contact migration
   */
  async migrateContacts(params: {
    source: string;
    destination: string;
    filters?: Record<string, any>;
    fieldMapping: Record<string, string>;
  }) {
    return this.request<{success: boolean, data: any}>(
      'contacts/migrate',
      'POST',
      params
    );
  }
  
  /**
   * Get accounts/companies from source CRM
   */
  async getAccounts(source: string, page: number = 1, limit: number = 20) {
    return this.request<{success: boolean, data: any, meta: any}>(
      `accounts/accounts?source=${source}&page=${page}&limit=${limit}`
    );
  }
  
  /**
   * Start account migration
   */
  async migrateAccounts(params: {
    source: string;
    destination: string;
    filters?: Record<string, any>;
    fieldMapping: Record<string, string>;
  }) {
    return this.request<{success: boolean, data: any}>(
      'accounts/migrate',
      'POST',
      params
    );
  }
  
  /**
   * Get opportunities/deals from source CRM
   */
  async getOpportunities(source: string, page: number = 1, limit: number = 20) {
    return this.request<{success: boolean, data: any, meta: any}>(
      `opportunities/opportunities?source=${source}&page=${page}&limit=${limit}`
    );
  }
  
  /**
   * Start opportunity migration
   */
  async migrateOpportunities(params: {
    source: string;
    destination: string;
    filters?: Record<string, any>;
    fieldMapping: Record<string, string>;
    stageMapping?: Record<string, string>;
  }) {
    return this.request<{success: boolean, data: any}>(
      'opportunities/migrate',
      'POST',
      params
    );
  }
  
  /**
   * Create a new migration job
   */
  async createMigration(params: {
    name: string;
    source: {
      type: string;
      credentials: Record<string, string>;
    };
    destination: {
      type: string;
      credentials: Record<string, string>;
    };
    dataTypes: Array<{
      type: string;
      filters?: Record<string, any>;
      fieldMapping: Record<string, string>;
    }>;
    schedule?: {
      startNow: boolean;
    };
    options?: Record<string, any>;
  }) {
    return this.request<{success: boolean, data: any}>(
      'migrations/migrations',
      'POST',
      params
    );
  }
  
  /**
   * Get migration status
   */
  async getMigrationStatus(migrationId: string) {
    return this.request<{success: boolean, data: any}>(
      `migrations/${migrationId}`
    );
  }
  
  /**
   * Register a new webhook
   */
  async registerWebhook(params: {
    url: string;
    events: string[];
    secret?: string;
  }) {
    return this.request<{success: boolean, data: any}>(
      'webhooks/webhooks',
      'POST',
      params
    );
  }
  
  /**
   * List registered webhooks
   */
  async getWebhooks() {
    return this.request<{success: boolean, data: any}>(
      'webhooks/webhooks'
    );
  }
  
  /**
   * Delete a webhook
   */
  async deleteWebhook(webhookId: string) {
    return this.request<{success: boolean, data: any}>(
      `webhooks/${webhookId}`,
      'DELETE'
    );
  }
  
  /**
   * Test a webhook
   */
  async testWebhook(webhookId: string) {
    return this.request<{success: boolean, data: any}>(
      'webhooks/test',
      'POST',
      { webhookId }
    );
  }
}

// Export a singleton instance
export const apiClient = new ApiClient();

// Export the ApiClient class for dependency injection or testing
export default ApiClient;
