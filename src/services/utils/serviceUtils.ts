
/**
 * Generic error handler for service functions
 */
export const handleServiceError = <T>(error: any, message: string): T | null => {
  console.error(`${message}:`, error);
  return null;
};

/**
 * Check if a string is a valid UUID
 */
export const isUUID = (str: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
};
