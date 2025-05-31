
import { BaseApiClient } from "./baseClient";

/**
 * Client for webhooks-related API operations
 */
export class WebhooksApiClient extends BaseApiClient {
  /**
   * Get all registered webhooks
   */
  async getWebhooks() {
    return this.request<{success: boolean, data: { data: Array<{id: string, url: string}> }}>('webhooks/webhooks');
  }
  
  /**
   * Register a new webhook
   */
  async createWebhook(params: {
    url: string;
    events: string[];
    description?: string;
  }) {
    return this.request<{success: boolean, data: any}>(
      'webhooks/webhooks',
      'POST',
      params
    );
  }
  
  /**
   * Update an existing webhook
   */
  async updateWebhook(webhookId: string, params: {
    url?: string;
    events?: string[];
    description?: string;
    active?: boolean;
  }) {
    return this.request<{success: boolean, data: any}>(
      `webhooks/webhooks/${webhookId}`,
      'PUT',
      params
    );
  }
  
  /**
   * Delete a webhook
   */
  async deleteWebhook(webhookId: string) {
    return this.request<{success: boolean}>(
      `webhooks/webhooks/${webhookId}`,
      'DELETE'
    );
  }
  
  /**
   * Test a webhook
   */
  async testWebhook(webhookId: string) {
    return this.request<{success: boolean, data: any}>(
      `webhooks/webhooks/${webhookId}/test`,
      'POST'
    );
  }
}
