
import React, { useState, useEffect } from "react";
import BaseLayout from "@/components/layout/BaseLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, Key, Lock, ExternalLink, CheckCircle, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const CRM_PROVIDERS = [
  {
    id: "salesforce",
    name: "Salesforce",
    description: "Connect your Salesforce account to import contacts, opportunities and more",
    icon: "🏢"
  },
  {
    id: "hubspot",
    name: "HubSpot", 
    description: "Connect your HubSpot account to import contacts, deals and more",
    icon: "🟠"
  },
  {
    id: "zoho",
    name: "Zoho CRM",
    description: "Connect your Zoho CRM to import contacts, deals and more", 
    icon: "🔴"
  },
  {
    id: "pipedrive",
    name: "Pipedrive",
    description: "Connect your Pipedrive account to import leads, deals and more",
    icon: "🟢"
  }
];

interface ConnectedCredential {
  id: string;
  service_name: string;
  credential_name: string;
  credential_type: string;
  created_at: string;
  expires_at?: string;
}

const CrmConnections: React.FC = () => {
  const { toast } = useToast();
  const [connectingProvider, setConnectingProvider] = useState<string | null>(null);
  const [connectedCredentials, setConnectedCredentials] = useState<ConnectedCredential[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load connected credentials on component mount
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
    console.log(`Starting OAuth connection for ${provider}`);
    setConnectingProvider(provider);
    
    try {
      // Get the Supabase URL and project ID
      const supabaseUrl = "https://kxjidapjtcxwzpwdomnm.supabase.co";
      
      // Construct the edge function URL with provider parameter
      const functionUrl = `${supabaseUrl}/functions/v1/oauth-authorize?provider=${encodeURIComponent(provider)}`;
      console.log('Calling function URL:', functionUrl);
      
      // Get the auth token
      const { data: { session } } = await supabase.auth.getSession();
      
      // Make direct fetch request to edge function with provider in URL
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
        console.error('Function response error:', errorText);
        throw new Error(`Edge Function returned a ${response.status} status code: ${errorText}`);
      }
      
      const data = await response.json();
      console.log('OAuth authorize response:', data);
      
      if (data?.url) {
        console.log('Redirecting to OAuth URL:', data.url);
        // Redirect to OAuth authorization URL
        window.location.href = data.url;
      } else {
        console.error('No authorization URL received:', data);
        throw new Error('No authorization URL received from OAuth service');
      }
      
    } catch (error) {
      console.error('OAuth initiation failed:', error);
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
  
  return (
    <BaseLayout>
      <div className="container px-4 py-8 max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">CRM Connections</h1>
          <p className="text-muted-foreground">
            Connect your CRM systems to enable secure data migration with OAuth authentication
          </p>
        </div>
        
        <Alert className="mb-6 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
          <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <AlertDescription className="text-blue-700 dark:text-blue-300">
            We use WorkOS OAuth for secure, enterprise-grade authentication. Your credentials are encrypted and stored securely.
          </AlertDescription>
        </Alert>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {CRM_PROVIDERS.map((provider) => {
            const isConnected = isProviderConnected(provider.id);
            const isConnecting = connectingProvider === provider.id;
            
            return (
              <Card key={provider.id} className="transition-all hover:shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">{provider.icon}</span>
                    {provider.name}
                    {isConnected && <CheckCircle className="h-5 w-5 text-green-500 ml-auto" />}
                  </CardTitle>
                  <CardDescription>{provider.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Lock className="mr-1 h-3 w-3" />
                      <span>OAuth 2.0</span>
                    </div>
                    
                    {isConnected ? (
                      <Button 
                        variant="outline"
                        onClick={() => {
                          const credential = connectedCredentials.find(c => c.service_name === provider.id);
                          if (credential) handleDisconnect(credential.id, provider.name);
                        }}
                        className="gap-2"
                      >
                        Disconnect
                      </Button>
                    ) : (
                      <Button 
                        onClick={() => handleConnect(provider.id)}
                        disabled={isConnecting}
                        className="gap-2"
                      >
                        {isConnecting ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Connecting...
                          </>
                        ) : (
                          <>
                            <Key className="h-4 w-4" />
                            Connect
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Connected CRMs</CardTitle>
            <CardDescription>
              Manage your connected CRM accounts
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-6">
                <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                <p className="text-muted-foreground">Loading connections...</p>
              </div>
            ) : connectedCredentials.length > 0 ? (
              <div className="space-y-4">
                {connectedCredentials.map((credential) => (
                  <div key={credential.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium capitalize">{credential.service_name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Connected on {new Date(credential.created_at).toLocaleDateString()}
                      </p>
                      {credential.expires_at && (
                        <p className="text-xs text-amber-600">
                          Expires: {new Date(credential.expires_at).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDisconnect(credential.id, credential.service_name)}
                    >
                      Disconnect
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                No CRMs connected yet. Connect a CRM platform above to get started.
              </div>
            )}
          </CardContent>
        </Card>
        
        <div className="flex justify-end mt-4">
          <Button variant="outline" className="gap-2" asChild>
            <a href="https://docs.quillswitch.com/crm-integration" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
              Integration Documentation
            </a>
          </Button>
        </div>
      </div>
    </BaseLayout>
  );
};

export default CrmConnections;
