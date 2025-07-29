
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSessionContext } from '@supabase/auth-helpers-react';
import { ConnectedCredential } from "@/components/crm-connections/types";
import { 
  initiateNangoOAuth, 
  deleteNangoConnection, 
  checkNangoConnection,
  NangoProvider 
} from "@/lib/nango";

export const useCrmConnections = () => {
  const { toast } = useToast();
  const { session, isLoading: sessionLoading } = useSessionContext();
  const [connectingProvider, setConnectingProvider] = useState<string | null>(null);
  const [connectedCredentials, setConnectedCredentials] = useState<ConnectedCredential[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load connected credentials on hook mount
  useEffect(() => {
    if (session && !sessionLoading) {
      loadConnectedCredentials();
    } else if (!sessionLoading && !session) {
      setIsLoading(false);
    }
  }, [session, sessionLoading]);

  const loadConnectedCredentials = async () => {
    if (!session?.user) {
      setIsLoading(false);
      return;
    }

    try {
      // Check Nango connections for each provider
      const providers: NangoProvider[] = ['salesforce', 'hubspot', 'pipedrive'];
      const connectedCreds: ConnectedCredential[] = [];
      
      await Promise.all(providers.map(async (provider) => {
        const { isConnected } = await checkNangoConnection(provider, session.user.id);
        if (isConnected) {
          connectedCreds.push({
            id: `nango_${provider}_${session.user.id}`,
            service_name: provider,
            credential_name: `${provider} OAuth`,
            credential_type: 'oauth',
            created_at: new Date().toISOString(),
            expires_at: null
          });
        }
      }));
      
      setConnectedCredentials(connectedCreds);
    } catch (error) {
      console.error('Failed to load connected credentials:', error);
      toast({
        title: "Error",
        description: "Failed to load connected CRMs",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleConnect = async (provider: string) => {
    if (!session?.user) {
      toast({
        title: "Authentication required",
        description: "Please log in to connect CRM services.",
        variant: "destructive",
      });
      return;
    }

    setConnectingProvider(provider);

    try {
      console.log(`Starting ${provider} OAuth flow via Nango for user:`, session.user.id);
      
      // Use Nango for OAuth flow
      const result = await initiateNangoOAuth(provider as NangoProvider, session.user.id);
      
      if (result.success) {
        toast({
          title: "Connected successfully!",
          description: `Successfully connected to ${provider}`,
        });
        
        // Refresh the credentials list
        await loadConnectedCredentials();
      } else {
        throw new Error(result.error?.message || `Failed to connect to ${provider}`);
      }
    } catch (error) {
      console.error('Connection error:', error);
      toast({
        title: "Connection failed",
        description: error.message || "Failed to connect to CRM service",
        variant: "destructive",
      });
    } finally {
      setConnectingProvider(null);
    }
  };

  const handleDisconnect = async (credentialId: string, serviceName: string) => {
    if (!session?.user) return;
    
    try {
      console.log(`Disconnecting ${serviceName} via Nango for user:`, session.user.id);
      
      // Use Nango to delete the connection
      const result = await deleteNangoConnection(serviceName as NangoProvider, session.user.id);
      
      if (result.success) {
        // Refresh the list
        await loadConnectedCredentials();
        
        toast({
          title: "Disconnected",
          description: `Successfully disconnected from ${serviceName}`
        });
      } else {
        throw new Error(result.error?.message || `Failed to disconnect from ${serviceName}`);
      }
    } catch (error) {
      console.error('Failed to disconnect:', error);
      toast({
        title: "Error", 
        description: "Failed to disconnect. Please try again.",
        variant: "destructive"
      });
    }
  };

  const isProviderConnected = (providerId: string) => {
    return connectedCredentials.some(cred => cred.service_name === providerId);
  };

  return {
    connectedCredentials,
    connectingProvider,
    isLoading,
    handleConnect,
    handleDisconnect,
    isProviderConnected,
  };
};
