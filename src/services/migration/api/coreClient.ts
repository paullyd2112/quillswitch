
import { BaseApiClient } from "./baseClient";

/**
 * Client for core API operations
 */
export class CoreApiClient extends BaseApiClient {
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
}
