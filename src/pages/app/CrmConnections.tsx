
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCrmConnections } from "@/hooks/useCrmConnections";
import { useSessionContext } from '@supabase/auth-helpers-react';
import CrmConnectionCard from "@/components/crm-connections/CrmConnectionCard";
import ConnectedCrmsList from "@/components/crm-connections/ConnectedCrmsList";
import QuillCleanseCard from "@/components/quill-cleanse/QuillCleanseCard";
import { LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";

const crmProviders = [
  {
    id: "salesforce",
    name: "Salesforce",
    icon: "☁️",
    description: "Connect your Salesforce CRM to migrate contacts, leads, and opportunities."
  },
  {
    id: "hubspot",
    name: "HubSpot",
    icon: "🧡",
    description: "Connect your HubSpot CRM to migrate contacts, companies, and deals."
  },
  {
    id: "pipedrive",
    name: "Pipedrive",
    icon: "🔵",
    description: "Connect your Pipedrive CRM to migrate deals, contacts, and organizations."
  }
];

const CrmConnections: React.FC = () => {
  const navigate = useNavigate();
  const { session, isLoading: sessionLoading } = useSessionContext();
  const {
    connectedCredentials,
    connectingProvider,
    isLoading,
    handleConnect,
    handleDisconnect,
    isProviderConnected,
  } = useCrmConnections();

  // Show loading while checking authentication
  if (sessionLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show login prompt if user is not authenticated
  if (!session) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">CRM Connections</h1>
          <p className="text-muted-foreground">
            Connect your CRM platforms to enable secure data migration between systems.
          </p>
        </div>

        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <LogIn className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              Please log in to connect and manage your CRM integrations
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => navigate('/auth')} className="w-full">
              Log In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">CRM Connections</h1>
        <p className="text-muted-foreground">
          Connect your CRM platforms to enable secure data migration between systems.
        </p>
      </div>

      <ConnectedCrmsList
        connectedCredentials={connectedCredentials}
        isLoading={isLoading}
        onDisconnect={handleDisconnect}
      />

      <Card>
        <CardHeader>
          <CardTitle>Available CRM Platforms</CardTitle>
          <CardDescription>
            Select a CRM platform to connect using secure OAuth authentication
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {crmProviders.map((provider) => (
              <CrmConnectionCard
                key={provider.id}
                provider={provider}
                isConnected={isProviderConnected(provider.id)}
                isConnecting={connectingProvider === provider.id}
                onConnect={handleConnect}
                onDisconnect={(providerId, providerName) => {
                  const credential = connectedCredentials.find(c => c.service_name === providerId);
                  if (credential) {
                    handleDisconnect(credential.id, providerName);
                  }
                }}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <QuillCleanseCard 
        onStartCleansing={() => {
          // TODO: Integrate with actual data upload/selection flow
          navigate('/app/quill-cleanse');
        }}
      />
    </div>
  );
};

export default CrmConnections;
