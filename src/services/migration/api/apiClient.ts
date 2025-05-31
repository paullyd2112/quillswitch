
import { BaseApiClient } from './baseClient';
import { CoreApiClient } from './coreClient';
import { ContactsApiClient } from './contactsClient';
import { AccountsApiClient } from './accountsClient';
import { OpportunitiesApiClient } from './opportunitiesClient';
import { WebhooksApiClient } from './webhooksClient';

/**
 * Migration API Client - Demo version
 * This provides mock functionality for demonstration purposes
 */

export interface MigrationData {
  name: string;
  source: {
    type: string;
    credentials: Record<string, any>;
  };
  destination: {
    type: string;
    credentials: Record<string, any>;
  };
  dataTypes: Array<{
    type: string;
    filters?: Record<string, any>;
    fieldMapping?: Record<string, string>;
  }>;
  schedule: {
    startNow: boolean;
  };
}

export interface MigrationResponse {
  data: {
    migrationId: string;
    status: string;
  };
}

/**
 * Main API Client class that composes all specialized clients
 */
export class ApiClient extends BaseApiClient {
  private static instance: ApiClient;
  
  // Specialized client instances
  private coreClient: CoreApiClient;
  private contactsClient: ContactsApiClient;
  private accountsClient: AccountsApiClient;
  private opportunitiesClient: OpportunitiesApiClient;
  public webhooks: WebhooksApiClient;

  constructor(apiKey?: string) {
    super(apiKey);
    
    // Initialize specialized clients
    this.coreClient = new CoreApiClient(apiKey);
    this.contactsClient = new ContactsApiClient(apiKey);
    this.accountsClient = new AccountsApiClient(apiKey);
    this.opportunitiesClient = new OpportunitiesApiClient(apiKey);
    this.webhooks = new WebhooksApiClient(apiKey);
  }

  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  /**
   * Set API key for all clients
   */
  public setApiKey(apiKey: string): void {
    super.setApiKey(apiKey);
    this.coreClient.setApiKey(apiKey);
    this.contactsClient.setApiKey(apiKey);
    this.accountsClient.setApiKey(apiKey);
    this.opportunitiesClient.setApiKey(apiKey);
    this.webhooks.setApiKey(apiKey);
  }

  /**
   * Get API key
   */
  public getApiKey(): string {
    return super.getApiKey();
  }

  // Core API methods
  public async getSources() {
    return this.coreClient.getSources();
  }

  public async getDestinations() {
    return this.coreClient.getDestinations();
  }

  // Contacts API methods
  public async getContacts(source: string, page: number = 1, limit: number = 20) {
    return this.contactsClient.getContacts(source, page, limit);
  }

  public async migrateContacts(params: {
    source: string;
    destination: string;
    filters?: Record<string, any>;
    fieldMapping: Record<string, string>;
  }) {
    return this.contactsClient.migrateContacts(params);
  }

  // Accounts API methods
  public async getAccounts(source: string, page: number = 1, limit: number = 20) {
    return this.accountsClient.getAccounts(source, page, limit);
  }

  public async migrateAccounts(params: {
    source: string;
    destination: string;
    filters?: Record<string, any>;
    fieldMapping: Record<string, string>;
  }) {
    return this.accountsClient.migrateAccounts(params);
  }

  // Opportunities API methods
  public async getOpportunities(source: string, page: number = 1, limit: number = 20) {
    return this.opportunitiesClient.getOpportunities(source, page, limit);
  }

  public async migrateOpportunities(params: {
    source: string;
    destination: string;
    filters?: Record<string, any>;
    fieldMapping: Record<string, string>;
    stageMapping?: Record<string, string>;
  }) {
    return this.opportunitiesClient.migrateOpportunities(params);
  }

  /**
   * Create a migration (demo version)
   */
  public async createMigration(migrationData: MigrationData): Promise<MigrationResponse> {
    console.log("Demo API: Creating migration with data:", migrationData);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Generate mock response
    const response: MigrationResponse = {
      data: {
        migrationId: `demo_migration_${Date.now()}`,
        status: 'initiated'
      }
    };
    
    console.log("Demo API: Migration created successfully:", response);
    return response;
  }

  /**
   * Get migration status (demo version)
   */
  public async getMigrationStatus(migrationId: string): Promise<{ status: string; progress: number }> {
    console.log("Demo API: Getting status for migration:", migrationId);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      status: 'running',
      progress: Math.floor(Math.random() * 100)
    };
  }
}

// Export singleton instance
export const apiClient = ApiClient.getInstance();
