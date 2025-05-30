
import { useCallback } from 'react';
import { errorHandler, QuillSwitchError } from '@/services/errorHandling/globalErrorHandler';

/**
 * Hook for handling async errors with automatic error boundary triggering
 */
export const useAsyncError = () => {
  const throwError = useCallback((error: Error) => {
    // This will trigger the error boundary
    throw error;
  }, []);

  const handleAsyncError = useCallback((error: Error | QuillSwitchError, context?: Record<string, any>) => {
    // Handle through global error handler first
    errorHandler.handleError(error, context);
    
    // If it's a critical error, throw it to trigger error boundary
    if (error instanceof QuillSwitchError && error.severity === 'critical') {
      throwError(error);
    }
  }, [throwError]);

  return { handleAsyncError };
};

/**
 * Higher-order function to wrap async functions with error handling
 */
export const withAsyncErrorHandling = <T extends any[], R>(
  asyncFn: (...args: T) => Promise<R>,
  context?: Record<string, any>
) => {
  return async (...args: T): Promise<R | null> => {
    try {
      return await asyncFn(...args);
    } catch (error) {
      errorHandler.handleError(error as Error, context);
      return null;
    }
  };
};

/**
 * Hook for safe async operations with loading and error states
 */
export const useSafeAsync = () => {
  const { handleAsyncError } = useAsyncError();

  const safeAsync = useCallback(async <T>(
    asyncOperation: () => Promise<T>,
    options?: {
      onError?: (error: Error) => void;
      context?: Record<string, any>;
      fallbackValue?: T;
    }
  ): Promise<T | null> => {
    try {
      return await asyncOperation();
    } catch (error) {
      const err = error as Error;
      
      if (options?.onError) {
        options.onError(err);
      } else {
        handleAsyncError(err, options?.context);
      }
      
      return options?.fallbackValue ?? null;
    }
  }, [handleAsyncError]);

  return { safeAsync };
};
