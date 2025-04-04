
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
      // For demo purposes, if we're in the home page migration demo, use mock data
      // to ensure the demo works even if edge functions aren't working
      if (window.location.pathname === '/' && endpoint === 'migrations/migrations' && method === 'POST') {
        console.log('Using mock migration data for demo on homepage');
        return this.getMockMigrationResponse(data) as T;
      }
      
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
      
      // For demo purposes, handle failed API requests on the homepage
      if (window.location.pathname === '/' && endpoint === 'migrations/migrations' && method === 'POST') {
        console.log('Falling back to mock migration data after API failure');
        return this.getMockMigrationResponse(data) as T;
      }
      
      throw error;
    }
  }
  
  /**
   * Generate mock migration response for demo
   */
  private getMockMigrationResponse(requestData: any): any {
    const migrationId = `mig_${Math.floor(Math.random() * 1000000)}`;
    
    return {
      success: true,
      data: {
        migrationId,
        name: requestData.name || "Demo CRM Migration",
        status: "scheduled",
        createdAt: new Date().toISOString(),
        estimatedCompletionTime: new Date(Date.now() + 45 * 60000).toISOString()
      }
    };
  }
}
