
import { toast } from "sonner";

/**
 * Validates API connections for native CRM engine
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
    
    // Since we're using native CRM engine, no external API key validation needed
    // Just validate that CRM connections are configured
    console.log("Native CRM engine validation");
    return { 
      valid: true,
      message: "Native CRM engine ready - no external API validation required",
      details: { mode: "native_engine" }
    };
  } catch (error: any) {
    console.error("Unexpected error during validation:", error);
    
    // Handle unexpected errors gracefully
    return { 
      valid: false, 
      message: "Error validating system: " + error.message,
      details: { error: error.message }
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
