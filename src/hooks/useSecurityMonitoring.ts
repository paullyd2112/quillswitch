
import { useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/auth';
import { apiSecurity } from '@/services/security/apiSecurityService';
import { monitoring } from '@/services/monitoring/monitoringService';
import { inputValidator } from '@/services/validation/inputValidationService';
import { validateFileUpload } from '@/utils/securityUtils';

/**
 * Hook for monitoring security events and user activities
 */
export const useSecurityMonitoring = () => {
  const { user } = useAuth();

  // Track page views and user activities
  useEffect(() => {
    const currentPath = window.location.pathname;
    
    monitoring.trackActivity({
      activity_type: 'page_view',
      activity_description: `Visited ${currentPath}`,
      user_id: user?.id,
      activity_details: {
        path: currentPath,
        referrer: document.referrer,
        timestamp: new Date().toISOString()
      }
    });

    // Track page performance
    monitoring.trackPageLoad(currentPath);
    
    // Track memory usage periodically
    const memoryInterval = setInterval(() => {
      monitoring.trackMemoryUsage();
    }, 60000); // Every minute

    return () => {
      clearInterval(memoryInterval);
    };
  }, [user?.id]);

  // Monitor form submissions for security
  const monitorFormSubmission = useCallback(async (
    formData: any,
    formName: string
  ) => {
    try {
      // Validate form data
      const validation = inputValidator.validateFormData(
        formData,
        {} as any, // Schema would be provided per form
        formName
      );

      // Log the activity
      monitoring.trackActivity({
        activity_type: 'form_submission',
        activity_description: `Submitted ${formName} form`,
        user_id: user?.id,
        activity_details: {
          form_name: formName,
          validation_result: validation.isValid,
          errors: validation.errors
        }
      });

      // Log security event if validation failed
      if (!validation.isValid) {
        await apiSecurity.logSecurityEvent({
          type: 'suspicious_activity',
          userId: user?.id,
          details: {
            form_name: formName,
            validation_errors: validation.errors,
            action: 'form_validation_failed'
          }
        });
      }

      return validation;
    } catch (error) {
      console.error('Form monitoring error:', error);
      return { isValid: false, errors: ['Monitoring failed'] };
    }
  }, [user?.id]);

  // Monitor API calls
  const monitorApiCall = useCallback(async <T>(
    operation: string,
    apiCall: () => Promise<T>
  ): Promise<T> => {
    return monitoring.monitorApiCall(operation, apiCall, {
      user_id: user?.id
    });
  }, [user?.id]);

  // Track user engagement events
  const trackEngagement = useCallback((
    event: string,
    metadata?: Record<string, any>
  ) => {
    monitoring.trackUserEngagement(event, {
      user_id: user?.id,
      ...metadata
    });
  }, [user?.id]);

  // Monitor file uploads
  const monitorFileUpload = useCallback((
    file: File,
    context: string
  ) => {
    const validation = validateFileUpload(file);
    
    monitoring.trackActivity({
      activity_type: 'file_upload',
      activity_description: `Uploaded file: ${file.name}`,
      user_id: user?.id,
      activity_details: {
        file_name: file.name,
        file_size: file.size,
        file_type: file.type,
        context,
        validation_result: validation.isValid,
        errors: validation.errors
      }
    });

    if (!validation.isValid) {
      apiSecurity.logSecurityEvent({
        type: 'suspicious_activity',
        userId: user?.id,
        details: {
          action: 'invalid_file_upload',
          file_name: file.name,
          errors: validation.errors
        }
      });
    }

    return validation;
  }, [user?.id]);

  return {
    monitorFormSubmission,
    monitorApiCall,
    trackEngagement,
    monitorFileUpload
  };
};
