
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ConnectedCredential } from "@/components/crm-connections/types";
import { oauthStorage } from "@/utils/secureStorage";

export const useCrmConnections = () => {
  const { toast } = useToast();
  const [connectingProvider, setConnectingProvider] = useState<string | null>(null);
  const [connectedCredentials, setConnectedCredentials] = useState<ConnectedCredential[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load connected credentials on hook mount
  useEffect(() => {
    loadConnectedCredentials();
  }, []);

  const loadConnectedCredentials = async () => {
    try {
      const { data, error } = await supabase
        .from('service_credentials')
        .select('id, service_name, credential_name, credential_type, created_at, expires_at')
        .in('credential_type', ['oauth_token', 'unified_connection']);
        
      if (error) throw error;
      
      setConnectedCredentials(data || []);
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
    console.log(`=== Starting OAuth for ${provider} ===`);
    setConnectingProvider(provider);
    
    try {
      const redirectUri = `${window.location.origin}/oauth/callback`;
      const state = `${provider}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      let authData;
      
      if (provider === 'salesforce') {
        // Use direct Salesforce integration
        const { data, error } = await supabase.functions.invoke('salesforce-oauth', {
          body: {
            action: 'authorize',
            redirectUri,
            state,
            sandbox: false
          }
        });
        
        if (error || !data.success) {
          throw new Error(data?.error || error?.message || 'Failed to start Salesforce OAuth flow');
        }
        
        authData = {
          authorization_url: data.authUrl,
          state: data.state,
          provider: 'salesforce'
        };
      } else {
        // TODO: Use native OAuth for other providers
        throw new Error('Native OAuth not yet implemented for ' + provider);
      }

      console.log('Authorization URL received:', authData.authorization_url);

      // Store connection details securely for callback (for supported providers)
      if (authData.state) {
        await oauthStorage.store({
          state: authData.state,
          integration_type: provider
        });
      }

      // Redirect to OAuth provider
      window.location.href = authData.authorization_url;
      
    } catch (error) {
      console.error('=== OAuth Error ===');
      console.error('Error:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast({
        title: "Connection Failed",
        description: `Failed to start OAuth flow for ${provider}. ${errorMessage}`,
        variant: "destructive"
      });
      setConnectingProvider(null);
    }
  };

  const handleDisconnect = async (credentialId: string, serviceName: string) => {
    try {
      const { error } = await supabase
        .from('service_credentials')
        .delete()
        .eq('id', credentialId);
        
      if (error) throw error;
      
      // Refresh the list
      await loadConnectedCredentials();
      
      toast({
        title: "Disconnected",
        description: `Successfully disconnected from ${serviceName}`
      });
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
