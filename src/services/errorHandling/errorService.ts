
import { toast } from "sonner";

/**
 * Error types for better categorization
 */
export type ErrorType = 
  | 'validation' 
  | 'authentication' 
  | 'authorization' 
  | 'network' 
  | 'database'
  | 'api'
  | 'unknown';

/**
 * Structured error object with additional context
 */
export interface AppError {
  message: string;
  type: ErrorType;
  code?: string;
  details?: Record<string, any>;
  originalError?: any;
}

/**
 * Create a structured AppError from any error source
 */
export const createAppError = (
  error: unknown, 
  defaultMessage: string = "An unexpected error occurred", 
  type: ErrorType = 'unknown'
): AppError => {
  if (error instanceof Error) {
    return {
      message: error.message || defaultMessage,
      type,
      originalError: error
    };
  }
  
  if (typeof error === 'string') {
    return {
      message: error || defaultMessage,
      type
    };
  }
  
  if (error && typeof error === 'object') {
    const errorObj = error as any;
    return {
      message: errorObj.message || errorObj.error || defaultMessage,
      type,
      code: errorObj.code,
      details: errorObj,
      originalError: error
    };
  }
  
  return {
    message: defaultMessage,
    type,
    details: { unknownError: error }
  };
};

/**
 * Handle errors consistently throughout the application
 */
export const handleAppError = (
  error: unknown, 
  userMessage: string = "Something went wrong", 
  type: ErrorType = 'unknown',
  logToConsole: boolean = true
): AppError => {
  const appError = createAppError(error, userMessage, type);
  
  if (logToConsole) {
    console.error(`[${appError.type.toUpperCase()}] ${userMessage}:`, error);
  }
  
  // Show appropriate toast notification based on error type
  switch (appError.type) {
    case 'validation':
      toast.warning(userMessage, {
        description: appError.message,
        duration: 5000
      });
      break;
      
    case 'authentication':
      toast.error(userMessage, {
        description: "Please sign in again to continue",
        duration: 8000
      });
      break;
      
    case 'authorization':
      toast.error(userMessage, {
        description: "You don't have permission to perform this action",
        duration: 5000
      });
      break;
      
    case 'network':
      toast.error(userMessage, {
        description: "Please check your internet connection and try again",
        duration: 5000
      });
      break;
      
    default:
      toast.error(userMessage, {
        description: appError.message,
        duration: 5000
      });
  }
  
  return appError;
};

/**
 * Try to execute a function and handle any errors
 */
export async function tryExecute<T>(
  fn: () => Promise<T>, 
  userMessage: string = "Operation failed", 
  type: ErrorType = 'unknown'
): Promise<{ success: boolean; data?: T; error?: AppError }> {
  try {
    const data = await fn();
    return { success: true, data };
  } catch (error) {
    const appError = handleAppError(error, userMessage, type);
    return { success: false, error: appError };
  }
}
