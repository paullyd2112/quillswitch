
/**
 * Generic error handler for service operations
 * @param error The error that occurred
 * @param message User-friendly message to display
 * @param logToConsole Whether to log the error to console
 * @returns null for operations returning data
 */
export const handleServiceError = <T>(error: any, message: string, logToConsole = false): T | null => {
  if (logToConsole) {
    console.error(`${message}:`, error);
  }
  
  // For future enhancement: add toast notifications or error tracking here
  
  return null;
};
