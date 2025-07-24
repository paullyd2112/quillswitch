
import { logger } from '@/utils/security/productionLogging';

export interface SSLRetryConfig {
  maxAttempts: number;
  baseDelay: number;
  maxDelay: number;
  backoffFactor: number;
}

export const DEFAULT_SSL_RETRY_CONFIG: SSLRetryConfig = {
  maxAttempts: 3,
  baseDelay: 1000,
  maxDelay: 10000,
  backoffFactor: 2,
};

export class SSLError extends Error {
  constructor(message: string, public readonly originalError?: Error) {
    super(message);
    this.name = 'SSLError';
  }
}

export function isSSLRelatedError(error: Error): boolean {
  const errorMessage = error.message.toLowerCase();
  return (
    errorMessage.includes('ssl') ||
    errorMessage.includes('tls') ||
    errorMessage.includes('handshake') ||
    errorMessage.includes('certificate') ||
    errorMessage.includes('connection reset') ||
    errorMessage.includes('network error') ||
    errorMessage.includes('conn_reset') ||
    errorMessage.includes('econnreset')
  );
}

export async function withSSLRetry<T>(
  operation: () => Promise<T>,
  config: SSLRetryConfig = DEFAULT_SSL_RETRY_CONFIG,
  context?: Record<string, any>
): Promise<T> {
  let lastError: Error;

  for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
    try {
      logger.debug(`SSL retry attempt ${attempt}/${config.maxAttempts}`, {
        ...context,
        attempt,
        maxAttempts: config.maxAttempts,
      });

      return await operation();
    } catch (error) {
      lastError = error as Error;

      logger.warn(`SSL operation failed on attempt ${attempt}`, {
        ...context,
        attempt,
        error: lastError.message,
        isSSLError: isSSLRelatedError(lastError),
      });

      // Don't retry on the last attempt
      if (attempt === config.maxAttempts) {
        break;
      }

      // Only retry for SSL-related errors
      if (!isSSLRelatedError(lastError)) {
        logger.debug('Non-SSL error detected, not retrying', {
          ...context,
          error: lastError.message,
        });
        throw lastError;
      }

      // Calculate delay with exponential backoff
      const delay = Math.min(
        config.baseDelay * Math.pow(config.backoffFactor, attempt - 1),
        config.maxDelay
      );

      logger.info(`Retrying SSL operation in ${delay}ms`, {
        ...context,
        attempt,
        delay,
        nextAttempt: attempt + 1,
      });

      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  // If we get here, all attempts failed
  logger.error('All SSL retry attempts failed', {
    ...context,
    attempts: config.maxAttempts,
    finalError: lastError.message,
  });

  throw new SSLError(
    `SSL operation failed after ${config.maxAttempts} attempts: ${lastError.message}`,
    lastError
  );
}
