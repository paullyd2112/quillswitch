
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
      // Use direct URL construction to ensure provider parameter is passed correctly
      console.log('Getting edge function URL...');
      const supabaseUrl = "https://kxjidapjtcxwzpwdomnm.supabase.co";
      const functionUrl = `${supabaseUrl}/functions/v1/oauth-authorize?provider=${encodeURIComponent(provider)}`;
      
      console.log('Making direct request to:', functionUrl);
      
      // Get auth session for authorization
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch(functionUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session?.access_token}`,
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4amlkYXBqdGN4d3pwd2RvbW5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5NjUzNzUsImV4cCI6MjA1ODU0MTM3NX0.U1kLjAztYB-Jfye3dIkJ7gx9U7aNDYHrorkI1Bax_g8',
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Edge function error response:', errorText);
        throw new Error(`Edge Function returned status ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      console.log('OAuth authorize response:', data);
      
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
