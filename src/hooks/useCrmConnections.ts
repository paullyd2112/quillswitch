
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSessionContext } from '@supabase/auth-helpers-react';
import { crmLog } from "@/utils/logging/consoleReplacer";
import { safeTable } from "@/services/utils/supabaseUtils";
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
      console.log('Loading connected credentials for user:', session.user.id);
      
      // Check our database for stored Nango connections
      const { data: credentials, error } = await supabase
        .from('service_credentials')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('credential_type', 'oauth_nango_connect');

      console.log('Query result:', { credentials, error });

      if (error) {
        crmLog.error('Error loading credentials', error instanceof Error ? error : undefined, { userId: session.user.id });
        return;
      }

      const connectedCreds: ConnectedCredential[] = credentials?.map(cred => ({
        id: cred.id,
        service_name: cred.service_name,
        credential_name: cred.credential_name,
        credential_type: 'oauth',
        created_at: cred.created_at,
        expires_at: cred.expires_at
      })) || [];
      
      setConnectedCredentials(connectedCreds);
    } catch (error) {
      crmLog.error('Failed to load connected credentials', error instanceof Error ? error : undefined, { 
        userId: session?.user?.id 
      });
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
      crmLog.info(`Starting ${provider} OAuth flow via Nango`, { provider, userId: session.user.id });
      
      // Use Nango for OAuth flow
      const result = await initiateNangoOAuth(provider as NangoProvider, session.user.id);
      
      if (result.success && result.result) {
        // Type the result properly
        const authResult = result.result as {
          connectionId?: string;
          providerConfigKey?: string;
          isPending?: boolean;
        };
        
        // Simple direct insert - no triggers, no encryption for OAuth
        console.log('SIMPLE DIRECT INSERT for provider:', provider);
        
        try {
          // Just insert it directly using safeTable to bypass type issues
          const { data: insertData, error: insertError } = await safeTable('service_credentials')
            .insert({
              user_id: session.user.id,
              service_name: provider,
              credential_name: `${provider} Connection`,
              credential_type: 'oauth_nango_connect',
              credential_value: 'oauth_managed_by_nango', // Simple string
              metadata: {
                nango_connection_id: authResult.connectionId || `${provider}_${Date.now()}`,
                provider_config_key: authResult.providerConfigKey || provider,
                is_pending: authResult.isPending || false,
                connected_at: new Date().toISOString()
              }
            })
            .select();
          
          console.log('SIMPLE INSERT RESULT:', { insertData, insertError });
          
          if (insertError) {
            console.error('SIMPLE INSERT ERROR:', insertError);
          } else {
            console.log('🎉 SUCCESS: OAuth connection stored!');
          }
        } catch (err) {
          console.error('SIMPLE INSERT EXCEPTION:', err);
        }

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
      crmLog.error('Connection error', error instanceof Error ? error : undefined, { 
        provider, 
        userId: session.user.id 
      });
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
      crmLog.info(`Disconnecting ${serviceName} credential`, { credentialId, serviceName, userId: session.user.id });
      
      // Get the credential to find the Nango connection ID
      const { data: credential, error: fetchError } = await supabase
        .from('service_credentials')
        .select('metadata')
        .eq('id', credentialId)
        .single();

      const metadata = credential?.metadata as any;
      if (fetchError || !metadata?.nango_connection_id) {
        throw new Error('Could not find Nango connection ID');
      }

      // Delete via Nango API
      const result = await deleteNangoConnection(serviceName as NangoProvider, metadata.nango_connection_id);
      
      if (result.success) {
        // Remove from our database
        const { error: deleteError } = await supabase
          .from('service_credentials')
          .delete()
          .eq('id', credentialId);

        if (deleteError) {
          crmLog.error('Error removing from database', deleteError instanceof Error ? deleteError : undefined, { 
            credentialId, serviceName 
          });
        }

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
      crmLog.error('Failed to disconnect', error instanceof Error ? error : undefined, { 
        credentialId, serviceName, userId: session?.user?.id 
      });
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
