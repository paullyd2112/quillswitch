
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSessionContext } from '@supabase/auth-helpers-react';
import { ConnectedCredential } from "@/components/crm-connections/types";

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
    try {
      const { data, error } = await supabase
        .from('service_credentials')
        .select('id, service_name, credential_name, credential_type, created_at, expires_at')
        .in('credential_type', ['oauth', 'oauth_token']);
        
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
    
    // Check if user is authenticated
    if (!session) {
      toast({
        title: "Authentication Required",
        description: "Please log in to connect your CRM",
        variant: "destructive"
      });
      return;
    }
    
    setConnectingProvider(provider);
    
    try {
      const redirectUri = `${window.location.origin}/oauth/callback`;
      
      if (provider === 'salesforce') {
        // Use Salesforce OAuth edge function
        const { data, error } = await supabase.functions.invoke('salesforce-oauth', {
          body: {
            action: 'authorize',
            redirectUri,
            sandbox: false // You could make this configurable later
          }
        });
        
        if (error || !data.success) {
          throw new Error(data?.error || error?.message || 'Failed to start Salesforce OAuth flow');
        }
        
        console.log('Authorization URL received:', data.authUrl);
        
        // Redirect to OAuth provider
        window.location.href = data.authUrl;
      } else {
        // For other providers, show a message that they're not yet implemented
        toast({
          title: "Coming Soon",
          description: `${provider} integration is coming soon!`,
          variant: "default"
        });
      }
      
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
      // For Salesforce, we can call the revoke endpoint
      if (serviceName === 'salesforce') {
        // Get credential first to revoke properly
        const { data: credentials, error: getError } = await supabase
          .rpc('get_decrypted_credential_with_logging', {
            p_credential_id: credentialId
          });

        if (!getError && credentials && credentials.length > 0) {
          const credentialData = JSON.parse(credentials[0].credential_value);
          
          // Call revoke endpoint
          await supabase.functions.invoke('salesforce-oauth', {
            body: {
              action: 'revoke',
              refreshToken: credentialData.refresh_token,
              redirectUri: `${window.location.origin}/oauth/callback`
            }
          });
        }
      }

      // Delete the credential from our database
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
