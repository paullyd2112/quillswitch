
import { z } from 'zod';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Input validation service for form data and file uploads
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
   * Validate form data against a schema
   */
  public validateFormData(
    data: any,
    schema: z.ZodSchema<any>,
    formName: string
  ): ValidationResult {
    try {
      schema.parse(data);
      return {
        isValid: true,
        errors: []
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          isValid: false,
          errors: error.issues.map(issue => `${issue.path.join('.')}: ${issue.message}`)
        };
      }
      return {
        isValid: false,
        errors: ['Validation failed']
      };
    }
  }

  /**
   * Validate file uploads
   */
  public validateFileUpload(file: File): ValidationResult {
    const errors: string[] = [];
    
    // Check file size (max 10MB for demo)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      errors.push(`File size too large: ${file.size} bytes (max: ${maxSize})`);
    }
    
    // Check file type
    const allowedTypes = [
      'text/csv',
      'application/json',
      'text/plain',
      'application/pdf',
      'image/jpeg',
      'image/png'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      errors.push(`Invalid file type: ${file.type}`);
    }
    
    // Check filename for suspicious patterns
    const suspiciousPatterns = [
      /\.(exe|bat|cmd|com|pif|scr|vbs|js)$/i,
      /[<>:"|?*]/
    ];
    
    if (suspiciousPatterns.some(pattern => pattern.test(file.name))) {
      errors.push(`Suspicious filename: ${file.name}`);
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// Export singleton instance
export const inputValidator = InputValidationService.getInstance();
