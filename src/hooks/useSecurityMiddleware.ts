import { useCallback, useEffect } from 'react';
import { 
  validateInput, 
  sanitizeHtml, 
  checkRateLimit, 
  rateLimiters,
  securitySchemas 
} from '@/utils/security';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth';

/**
 * Security middleware hook for forms and user inputs
 */
export function useSecurityMiddleware() {
  const { toast } = useToast();
  const { user } = useAuth();

  // Enhanced rate limiting using database
  const checkFormRateLimit = useCallback(async (formType: string = 'general'): Promise<boolean> => {
    try {
      const keyPrefix = user?.id ? `user:${user.id}` : `anonymous:${navigator.userAgent}`;
      const maxRequests = formType === 'auth' ? 5 : 20; // Stricter limits for auth forms
      const windowMinutes = 1;

      const { data: isAllowed, error } = await supabase.rpc('check_rate_limit', {
        key_prefix: keyPrefix,
        max_requests: maxRequests,
        window_minutes: windowMinutes
      });

      if (error) {
        console.error('Rate limit check failed:', error);
        // Fall back to local rate limiting
        try {
          checkRateLimit(keyPrefix, rateLimiters.api, `${formType}_form_submission`);
          return true;
        } catch (fallbackError) {
          toast({
            title: "Rate limit exceeded",
            description: "Please wait before submitting again.",
            variant: "destructive"
          });
          return false;
        }
      }

      if (!isAllowed) {
        toast({
          title: "Rate limit exceeded",
          description: "Please wait before submitting again.",
          variant: "destructive"
        });
        return false;
      }

      return true;
    } catch (error) {
      console.error('Rate limiting error:', error);
      return true; // Allow on error to avoid blocking legitimate users
    }
  }, [user?.id, toast]);

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