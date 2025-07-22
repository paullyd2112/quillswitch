
import { BaseApiClient } from './baseClient';
import { CoreApiClient } from './coreClient';
import { ContactsApiClient } from './contactsClient';
import { AccountsApiClient } from './accountsClient';
import { OpportunitiesApiClient } from './opportunitiesClient';
import { WebhooksApiClient } from './webhooksClient';

/**
 * Migration API Client - Production version
 * Integrates with Native CRM Engine and production services
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
   * Create a migration project
   */
  public async createMigration(migrationData: MigrationData): Promise<MigrationResponse> {
    console.log("Creating migration project:", migrationData);
    
    try {
      const response = await this.request<{success: boolean, data?: any, error?: string}>(
        'migrations/migrations',
        'POST',
        migrationData
      );
      
      if (!response.success) {
        throw new Error(`Migration creation failed: ${response.error || 'Unknown error'}`);
      }
      
      return {
        data: {
          migrationId: response.data.migrationId || response.data.id,
          status: response.data.status || 'initiated'
        }
      };
    } catch (error) {
      console.error("Migration creation failed:", error);
      throw error;
    }
  }

  /**
   * Get migration status
   */
  public async getMigrationStatus(migrationId: string): Promise<{ status: string; progress: number }> {
    console.log("Getting migration status for:", migrationId);
    
    try {
      const response = await this.request<{success: boolean, data?: any, error?: string}>(
        `migrations/${migrationId}`,
        'GET'
      );
      
      if (!response.success) {
        throw new Error(`Failed to get migration status: ${response.error || 'Unknown error'}`);
      }
      
      return {
        status: response.data.status || 'unknown',
        progress: response.data.progress || 0
      };
    } catch (error) {
      console.error("Failed to get migration status:", error);
      throw error;
    }
  }

  /**
   * Execute migration for a specific object type
   */
  public async executeMigration(params: {
    projectId: string;
    destinationConnectionId: string;
    objectType: string;
    batchSize?: number;
  }): Promise<{success: boolean, migratedCount: number, failedCount: number}> {
    try {
      const response = await this.request<{success: boolean, migrated_count: number, failed_count: number}>(
        'unified-migration-execute',
        'POST',
        {
          project_id: params.projectId,
          destination_connection_id: params.destinationConnectionId,
          object_type: params.objectType,
          batch_size: params.batchSize || 50
        }
      );
      
      return {
        success: response.success,
        migratedCount: response.migrated_count || 0,
        failedCount: response.failed_count || 0
      };
    } catch (error) {
      console.error("Migration execution failed:", error);
      throw error;
    }
  }
}

// Export singleton instance
export const apiClient = ApiClient.getInstance();
