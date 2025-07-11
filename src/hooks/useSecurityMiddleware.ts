import { useCallback, useEffect } from 'react';
import { 
  validateInput, 
  sanitizeHtml, 
  checkRateLimit, 
  rateLimiters,
  securitySchemas 
} from '@/utils/securityUtils';
import { useToast } from '@/hooks/use-toast';

/**
 * Security middleware hook for forms and user inputs
 */
export function useSecurityMiddleware() {
  const { toast } = useToast();

  // Rate limiting for form submissions
  const checkFormRateLimit = useCallback((userId: string, formType: string = 'general') => {
    try {
      checkRateLimit(userId, rateLimiters.api, `${formType}_form_submission`);
      return true;
    } catch (error) {
      toast({
        title: "Rate limit exceeded",
        description: "Please wait before submitting again.",
        variant: "destructive"
      });
      return false;
    }
  }, [toast]);

  // Secure input validation
  const validateSecureInput = useCallback((input: unknown, fieldType: keyof typeof securitySchemas, fieldName: string) => {
    try {
      const schema = securitySchemas[fieldType];
      if (!schema) {
        throw new Error(`Unknown field type: ${fieldType}`);
      }
      return validateInput(input, schema as any, fieldName);
    } catch (error) {
      toast({
        title: "Input validation failed",
        description: error instanceof Error ? error.message : "Invalid input provided",
        variant: "destructive"
      });
      throw error;
    }
  }, [toast]);

  // Sanitize HTML content
  const sanitizeContent = useCallback((content: string) => {
    return sanitizeHtml(content);
  }, []);

  return {
    checkFormRateLimit,
    validateSecureInput,
    sanitizeContent
  };
}