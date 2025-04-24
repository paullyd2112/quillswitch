
import React from "react";
import { useConnectorRegistry } from "@/hooks/useConnectorRegistry";
import BaseLayout from "@/components/layout/BaseLayout";
import IntegrationsMarketplace from "@/components/integrations/IntegrationsMarketplace";
import { useAuth } from "@/contexts/auth";

const IntegrationsPage: React.FC = () => {
  const { user } = useAuth();
  const registryData = useConnectorRegistry();
  
  return (
    <BaseLayout>
      <IntegrationsMarketplace 
        user={user}
        {...registryData} 
      />
    </BaseLayout>
  );
};

export default IntegrationsPage;
