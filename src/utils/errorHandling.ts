
import { toast } from "@/hooks/use-toast";

/**
 * Standard error handler for API/service requests
 * @param error The error that occurred
 * @param userMessage A user-friendly message to display
 * @param logDetails Whether to log detailed error information to console
 */
export const handleError = (
  error: unknown, 
  userMessage: string = "Something went wrong", 
  logDetails: boolean = true
): void => {
  // Log to console in non-production environments
  if (logDetails) {
    console.error("Error details:", error);
  }
  
  // Extract message from different error types
  let errorMessage = "An unexpected error occurred";
  
  if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    errorMessage = error;
  } else if (error && typeof error === 'object' && 'message' in error) {
    errorMessage = String((error as any).message);
  }
  
  // Display toast notification
  toast({
    title: userMessage,
    description: errorMessage,
    variant: "destructive",
  });
  
  // Track error in analytics in production (you can add this later)
  // if (process.env.NODE_ENV === 'production') { 
  //   trackError(errorMessage);
  // }
};

/**
 * Wrap an async function with standardized error handling
 */
export function withErrorHandling<T>(
  asyncFn: () => Promise<T>,
  userMessage: string = "Something went wrong"
): Promise<T | null> {
  return asyncFn().catch((error) => {
    handleError(error, userMessage);
    return null;
  });
}

/**
 * Higher-order function for wrapping API calls with loading state and error handling
 */
export const createApiWrapper = <T>(loadingStateSetter?: (loading: boolean) => void) => {
  return async (
    apiCall: () => Promise<T>,
    errorMessage: string = "Operation failed"
  ): Promise<T | null> => {
    try {
      if (loadingStateSetter) loadingStateSetter(true);
      return await apiCall();
    } catch (error) {
      handleError(error, errorMessage);
      return null;
    } finally {
      if (loadingStateSetter) loadingStateSetter(false);
    }
  };
};
