import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/auth';
import { checkRateLimit, rateLimiters, sanitizeHtml, validateInput } from '@/utils/security';
import { errorHandler, ERROR_CODES } from '@/services/errorHandling/globalErrorHandler';
import { z } from 'zod';

interface FormSecurityOptions {
  formName: string;
  rateLimitType?: 'api' | 'auth' | 'migration';
  sanitizeInputs?: boolean;
  validationSchema?: z.ZodSchema<any>;
}

export const useFormSecurity = (options: FormSecurityOptions) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const secureSubmit = useCallback(async (
    formData: any,
    submitFunction: (sanitizedData: any) => Promise<any>
  ) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      // Rate limiting
      const identifier = user?.id || 'anonymous';
      const limiter = rateLimiters[options.rateLimitType || 'api'];
      checkRateLimit(identifier, limiter, `form_${options.formName}`);

      // Input validation
      let validatedData = formData;
      if (options.validationSchema) {
        validatedData = validateInput(
          formData,
          options.validationSchema,
          options.formName
        );
      }

      // Input sanitization
      let sanitizedData = validatedData;
      if (options.sanitizeInputs) {
        sanitizedData = sanitizeFormData(validatedData);
      }

      // Execute the actual form submission
      const result = await submitFunction(sanitizedData);
      
      return result;
    } catch (error) {
      if (error instanceof Error) {
        errorHandler.handleError(error, {
          formName: options.formName,
          userId: user?.id
        });
      }
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, [user?.id, options, isSubmitting]);

  return {
    secureSubmit,
    isSubmitting
  };
};

/**
 * Recursively sanitize form data
 */
function sanitizeFormData(data: any): any {
  if (typeof data === 'string') {
    return sanitizeHtml(data);
  }
  
  if (Array.isArray(data)) {
    return data.map(sanitizeFormData);
  }
  
  if (data && typeof data === 'object') {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(data)) {
      sanitized[key] = sanitizeFormData(value);
    }
    return sanitized;
  }
  
  return data;
}