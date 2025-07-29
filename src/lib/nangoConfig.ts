import { supabase } from "@/integrations/supabase/client";

// Helper to get Nango public key from Supabase secrets
export const getNangoPublicKey = async (): Promise<string> => {
  try {
    // In a real implementation, you'd get this from environment or a secure endpoint
    // For now, we'll use a placeholder that should be replaced with actual key
    const response = await supabase.functions.invoke('get-nango-config');
    if (response.data?.publicKey) {
      return response.data.publicKey;
    }
  } catch (error) {
    console.warn('Could not fetch Nango public key:', error);
  }
  
  // Fallback - replace this with your actual public key
  return 'nango_pk_test_your_actual_key_here';
};

export const NANGO_CONFIG = {
  host: 'https://api.nango.dev',
  // We'll initialize the Nango client dynamically with the actual public key
};