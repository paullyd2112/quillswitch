
export class RateLimiter {
  private queue: Array<() => Promise<any>> = [];
  private processing = false;
  private lastRequestTime = 0;
  
  constructor(
    private requestsPerSecond: number = 10,
    private minRequestInterval: number = 100 // ms
  ) {}

  async add<T>(request: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await this.executeWithBackoff(request);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
      
      this.processQueue();
    });
  }

  private async executeWithBackoff(
    request: () => Promise<any>,
    retryCount = 0,
    maxRetries = 3
  ): Promise<any> {
    try {
      await this.waitForInterval();
      const result = await request();
      this.lastRequestTime = Date.now();
      return result;
    } catch (error: any) {
      if (retryCount < maxRetries && this.shouldRetry(error)) {
        const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.executeWithBackoff(request, retryCount + 1, maxRetries);
      }
      throw error;
    }
  }

  private async waitForInterval(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    const requiredInterval = 1000 / this.requestsPerSecond;
    
    if (timeSinceLastRequest < this.minRequestInterval) {
      await new Promise(resolve => 
        setTimeout(resolve, this.minRequestInterval - timeSinceLastRequest)
      );
    } else if (timeSinceLastRequest < requiredInterval) {
      await new Promise(resolve => 
        setTimeout(resolve, requiredInterval - timeSinceLastRequest)
      );
    }
  }

  private shouldRetry(error: any): boolean {
    // Retry on rate limit errors (429) or temporary server errors (5xx)
    const statusCode = error.status || error.statusCode;
    return statusCode === 429 || (statusCode >= 500 && statusCode < 600);
  }

  private async processQueue(): Promise<void> {
    if (this.processing || this.queue.length === 0) return;
    
    this.processing = true;
    while (this.queue.length > 0) {
      const request = this.queue.shift();
      if (request) {
        await request();
      }
    }
    this.processing = false;
  }
}
