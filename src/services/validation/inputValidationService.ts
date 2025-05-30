
import { z } from 'zod';
import { validateInput, sanitizeHtml, sanitizeSql } from '@/utils/securityUtils';
import { errorHandler, ERROR_CODES } from '@/services/errorHandling/globalErrorHandler';

/**
 * Enhanced input validation service with XSS and injection protection
 */
export class InputValidationService {
  private static instance: InputValidationService;

  public static getInstance(): InputValidationService {
    if (!InputValidationService.instance) {
      InputValidationService.instance = new InputValidationService();
    }
    return InputValidationService.instance;
  }

  /**
   * Comprehensive data sanitization
   */
  public sanitizeData(data: any): any {
    if (typeof data === 'string') {
      return this.sanitizeString(data);
    }

    if (Array.isArray(data)) {
      return data.map(item => this.sanitizeData(item));
    }

    if (data && typeof data === 'object') {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(data)) {
        sanitized[this.sanitizeString(key)] = this.sanitizeData(value);
      }
      return sanitized;
    }

    return data;
  }

  /**
   * String sanitization with multiple protection layers
   */
  private sanitizeString(input: string): string {
    if (!input || typeof input !== 'string') return input;

    let sanitized = input;

    // 1. HTML sanitization
    sanitized = sanitizeHtml(sanitized);

    // 2. SQL injection protection
    sanitized = sanitizeSql(sanitized);

    // 3. Remove null bytes
    sanitized = sanitized.replace(/\0/g, '');

    // 4. Normalize whitespace
    sanitized = sanitized.trim().replace(/\s+/g, ' ');

    // 5. Remove dangerous Unicode characters
    sanitized = sanitized.replace(/[\u0000-\u001F\u007F-\u009F]/g, '');

    return sanitized;
  }

  /**
   * Validate file uploads with comprehensive security checks
   */
  public validateFileUpload(file: File, options: {
    maxSize?: number;
    allowedTypes?: string[];
    allowedExtensions?: string[];
  } = {}): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    const {
      maxSize = 50 * 1024 * 1024, // 50MB default
      allowedTypes = [
        'text/csv',
        'application/json',
        'text/plain',
        'application/pdf',
        'image/jpeg',
        'image/png',
        'image/gif'
      ],
      allowedExtensions = ['.csv', '.json', '.txt', '.pdf', '.jpg', '.jpeg', '.png', '.gif']
    } = options;

    // Check file size
    if (file.size > maxSize) {
      errors.push(`File size exceeds limit of ${Math.round(maxSize / 1024 / 1024)}MB`);
    }

    // Check file type
    if (!allowedTypes.includes(file.type)) {
      errors.push(`File type '${file.type}' is not allowed`);
    }

    // Check file extension
    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!allowedExtensions.includes(extension)) {
      errors.push(`File extension '${extension}' is not allowed`);
    }

    // Check for suspicious file names
    const suspiciousPatterns = [
      /\.(exe|bat|cmd|com|pif|scr|vbs|js)$/i,
      /[<>:"|?*]/,
      /^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/i,
      /\.\./,
      /^\.+$/
    ];

    if (suspiciousPatterns.some(pattern => pattern.test(file.name))) {
      errors.push('File name contains suspicious characters');
    }

    // Check for double extensions
    if ((file.name.match(/\./g) || []).length > 1) {
      const parts = file.name.split('.');
      if (parts.length > 2) {
        errors.push('Files with multiple extensions are not allowed');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate and sanitize form data
   */
  public validateFormData<T>(
    data: unknown,
    schema: z.ZodSchema<T>,
    fieldName: string
  ): { isValid: boolean; data?: T; errors: string[] } {
    try {
      // First sanitize the data
      const sanitizedData = this.sanitizeData(data);

      // Then validate with schema
      const validatedData = validateInput(sanitizedData, schema, fieldName);

      return {
        isValid: true,
        data: validatedData,
        errors: []
      };
    } catch (error: any) {
      return {
        isValid: false,
        errors: [error.message || 'Validation failed']
      };
    }
  }

  /**
   * Validate API endpoints and parameters
   */
  public validateApiRequest(request: {
    path: string;
    method: string;
    query?: Record<string, string>;
    body?: any;
  }): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validate path
    if (!request.path || typeof request.path !== 'string') {
      errors.push('Invalid request path');
    } else if (!/^\/[a-zA-Z0-9\/\-_]*$/.test(request.path)) {
      errors.push('Request path contains invalid characters');
    }

    // Validate method
    const allowedMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'];
    if (!allowedMethods.includes(request.method)) {
      errors.push('Invalid HTTP method');
    }

    // Validate query parameters
    if (request.query) {
      for (const [key, value] of Object.entries(request.query)) {
        if (typeof key !== 'string' || typeof value !== 'string') {
          errors.push('Invalid query parameter format');
          break;
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// Export singleton instance
export const inputValidator = InputValidationService.getInstance();
