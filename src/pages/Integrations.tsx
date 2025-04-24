
import React, { useState } from "react";
import { useConnectorRegistry } from "@/hooks/useConnectorRegistry";
import { useConnectionHealth } from "@/hooks/useConnectionHealth";
import BaseLayout from "@/components/layout/BaseLayout";
import IntegrationsMarketplace from "@/components/integrations/IntegrationsMarketplace";
import ConnectionHealthDashboard from "@/components/integrations/ConnectionHealthDashboard";
import ConnectionHealthWidget from "@/components/integrations/ConnectionHealthWidget";
import { useAuth } from "@/contexts/auth";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const IntegrationsPage: React.FC = () => {
  const { user } = useAuth();
  const registryData = useConnectorRegistry();
  const [activeTab, setActiveTab] = useState<string>("marketplace");
  
  // Use our new hook to monitor connection health
  const { systemHealth, isLoading, refreshHealth } = 
    useConnectionHealth(registryData.connectors);
  
  return (
    <BaseLayout>
      <div className="container px-4 py-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold">Integrations</h1>
                <p className="text-muted-foreground">
                  Discover, connect and monitor your CRM integrations
                </p>
              </div>
              <div className="flex items-center gap-4">
                <TabsList>
                  <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
                  <TabsTrigger value="health">Health</TabsTrigger>
                </TabsList>
              </div>
            </div>
            
            <TabsContent value="marketplace" className="mt-0">
              {systemHealth.connections.length > 0 && (
                <div className="mb-6">
                  <ConnectionHealthWidget 
                    systemHealth={systemHealth}
                    isLoading={isLoading}
                    onRefresh={refreshHealth}
                  />
                </div>
              )}
              
              <IntegrationsMarketplace 
                user={user}
                {...registryData} 
              />
            </TabsContent>
            
            <TabsContent value="health" className="mt-0 space-y-6">
              {systemHealth.connections.length === 0 ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Connection Health</CardTitle>
                    <CardDescription>
                      Connect with integrations from the marketplace to monitor their health status
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex justify-center py-8">
                    <div className="text-center max-w-md">
                      <h3 className="text-xl font-medium mb-2">No Active Connections</h3>
                      <p className="text-muted-foreground mb-4">
                        Add integrations from the marketplace to start monitoring their connection health.
                      </p>
                      <button 
                        onClick={() => setActiveTab('marketplace')}
                        className="text-brand-600 hover:text-brand-700 font-medium"
                      >
                        Browse Available Integrations
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <ConnectionHealthDashboard
                  systemHealth={systemHealth}
                  isLoading={isLoading}
                  onRefresh={refreshHealth}
                />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </BaseLayout>
  );
};

export default IntegrationsPage;
