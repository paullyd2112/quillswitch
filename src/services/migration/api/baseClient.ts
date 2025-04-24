import { supabase } from "@/integrations/supabase/client";
import { handleError } from "@/utils/errorHandling";
import { RateLimiter } from "./utils/rateLimiter";
import { PaginationHandler, PaginationParams, PaginatedResponse } from "./utils/paginationHandler";

const DEFAULT_API_KEY = "demo_api_key_123456";

export class BaseApiClient {
  private apiKey: string;
  private rateLimiter: RateLimiter;
  private requestTimeouts: Map<string, number> = new Map();
  private retryCount: Map<string, number> = new Map();
  private maxRetries = 3;
  private retryDelay = 1000; // ms
  
  constructor(
    apiKey: string = DEFAULT_API_KEY,
    requestsPerSecond: number = 10
  ) {
    this.apiKey = apiKey;
    this.rateLimiter = new RateLimiter(requestsPerSecond);
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

  protected async request<T>(
    endpoint: string, 
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    data?: any,
    timeoutMs: number = 30000,
    skipRetry: boolean = false,
    paginationParams?: PaginationParams
  ): Promise<T> {
    const requestId = this.generateRequestId(endpoint, method);
    this.retryCount.set(requestId, 0);
    
    return this.rateLimiter.add(async () => {
      try {
        // For demo purposes, if we're in the home page migration demo, use mock data
        // to ensure the demo works even if edge functions aren't working
        if (window.location.pathname === '/' && endpoint === 'migrations/migrations' && method === 'POST') {
          console.log('Using mock migration data for demo on homepage');
          return this.getMockMigrationResponse(data) as T;
        }

        const params = new URLSearchParams();
        if (paginationParams) {
          Object.entries(paginationParams).forEach(([key, value]) => {
            if (value !== undefined) {
              params.append(key, String(value));
            }
          });
        }

        const urlWithParams = `${endpoint}${params.toString() ? '?' + params.toString() : ''}`;

        const { data: responseData, error } = await Promise.race([
          supabase.functions.invoke(`api-${urlWithParams}`, {
            method,
            headers: {
              Authorization: `Bearer ${this.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: data,
          }),
          new Promise<never>((_, reject) => {
            const timeoutId = window.setTimeout(() => {
              this.requestTimeouts.delete(requestId);
              reject(new Error(`Request timeout after ${timeoutMs}ms`));
            }, timeoutMs);
            this.requestTimeouts.set(requestId, timeoutId);
          })
        ]);

        if (error) {
          throw new Error(`API Error: ${error.message}`);
        }

        return responseData as T;
      } catch (error: any) {
        handleError(error, `Failed API request to ${endpoint}`);
        throw error;
      } finally {
        const timeoutId = this.requestTimeouts.get(requestId);
        if (timeoutId) {
          window.clearTimeout(timeoutId);
          this.requestTimeouts.delete(requestId);
        }
      }
    });
  }

  protected async fetchAllPages<T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    options: {
      data?: any;
      maxItems?: number;
      onProgress?: (items: T[], total: number) => void;
    } = {}
  ): Promise<T[]> {
    const fetchPage = async (params: PaginationParams): Promise<PaginatedResponse<T>> => {
      return this.request(endpoint, method, options.data, 30000, false, params);
    };

    return PaginationHandler.fetchAll(fetchPage, {
      maxItems: options.maxItems,
      onProgress: options.onProgress
    });
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
