
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
    try {
      // Use the real API client to validate the key
      const validationResult = await validateWithUnifiedApi(currentApiKey);
      
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
 * Validate API key with the real Unified API
 */
const validateWithUnifiedApi = async (apiKey: string): Promise<{ 
  valid: boolean; 
  message?: string;
  details?: Record<string, any>;
}> => {
  try {
    // Set the API key and try to make a test call
    apiClient.setApiKey(apiKey);
    
    // Try to get sources as a validation test
    const result = await apiClient.getSources();
    
    if (result && (Array.isArray(result) || result.data)) {
      return { valid: true };
    } else {
      return {
        valid: false,
        message: "API key validation failed",
        details: { reason: "invalid_response" }
      };
    }
  } catch (error: any) {
    console.error("Unified API validation error:", error);
    
    // Parse different types of API errors
    if (error.message.includes('401') || error.message.includes('unauthorized')) {
      return {
        valid: false,
        message: "Invalid API key or unauthorized access",
        details: { reason: "unauthorized" }
      };
    }
    
    if (error.message.includes('403') || error.message.includes('forbidden')) {
      return {
        valid: false,
        message: "API key does not have required permissions",
        details: { reason: "insufficient_permissions" }
      };
    }
    
    if (error.message.includes('timeout') || error.message.includes('network')) {
      return {
        valid: false,
        message: "Network error - please check your connection and try again",
        details: { reason: "network_error" }
      };
    }
    
    return {
      valid: false,
      message: "API validation failed",
      details: { reason: "validation_error", error: error.message }
    };
  }
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
