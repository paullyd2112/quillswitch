
import { apiClient } from '@/services/migration/apiClient';

export const validateApiKeys = async (forceSuccess: boolean = false): Promise<{ valid: boolean; message?: string }> => {
  try {
    // During development or demo mode, we can use forceSuccess to bypass validation
    if (forceSuccess) {
      console.log("API validation bypassed (demo mode)");
      return { valid: true };
    }
    
    // Get current API key from apiClient
    const currentApiKey = apiClient.getApiKey();
    
    // For development/testing, accept any non-empty key as valid
    // In production, this would call an actual validation endpoint
    if (!currentApiKey || currentApiKey.trim() === '') {
      console.log("API validation failed: Empty API key");
      return { valid: false, message: "API key is missing" };
    }
    
    if (currentApiKey === 'demo_api_key_123456') {
      console.log("API validation: Using demo key");
      return { valid: true, message: "Using demo key - limited functionality available" };
    }
    
    console.log("API validation passed");
    return { valid: true };
  } catch (error) {
    console.error("API key validation error:", error);
    return { valid: false, message: "Error validating API keys" };
  }
};
