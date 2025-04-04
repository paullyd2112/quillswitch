
import { supabase } from "@/integrations/supabase/client";

// Default API key for demo purposes
const DEFAULT_API_KEY = "demo_api_key_123456";

/**
 * Base API Client for interacting with the CRM Migration API
 */
export class BaseApiClient {
  private apiKey: string;
  
  constructor(apiKey: string = DEFAULT_API_KEY) {
    this.apiKey = apiKey;
  }
  
  /**
   * Set API key for authentication
   */
  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
  }
  
  /**
   * Get API key
   */
  getApiKey(): string {
    return this.apiKey;
  }
  
  /**
   * Make API request to core endpoints
   */
  protected async request<T>(
    endpoint: string, 
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    data?: any
  ): Promise<T> {
    try {
      const { data: responseData, error } = await supabase.functions.invoke(`api-${endpoint}`, {
        method,
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: data,
      });
      
      if (error) {
        throw new Error(`API Error: ${error.message}`);
      }
      
      return responseData as T;
    } catch (error: any) {
      console.error('API request failed:', error);
      throw error;
    }
  }
}
