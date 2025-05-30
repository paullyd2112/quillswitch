
import { errorHandler, QuillSwitchError, ERROR_CODES } from '@/services/errorHandling/globalErrorHandler';

export interface RetryOptions {
  maxAttempts?: number;
  delay?: number;
  backoffFactor?: number;
  maxDelay?: number;
  retryCondition?: (error: Error) => boolean;
  onRetry?: (attempt: number, error: Error) => void;
}

export const DEFAULT_RETRY_OPTIONS: Required<RetryOptions> = {
  maxAttempts: 3,
  delay: 1000,
  backoffFactor: 2,
  maxDelay: 10000,
  retryCondition: (error: Error) => {
    // Retry on network errors, timeouts, and rate limits
    const retryableErrors = [
      ERROR_CODES.NETWORK_ERROR,
      ERROR_CODES.TIMEOUT,
      ERROR_CODES.RATE_LIMITED,
      ERROR_CODES.SERVICE_UNAVAILABLE
    ];
    
    if (error instanceof QuillSwitchError) {
      return retryableErrors.includes(error.code as any);
    }
    
    const message = error.message.toLowerCase();
    return message.includes('network') || 
           message.includes('timeout') || 
           message.includes('rate limit') ||
           message.includes('503') ||
           message.includes('502');
  },
  onRetry: () => {}
};

/**
 * Sleep utility for delays
 */
const sleep = (ms: number): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));

/**
 * Calculate delay with exponential backoff
 */
const calculateDelay = (attempt: number, baseDelay: number, backoffFactor: number, maxDelay: number): number => {
  const delay = baseDelay * Math.pow(backoffFactor, attempt - 1);
  return Math.min(delay, maxDelay);
};

/**
 * Retry an async function with exponential backoff
 */
export async function withRetry<T>(
  asyncFn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const opts = { ...DEFAULT_RETRY_OPTIONS, ...options };
  let lastError: Error;

  for (let attempt = 1; attempt <= opts.maxAttempts; attempt++) {
    try {
      return await asyncFn();
    } catch (error) {
      lastError = error as Error;

      // Don't retry if this is the last attempt or if retry condition fails
      if (attempt === opts.maxAttempts || !opts.retryCondition(lastError)) {
        break;
      }

      // Call retry callback
      opts.onRetry(attempt, lastError);

      // Calculate and wait for delay
      const delay = calculateDelay(attempt, opts.delay, opts.backoffFactor, opts.maxDelay);
      await sleep(delay);
    }
  }

  // If we get here, all retries failed
  const retryError = new QuillSwitchError(
    ERROR_CODES.UNEXPECTED_ERROR,
    `Operation failed after ${opts.maxAttempts} attempts: ${lastError.message}`,
    `The operation failed after multiple attempts. Please try again later.`,
    'medium',
    {
      originalError: lastError.message,
      attempts: opts.maxAttempts,
      lastAttemptError: lastError
    }
  );

  throw retryError;
}

/**
 * Create a retry wrapper for a function
 */
export function createRetryWrapper<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  options: RetryOptions = {}
) {
  return async (...args: T): Promise<R> => {
    return withRetry(() => fn(...args), options);
  };
}

/**
 * Retry specifically for API calls with appropriate error handling
 */
export async function retryApiCall<T>(
  apiCall: () => Promise<T>,
  context?: Record<string, any>
): Promise<T> {
  return withRetry(apiCall, {
    maxAttempts: 3,
    delay: 1000,
    backoffFactor: 2,
    onRetry: (attempt, error) => {
      console.log(`API call retry attempt ${attempt}:`, error.message);
      errorHandler.handleError(
        new QuillSwitchError(
          ERROR_CODES.NETWORK_ERROR,
          `API call retry attempt ${attempt}: ${error.message}`,
          `Retrying connection...`,
          'low',
          { ...context, retryAttempt: attempt }
        )
      );
    }
  });
}
