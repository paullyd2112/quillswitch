
import { BaseApiClient } from "./baseClient";

/**
 * Client for opportunities-related API operations
 */
export class OpportunitiesApiClient extends BaseApiClient {
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
}
