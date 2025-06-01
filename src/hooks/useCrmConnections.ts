
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ConnectedCredential } from "@/components/crm-connections/types";

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
        .eq('credential_type', 'oauth_token');
        
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
      // Use Supabase functions.invoke instead of direct fetch
      console.log('Calling oauth-authorize function via Supabase client...');
      const { data, error } = await supabase.functions.invoke('oauth-authorize', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        body: new URLSearchParams({ provider: provider })
      });
      
      console.log('OAuth authorize response:', data);
      console.log('OAuth authorize error:', error);
      
      if (error) {
        throw new Error(`Edge Function error: ${error.message}`);
      }
      
      if (data?.url) {
        console.log('Redirecting to OAuth URL:', data.url);
        // Redirect to OAuth authorization URL
        window.location.href = data.url;
      } else {
        console.error('No authorization URL received:', data);
        throw new Error(`No authorization URL received from OAuth service. Response: ${JSON.stringify(data)}`);
      }
      
    } catch (error) {
      console.error('=== OAuth Error ===');
      console.error('Error:', error);
      console.error('Error type:', error.constructor.name);
      console.error('Error message:', error.message);
      
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
