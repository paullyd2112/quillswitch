import Nango from '@nangohq/frontend';

// Initialize Nango client
export const nango = new Nango({
  host: 'https://api.nango.dev', // Use Nango cloud
  publicKey: process.env.VITE_NANGO_PUBLIC_KEY || '', // Will be set via environment
});

// CRM provider configurations for Nango
export const NANGO_INTEGRATIONS = {
  salesforce: {
    providerId: 'salesforce',
    connectionId: (userId: string) => `salesforce_${userId}`,
  },
  hubspot: {
    providerId: 'hubspot', 
    connectionId: (userId: string) => `hubspot_${userId}`,
  },
  pipedrive: {
    providerId: 'pipedrive',
    connectionId: (userId: string) => `pipedrive_${userId}`,
  },
} as const;

export type NangoProvider = keyof typeof NANGO_INTEGRATIONS;

// Helper to get connection ID for a user and provider
export const getNangoConnectionId = (userId: string, provider: NangoProvider): string => {
  return NANGO_INTEGRATIONS[provider].connectionId(userId);
};

// Helper to initiate OAuth flow
export const initiateNangoOAuth = async (provider: NangoProvider, userId: string) => {
  const config = NANGO_INTEGRATIONS[provider];
  const connectionId = config.connectionId(userId);
  
  try {
    const result = await nango.auth(config.providerId, connectionId);
    return { success: true, result };
  } catch (error) {
    console.error(`Nango OAuth error for ${provider}:`, error);
    return { success: false, error };
  }
};

// Helper to check connection status
export const checkNangoConnection = async (provider: NangoProvider, userId: string) => {
  const config = NANGO_INTEGRATIONS[provider];
  const connectionId = config.connectionId(userId);
  
  try {
    // Use the proxy function to check connection via Nango API
    const response = await fetch('/api/nango-proxy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        provider: config.providerId,
        endpoint: `connections/${connectionId}`,
        method: 'GET'
      })
    });
    
    if (response.ok) {
      const connections = await response.json();
      return { isConnected: !!connections, connections };
    } else {
      return { isConnected: false, connections: null };
    }
  } catch (error) {
    console.error(`Error checking Nango connection for ${provider}:`, error);
    return { isConnected: false, connections: null };
  }
};

// Helper to delete a connection
export const deleteNangoConnection = async (provider: NangoProvider, userId: string) => {
  const config = NANGO_INTEGRATIONS[provider];
  const connectionId = config.connectionId(userId);
  
  try {
    // Use the proxy function to delete connection via Nango API
    const response = await fetch('/api/nango-proxy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        provider: config.providerId,
        endpoint: `connections/${connectionId}`,
        method: 'DELETE'
      })
    });
    
    if (response.ok) {
      return { success: true };
    } else {
      const error = await response.json();
      return { success: false, error };
    }
  } catch (error) {
    console.error(`Error deleting Nango connection for ${provider}:`, error);
    return { success: false, error };
  }
};