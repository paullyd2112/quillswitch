
import { BaseApiClient } from './baseClient';
import { CoreApiClient } from './coreClient';
import { ContactsApiClient } from './contactsClient';
import { AccountsApiClient } from './accountsClient';
import { OpportunitiesApiClient } from './opportunitiesClient';
import { MigrationsApiClient } from './migrationsClient';
import { WebhooksApiClient } from './webhooksClient';

/**
 * Composite API Client that combines all specialized clients
 */
export class ApiClient extends BaseApiClient {
  public core: CoreApiClient;
  public contacts: ContactsApiClient;
  public accounts: AccountsApiClient;
  public opportunities: OpportunitiesApiClient;
  public migrations: MigrationsApiClient;
  public webhooks: WebhooksApiClient;
  
  constructor(apiKey?: string) {
    super(apiKey);
    
    // Initialize specialized clients with the same API key
    this.core = new CoreApiClient(this.getApiKey());
    this.contacts = new ContactsApiClient(this.getApiKey());
    this.accounts = new AccountsApiClient(this.getApiKey());
    this.opportunities = new OpportunitiesApiClient(this.getApiKey());
    this.migrations = new MigrationsApiClient(this.getApiKey());
    this.webhooks = new WebhooksApiClient(this.getApiKey());
  }
  
  /**
   * Override setApiKey to propagate changes to all specialized clients
   */
  setApiKey(apiKey: string) {
    super.setApiKey(apiKey);
    
    // Update API key in all specialized clients
    this.core.setApiKey(apiKey);
    this.contacts.setApiKey(apiKey);
    this.accounts.setApiKey(apiKey);
    this.opportunities.setApiKey(apiKey);
    this.migrations.setApiKey(apiKey);
    this.webhooks.setApiKey(apiKey);
  }
  
  // Forward methods from specialized clients for backward compatibility
  
  // Core
  getSources = () => this.core.getSources();
  getDestinations = () => this.core.getDestinations();
  
  // Contacts
  getContacts = (source: string, page?: number, limit?: number) => 
    this.contacts.getContacts(source, page, limit);
  migrateContacts = (params: Parameters<ContactsApiClient['migrateContacts']>[0]) => 
    this.contacts.migrateContacts(params);
  
  // Accounts
  getAccounts = (source: string, page?: number, limit?: number) => 
    this.accounts.getAccounts(source, page, limit);
  migrateAccounts = (params: Parameters<AccountsApiClient['migrateAccounts']>[0]) => 
    this.accounts.migrateAccounts(params);
  
  // Opportunities
  getOpportunities = (source: string, page?: number, limit?: number) => 
    this.opportunities.getOpportunities(source, page, limit);
  migrateOpportunities = (params: Parameters<OpportunitiesApiClient['migrateOpportunities']>[0]) => 
    this.opportunities.migrateOpportunities(params);
  
  // Migrations
  createMigration = (params: Parameters<MigrationsApiClient['createMigration']>[0]) => 
    this.migrations.createMigration(params);
  getMigrationStatus = (migrationId: string) => 
    this.migrations.getMigrationStatus(migrationId);
  
  // Webhooks
  registerWebhook = (params: Parameters<WebhooksApiClient['registerWebhook']>[0]) => 
    this.webhooks.registerWebhook(params);
  getWebhooks = () => this.webhooks.getWebhooks();
  deleteWebhook = (webhookId: string) => this.webhooks.deleteWebhook(webhookId);
  testWebhook = (webhookId: string) => this.webhooks.testWebhook(webhookId);
}

// Export a singleton instance
export const apiClient = new ApiClient();

// Export the ApiClient class for dependency injection or testing
export default ApiClient;
