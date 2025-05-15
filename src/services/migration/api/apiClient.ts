
import { BaseApiClient } from "./baseClient";
import { CoreApiClient } from "./coreClient";
import { ContactsApiClient } from "./contactsClient";
import { AccountsApiClient } from "./accountsClient";
import { OpportunitiesApiClient } from "./opportunitiesClient";
import { MigrationsApiClient } from "./migrationsClient";

/**
 * Comprehensive API Client that combines all specific API clients
 */
export class ApiClient {
  private baseClient: BaseApiClient;
  private coreClient: CoreApiClient;
  private contactsClient: ContactsApiClient;
  private accountsClient: AccountsApiClient;
  private opportunitiesClient: OpportunitiesApiClient;
  private migrationsClient: MigrationsApiClient;
  
  constructor(apiKey: string = "demo_api_key_123456") {
    this.baseClient = new BaseApiClient(apiKey);
    this.coreClient = new CoreApiClient(apiKey);
    this.contactsClient = new ContactsApiClient(apiKey);
    this.accountsClient = new AccountsApiClient(apiKey);
    this.opportunitiesClient = new OpportunitiesApiClient(apiKey);
    this.migrationsClient = new MigrationsApiClient(apiKey);
  }
  
  // Base client methods
  setApiKey(apiKey: string) {
    this.baseClient.setApiKey(apiKey);
    this.coreClient = new CoreApiClient(apiKey);
    this.contactsClient = new ContactsApiClient(apiKey);
    this.accountsClient = new AccountsApiClient(apiKey);
    this.opportunitiesClient = new OpportunitiesApiClient(apiKey);
    this.migrationsClient = new MigrationsApiClient(apiKey);
  }
  
  getApiKey(): string {
    return this.baseClient.getApiKey();
  }
  
  // Basic HTTP methods - make them public instead of calling protected methods
  async get(url: string, headers?: Record<string, string>) {
    // Use baseClient but delegate to a public method instead of accessing protected one
    return this.baseClient.publicRequest(url, 'GET', undefined, 30000, false);
  }
  
  async post(url: string, data: any, headers?: Record<string, string>) {
    // Use baseClient but delegate to a public method instead of accessing protected one
    return this.baseClient.publicRequest(url, 'POST', data, 30000, false);
  }
  
  // Core API methods
  getSources() {
    return this.coreClient.getSources();
  }
  
  getDestinations() {
    return this.coreClient.getDestinations();
  }
  
  // Contacts methods
  getContacts(source: string, page: number = 1, limit: number = 20) {
    return this.contactsClient.getContacts(source, page, limit);
  }
  
  migrateContacts(params: any) {
    return this.contactsClient.migrateContacts(params);
  }
  
  // Accounts methods
  getAccounts(source: string, page: number = 1, limit: number = 20) {
    return this.accountsClient.getAccounts(source, page, limit);
  }
  
  migrateAccounts(params: any) {
    return this.accountsClient.migrateAccounts(params);
  }
  
  // Opportunities methods
  getOpportunities(source: string, page: number = 1, limit: number = 20) {
    return this.opportunitiesClient.getOpportunities(source, page, limit);
  }
  
  migrateOpportunities(params: any) {
    return this.opportunitiesClient.migrateOpportunities(params);
  }
  
  // Migrations methods
  createMigration(params: any) {
    return this.migrationsClient.createMigration(params);
  }
  
  getMigrationStatus(migrationId: string) {
    return this.migrationsClient.getMigrationStatus(migrationId);
  }
  
  // Webhooks methods
  webhooks = {
    register: async (params: any) => {
      return this.post('webhooks/register', params);
    },
    trigger: async (params: any) => {
      return this.post('webhooks/trigger', params);
    },
    getWebhooks: async () => {
      return this.get('webhooks');
    }
  };
}

// Create a singleton instance of the API client
export const apiClient = new ApiClient();
