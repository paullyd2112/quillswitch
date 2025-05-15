
/**
 * Utility functions for services
 */

/**
 * Check if a string is a valid UUID
 * @param str String to check
 * @returns boolean
 */
export const isUUID = (str: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
};

/**
 * Safely parse JSON with a fallback value
 * @param jsonString JSON string to parse
 * @param fallback Fallback value if parsing fails
 * @returns Parsed JSON or fallback
 */
export const safeJsonParse = <T>(jsonString: string, fallback: T): T => {
  try {
    return JSON.parse(jsonString) as T;
  } catch (error) {
    console.error('Failed to parse JSON:', error);
    return fallback;
  }
};

/**
 * Format file size to human readable format
 * @param bytes File size in bytes
 * @returns Formatted string (e.g., "1.5 MB")
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Handle service errors consistently
 * @param error Error to handle
 * @param message User-friendly error message
 * @returns null to standardize error returns
 */
export const handleServiceError = <T>(error: any, message: string): T | null => {
  console.error(`${message}:`, error);
  
  // Check if we have a Supabase error
  if (error?.code && error?.message) {
    console.error(`Supabase error ${error.code}: ${error.message}`);
  }
  
  // Return null as a standard error return value
  return null;
};
