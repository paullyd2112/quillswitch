import { z } from 'zod';
import { errorHandler, ERROR_CODES } from '@/services/errorHandling/globalErrorHandler';

/**
 * Validate and sanitize user input
 */
export function validateInput<T>(
  input: unknown,
  schema: z.ZodSchema<T>,
  fieldName: string
): T {
  try {
    return schema.parse(input);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const issues = error.issues.map(issue => `${issue.path.join('.')}: ${issue.message}`).join(', ');
      
      throw errorHandler.createError(
        ERROR_CODES.INVALID_INPUT,
        `Validation failed for ${fieldName}: ${issues}`,
        {
          fieldName,
          issues: error.issues,
          input: typeof input === 'string' ? input.substring(0, 100) : input
        }
      );
    }
    throw error;
  }
}

/**
 * Validate and clean file uploads
 */
export function validateFileUpload(file: File): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  const allowedTypes = [
    'text/csv',
    'application/json',
    'text/plain',
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/gif'
  ];

  const maxSize = 50 * 1024 * 1024; // 50MB

  if (!allowedTypes.includes(file.type)) {
    errors.push(`Invalid file type: ${file.type}`);
  }

  if (file.size > maxSize) {
    errors.push(`File too large: ${(file.size / 1024 / 1024).toFixed(2)}MB (max: 50MB)`);
  }

  // Check for suspicious file names
  const suspiciousPatterns = [
    /\.(exe|bat|cmd|com|pif|scr|vbs|js)$/i,
    /[<>:"|?*]/,
    /^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/i
  ];

  if (suspiciousPatterns.some(pattern => pattern.test(file.name))) {
    errors.push(`Suspicious file name: ${file.name}`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}