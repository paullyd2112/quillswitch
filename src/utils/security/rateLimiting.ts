import { errorHandler, ERROR_CODES } from '@/services/errorHandling/globalErrorHandler';

/**
 * Rate limiting utility (basic implementation)
 */
export class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private windowMs: number;
  protected maxRequests: number; // Changed to protected so subclasses can access

  constructor(windowMs: number = 60000, maxRequests: number = 100) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
  }

  public isAllowed(identifier: string): boolean {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    
    // Get existing requests for this identifier
    const requests = this.requests.get(identifier) || [];
    
    // Filter out old requests
    const recentRequests = requests.filter(timestamp => timestamp > windowStart);
    
    // Check if under limit
    if (recentRequests.length < this.maxRequests) {
      recentRequests.push(now);
      this.requests.set(identifier, recentRequests);
      return true;
    }
    
    return false;
  }

  public getRemainingRequests(identifier: string): number {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    const requests = this.requests.get(identifier) || [];
    const recentRequests = requests.filter(timestamp => timestamp > windowStart);
    
    return Math.max(0, this.maxRequests - recentRequests.length);
  }

  public reset(identifier: string): void {
    this.requests.delete(identifier);
  }
}

/**
 * Enhanced rate limiting with adaptive thresholds
 */
export class AdaptiveRateLimiter extends RateLimiter {
  private adaptiveThresholds = new Map<string, number>();

  constructor(windowMs: number = 60000, maxRequests: number = 100) {
    super(windowMs, maxRequests);
  }

  public isAllowedAdaptive(identifier: string, operation: string): boolean {
    const baseLimit = this.maxRequests; // Now accessible as protected
    const adaptiveLimit = this.adaptiveThresholds.get(identifier) || baseLimit;
    
    // Temporarily override maxRequests for this check
    const originalMax = this.maxRequests;
    this.maxRequests = adaptiveLimit;
    
    const allowed = this.isAllowed(identifier);
    
    // Restore original limit
    this.maxRequests = originalMax;
    
    return allowed;
  }

  public adjustThreshold(identifier: string, factor: number): void {
    const currentLimit = this.adaptiveThresholds.get(identifier) || this.maxRequests;
    const newLimit = Math.max(1, Math.floor(currentLimit * factor));
    this.adaptiveThresholds.set(identifier, newLimit);
  }
}

// Global rate limiters for different operations
export const rateLimiters = {
  api: new RateLimiter(60000, 100), // 100 requests per minute
  auth: new RateLimiter(300000, 5), // 5 auth attempts per 5 minutes
  migration: new RateLimiter(3600000, 10), // 10 migration operations per hour
};

/**
 * Check rate limit and throw error if exceeded
 */
export function checkRateLimit(
  identifier: string,
  limiter: RateLimiter,
  operation: string
): void {
  if (!limiter.isAllowed(identifier)) {
    throw errorHandler.createError(
      ERROR_CODES.RATE_LIMITED,
      `Rate limit exceeded for ${operation}`,
      {
        operation,
        identifier: identifier.substring(0, 10) + '...',
        remaining: limiter.getRemainingRequests(identifier)
      }
    );
  }
}