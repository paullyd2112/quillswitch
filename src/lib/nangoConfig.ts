import { supabase } from "@/integrations/supabase/client";
import { logger } from '@/utils/security/productionLogging';

// Helper to get Nango public key from Supabase secrets
export const getNangoPublicKey = async (): Promise<string> => {
  try {
    const response = await supabase.functions.invoke('get-nango-config');
    if (response.data?.publicKey) {
      return response.data.publicKey;
    }
  } catch (error) {
    logger.error('Failed to fetch Nango public key', { error: error instanceof Error ? error.message : 'Unknown error' });
    throw new Error('Nango configuration not available');
  }
  
  throw new Error('Nango public key not configured in secrets');
};

export const NANGO_CONFIG = {
  host: 'https://api.nango.dev',
  // We'll initialize the Nango client dynamically with the actual public key
};