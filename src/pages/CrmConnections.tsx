
import React from "react";
import BaseLayout from "@/components/layout/BaseLayout";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { CRM_PROVIDERS } from "@/components/crm-connections/constants";
import CrmConnectionCard from "@/components/crm-connections/CrmConnectionCard";
import ConnectedCrmsList from "@/components/crm-connections/ConnectedCrmsList";
import SecurityInfoAlert from "@/components/crm-connections/SecurityInfoAlert";
import { useCrmConnections } from "@/hooks/useCrmConnections";

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
    <BaseLayout>
      <div className="container px-4 py-8 max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">CRM Connections</h1>
          <p className="text-muted-foreground">
            Connect your CRM systems to enable secure data migration with OAuth authentication
          </p>
        </div>
        
        <SecurityInfoAlert />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {CRM_PROVIDERS.map((provider) => (
            <CrmConnectionCard
              key={provider.id}
              provider={provider}
              isConnected={isProviderConnected(provider.id)}
              isConnecting={connectingProvider === provider.id}
              onConnect={handleConnect}
              onDisconnect={(providerId, providerName) => {
                const credential = connectedCredentials.find(c => c.service_name === providerId);
                if (credential) handleDisconnect(credential.id, providerName);
              }}
            />
          ))}
        </div>
        
        <ConnectedCrmsList
          connectedCredentials={connectedCredentials}
          isLoading={isLoading}
          onDisconnect={handleDisconnect}
        />
        
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
