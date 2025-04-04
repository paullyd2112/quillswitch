
import { BaseApiClient } from "./baseClient";

/**
 * Client for accounts-related API operations
 */
export class AccountsApiClient extends BaseApiClient {
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
}
