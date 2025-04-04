
import { BaseApiClient } from "./baseClient";

/**
 * Client for webhooks-related API operations
 */
export class WebhooksApiClient extends BaseApiClient {
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
