
import { BaseApiClient } from "./baseClient";

/**
 * Client for contacts-related API operations
 */
export class ContactsApiClient extends BaseApiClient {
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
}
