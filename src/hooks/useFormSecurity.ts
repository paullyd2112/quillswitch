import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/auth';
import { checkRateLimit, rateLimiters, sanitizeHtml, validateInput } from '@/utils/security';
import { errorHandler, ERROR_CODES } from '@/services/errorHandling/globalErrorHandler';
import { supabase } from '@/integrations/supabase/client';
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
      // Enhanced rate limiting using database
      const keyPrefix = user?.id ? `user:${user.id}` : `anonymous:${navigator.userAgent}`;
      const maxRequests = options.rateLimitType === 'auth' ? 5 : 20;
      const windowMinutes = 1;

      const { data: isAllowed, error: rateLimitError } = await supabase.rpc('check_rate_limit', {
        key_prefix: keyPrefix,
        max_requests: maxRequests,
        window_minutes: windowMinutes
      });

      if (rateLimitError) {
        console.error('Database rate limit check failed, falling back to local:', rateLimitError);
        // Fall back to local rate limiting
        const identifier = user?.id || 'anonymous';
        const limiter = rateLimiters[options.rateLimitType || 'api'];
        checkRateLimit(identifier, limiter, `form_${options.formName}`);
      } else if (!isAllowed) {
        throw new Error('Rate limit exceeded. Please wait before submitting again.');
      }

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