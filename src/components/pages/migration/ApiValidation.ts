
import { apiClient } from '@/services/migration/apiClient';
import { toast } from "sonner";

/**
 * Validates API keys with improved error handling and dev mode support
 * @param forceSuccess If true, bypasses validation (useful for development or demo mode)
 * @param isDev Optional flag to indicate development environment
 * @returns Object containing validation result and optional message
 */
export const validateApiKeys = async (
  forceSuccess: boolean = false,
  isDev: boolean = process.env.NODE_ENV === 'development'
): Promise<{ valid: boolean; message?: string; details?: Record<string, any> }> => {
  try {
    // Immediately return success in demo mode
    if (forceSuccess) {
      console.log("API validation bypassed (demo mode)");
      return { valid: true, message: "API validation bypassed for demo" };
    }
    
    // Get current API key from apiClient
    const currentApiKey = apiClient.getApiKey();
    
    // Handle empty API key scenario
    if (!currentApiKey || currentApiKey.trim() === '') {
      console.log("API validation failed: Empty API key");
      return { 
        valid: false, 
        message: "API key is missing",
        details: { reason: "empty_key" }
      };
    }
    
    // Special case for demo API key
    if (currentApiKey === 'demo_api_key_123456') {
      console.log("API validation: Using demo key");
      return { 
        valid: true, 
        message: "Using demo key - limited functionality available",
        details: { mode: "demo" }
      };
    }
    
    // In development mode, be more lenient with validation
    if (isDev) {
      console.log("Development mode API validation - allowing key:", currentApiKey.substring(0, 4) + "...");
      return { 
        valid: true,
        message: "Development mode: API key accepted without full validation",
        details: { mode: "development" }
      };
    }
    
    // In production, perform actual API key validation request
    // This would call an actual endpoint in production
    try {
      // For now, we'll simulate a validation check
      const validationResult = await simulateApiKeyValidation(currentApiKey);
      
      if (!validationResult.valid) {
        return {
          valid: false,
          message: validationResult.message || "Invalid API key",
          details: validationResult.details
        };
      }
      
      console.log("API validation passed");
      return { 
        valid: true,
        details: { mode: "production" }
      };
    } catch (validationError: any) {
      console.error("API key validation request failed:", validationError);
      
      // Return user-friendly message
      return {
        valid: false,
        message: "Could not validate API key, please try again later",
        details: { error: validationError.message }
      };
    }
  } catch (error: any) {
    console.error("Unexpected error during API key validation:", error);
    
    // Handle unexpected errors gracefully
    return { 
      valid: false, 
      message: "Error validating API keys: " + error.message,
      details: { error: error.message }
    };
  }
};

/**
 * Simulate API key validation for development/testing
 */
const simulateApiKeyValidation = async (apiKey: string): Promise<{ 
  valid: boolean; 
  message?: string;
  details?: Record<string, any>;
}> => {
  // This is a placeholder for actual API validation logic
  // In a real app, this would call a validation endpoint
  
  // For now, we'll accept any key that:
  // - Is at least 20 characters
  // - Starts with "sk_" or "pk_"
  // - Contains only allowed characters
  const isValidFormat = /^[a-zA-Z0-9_]{20,}$/.test(apiKey);
  const hasValidPrefix = apiKey.startsWith('sk_') || apiKey.startsWith('pk_');
  
  if (!isValidFormat || !hasValidPrefix) {
    return {
      valid: false,
      message: "Invalid API key format",
      details: {
        reason: "invalid_format",
        requirements: "API key must be at least 20 characters and start with sk_ or pk_"
      }
    };
  }
  
  // Simulate a network delay for realism
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return { valid: true };
};

/**
 * Utility function that validates API keys and shows toast notifications
 */
export const validateApiKeysWithFeedback = async (
  forceSuccess: boolean = false
): Promise<boolean> => {
  const result = await validateApiKeys(forceSuccess);
  
  if (!result.valid) {
    toast.error("API Key Error", {
      description: result.message || "Failed to validate API key"
    });
    return false;
  }
  
  if (result.message) {
    toast.info("API Key Status", {
      description: result.message
    });
  }
  
  return true;
};
