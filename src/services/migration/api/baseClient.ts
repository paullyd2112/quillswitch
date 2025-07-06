import { supabase } from "@/integrations/supabase/client";
import { handleError } from "@/utils/errorHandling";
import { RateLimiter } from "./utils/rateLimiter";
import { PaginationHandler, PaginationParams, PaginatedResponse } from "./utils/paginationHandler";

// Production API key will be retrieved from Supabase secrets
const getUnifiedApiKey = async (): Promise<string> => {
  // In edge functions, this would use Deno.env.get('UNIFIED_API_KEY')
  // In client code, we'll need to make a secure call to get the key
  return "production_api_key"; // Placeholder - will be replaced by secure key retrieval
};

export class BaseApiClient {
  private apiKey: string;
  private rateLimiter: RateLimiter;
  private requestTimeouts: Map<string, number> = new Map();
  private retryCount: Map<string, number> = new Map();
  private maxRetries = 3;
  private retryDelay = 1000; // ms
  
  constructor(
    apiKey?: string,
    requestsPerSecond: number = 10
  ) {
    // Use provided key or get from secure storage
    this.apiKey = apiKey || "production_api_key"; // Will be replaced with actual secure key
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

  /**
   * Public request method that can be called from outside this class
   * This is a wrapper around the protected request method
   */
  public async publicRequest<T>(
    endpoint: string, 
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    data?: any,
    timeoutMs: number = 30000,
    skipRetry: boolean = false,
    paginationParams?: PaginationParams
  ): Promise<T> {
    return this.request<T>(endpoint, method, data, timeoutMs, skipRetry, paginationParams);
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
