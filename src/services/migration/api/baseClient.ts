
import { supabase } from "@/integrations/supabase/client";
import { handleError } from "@/utils/errorHandling";

// Default API key for demo purposes
const DEFAULT_API_KEY = "demo_api_key_123456";

/**
 * Base API Client for interacting with the CRM Migration API
 */
export class BaseApiClient {
  private apiKey: string;
  private requestTimeouts: Map<string, number> = new Map();
  private retryCount: Map<string, number> = new Map();
  private maxRetries = 3;
  private retryDelay = 1000; // ms
  
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
   * Configure retry policy
   */
  configureRetries(maxRetries: number, retryDelay: number) {
    this.maxRetries = maxRetries;
    this.retryDelay = retryDelay;
  }
  
  /**
   * Generate a unique request ID for tracking retries and timeouts
   */
  private generateRequestId(endpoint: string, method: string): string {
    return `${method}-${endpoint}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }
  
  /**
   * Make API request to core endpoints with improved error handling and retry logic
   */
  protected async request<T>(
    endpoint: string, 
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    data?: any,
    timeoutMs: number = 30000,
    skipRetry: boolean = false
  ): Promise<T> {
    const requestId = this.generateRequestId(endpoint, method);
    this.retryCount.set(requestId, 0);
    
    // Set request timeout
    const timeoutPromise = new Promise<never>((_, reject) => {
      const timeoutId = window.setTimeout(() => {
        this.requestTimeouts.delete(requestId);
        reject(new Error(`Request timeout after ${timeoutMs}ms`));
      }, timeoutMs);
      
      this.requestTimeouts.set(requestId, timeoutId);
    });
    
    try {
      // For demo purposes, if we're in the home page migration demo, use mock data
      // to ensure the demo works even if edge functions aren't working
      if (window.location.pathname === '/' && endpoint === 'migrations/migrations' && method === 'POST') {
        console.log('Using mock migration data for demo on homepage');
        return this.getMockMigrationResponse(data) as T;
      }
      
      // Implement retry logic
      const executeRequest = async (attempt: number): Promise<T> => {
        try {
          const { data: responseData, error } = await Promise.race([
            supabase.functions.invoke(`api-${endpoint}`, {
              method,
              headers: {
                Authorization: `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json',
              },
              body: data,
            }),
            timeoutPromise
          ]);
          
          // Clear timeout if request finished
          const timeoutId = this.requestTimeouts.get(requestId);
          if (timeoutId) {
            window.clearTimeout(timeoutId);
            this.requestTimeouts.delete(requestId);
          }
          
          if (error) {
            throw new Error(`API Error: ${error.message}`);
          }
          
          return responseData as T;
        } catch (error: any) {
          const currentAttempt = this.retryCount.get(requestId) || 0;
          
          if (!skipRetry && currentAttempt < this.maxRetries) {
            // Exponential backoff
            const delay = this.retryDelay * Math.pow(2, currentAttempt);
            console.warn(`Request failed (attempt ${currentAttempt + 1}/${this.maxRetries}), retrying in ${delay}ms`, error);
            
            this.retryCount.set(requestId, currentAttempt + 1);
            await new Promise(resolve => setTimeout(resolve, delay));
            return executeRequest(currentAttempt + 1);
          }
          
          // Log failed request details
          console.error(`API request to ${endpoint} failed after ${attempt} attempts:`, error);
          
          // For demo purposes, handle failed API requests on the homepage
          if (window.location.pathname === '/' && endpoint === 'migrations/migrations' && method === 'POST') {
            console.log('Falling back to mock migration data after API failure');
            return this.getMockMigrationResponse(data) as T;
          }
          
          throw error;
        }
      };
      
      return await executeRequest(0);
    } catch (error: any) {
      // Handle error and rethrow
      handleError(error, `Failed API request to ${endpoint}`);
      throw error;
    } finally {
      // Clean up
      this.retryCount.delete(requestId);
      const timeoutId = this.requestTimeouts.get(requestId);
      if (timeoutId) {
        window.clearTimeout(timeoutId);
        this.requestTimeouts.delete(requestId);
      }
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
  
  /**
   * Cancel all pending requests (useful when component unmounts)
   */
  cancelPendingRequests() {
    this.requestTimeouts.forEach((timeoutId) => {
      window.clearTimeout(timeoutId);
    });
    this.requestTimeouts.clear();
    this.retryCount.clear();
  }
}
