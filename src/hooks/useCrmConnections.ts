
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
      if (provider === 'salesforce') {
        console.log('Starting Salesforce OAuth flow for user:', session.user.id);
        
        // Open popup immediately to avoid popup blockers
        const popup = window.open('about:blank', '_blank', 'width=500,height=600,scrollbars=yes,resizable=yes');
        
        if (!popup) {
          toast({
            title: "Popup blocked",
            description: "Please allow popups for this site and try again.",
            variant: "destructive"
          });
          return;
        }
        
        // Debug: Check session and token before invoking function
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        console.log('Current session debug:', {
          hasSession: !!currentSession,
          hasAccessToken: !!currentSession?.access_token,
          userId: currentSession?.user?.id,
          tokenLength: currentSession?.access_token?.length,
          tokenPreview: currentSession?.access_token?.substring(0, 50) + '...'
        });
        
        try {
          // Call the edge function to start OAuth flow
          const { data, error } = await supabase.functions.invoke('salesforce-oauth', {
            body: {
              action: 'authorize',
              redirectUri: `${window.location.origin}/oauth/callback`,
              sandbox: false, // Default to production, could be made configurable
            },
          });

          console.log('Salesforce OAuth authorize response:', { data, error });

          if (error) {
            console.error('OAuth authorize error:', error);
            popup.close();
            throw error;
          }

          if (data?.authUrl) {
            console.log('Redirecting popup to Salesforce OAuth URL:', data.authUrl);
            popup.location.href = data.authUrl;
            
            toast({
              title: "Redirected to Salesforce",
              description: "Complete the login in the popup window, then return here."
            });
          } else {
            console.error('No authorization URL returned from OAuth');
            popup.close();
            throw new Error('No authorization URL returned');
          }
        } catch (error) {
          popup.close();
          throw error;
        }
        
        return; // Exit early to prevent finally block from running
      } else {
        throw new Error(`Provider ${provider} not yet implemented`);
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
