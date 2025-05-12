
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Service to interact with Google Cloud Secret Manager via Supabase Edge Function
 */
export class GCPSecretManagerService {
  /**
   * Retrieves a secret from Google Cloud Secret Manager
   * @param secretName The name of the secret to retrieve
   * @param version Optional version of the secret, defaults to "latest"
   * @returns The secret value as a string, or null if there was an error
   */
  static async getSecret(secretName: string, version: string = "latest"): Promise<string | null> {
    try {
      const { data, error } = await supabase.functions.invoke('gcp-secrets', {
        body: {
          action: 'get',
          secretName,
          version
        }
      });
      
      if (error) throw error;
      if (!data.success) throw new Error(data.error || 'Failed to retrieve secret');
      
      return data.data;
    } catch (error) {
      console.error("Error retrieving secret from GCP:", error);
      toast.error("Failed to retrieve secret from Google Cloud Secret Manager");
      return null;
    }
  }
  
  /**
   * Lists available secrets in Google Cloud Secret Manager
   * @returns Array of secret metadata objects, or empty array if there was an error
   */
  static async listSecrets(): Promise<Array<{name: string, createTime: string, labels: Record<string, string>}>> {
    try {
      const { data, error } = await supabase.functions.invoke('gcp-secrets', {
        body: {
          action: 'list'
        }
      });
      
      if (error) throw error;
      if (!data.success) throw new Error(data.error || 'Failed to list secrets');
      
      return data.data;
    } catch (error) {
      console.error("Error listing secrets from GCP:", error);
      toast.error("Failed to list secrets from Google Cloud Secret Manager");
      return [];
    }
  }
}

/**
 * Utility function to get a secret and automatically mask it for display
 * @param secretName The name of the secret to retrieve
 * @returns Object with the secret value and a masked version for display
 */
export const getAndMaskSecret = async (secretName: string): Promise<{
  value: string | null;
  masked: string;
}> => {
  const value = await GCPSecretManagerService.getSecret(secretName);
  
  // Create a masked version for display
  let masked = '';
  if (value) {
    const length = value.length;
    const visibleChars = Math.min(4, length);
    masked = '•'.repeat(Math.min(12, length - visibleChars)) + 
             value.substring(length - visibleChars);
  }
  
  return { value, masked };
};

export default GCPSecretManagerService;
