
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCrmConnections } from "@/hooks/useCrmConnections";
import CrmConnectionCard from "@/components/crm-connections/CrmConnectionCard";
import ConnectedCrmsList from "@/components/crm-connections/ConnectedCrmsList";

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
  const {
    connectedCredentials,
    connectingProvider,
    isLoading,
    handleConnect,
    handleDisconnect,
    isProviderConnected,
  } = useCrmConnections();

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
    </div>
  );
};

export default CrmConnections;
