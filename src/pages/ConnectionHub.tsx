
import React from "react";
import BaseLayout from "@/components/layout/BaseLayout";
import ConnectionSection from "@/components/connection-hub/ConnectionSection";
import ConnectionGuide from "@/components/connection-hub/ConnectionGuide";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConnectionProvider } from "@/contexts/ConnectionContext";

const ConnectionHub: React.FC = () => {
  return (
    <BaseLayout>
      <ConnectionProvider>
        <div className="container px-4 py-8 max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Connection Hub</h1>
            <p className="text-muted-foreground">
              Connect your CRM systems and related applications
            </p>
          </div>
          
          <Tabs defaultValue="connect" className="space-y-6">
            <TabsList>
              <TabsTrigger value="connect">Connect</TabsTrigger>
              <TabsTrigger value="manage">Manage Connections</TabsTrigger>
              <TabsTrigger value="help">Help & Guides</TabsTrigger>
            </TabsList>
            
            <TabsContent value="connect" className="space-y-8">
              <ConnectionSection 
                title="Source CRM" 
                description="Connect your current CRM system that you want to migrate from."
                type="source"
              />
              
              <ConnectionSection 
                title="Destination CRM" 
                description="Connect your target CRM system where your data will be migrated to."
                type="destination"
              />
              
              <ConnectionSection 
                title="Related Applications" 
                description="Connect your marketing, sales ops, and sales enablement tools."
                type="related"
              />
            </TabsContent>
            
            <TabsContent value="manage">
              <div className="grid gap-4">
                <h2 className="text-xl font-semibold">Manage Your Connections</h2>
                <p>View and manage all your connected services.</p>
                <div className="grid gap-6 mt-4">
                  {/* Connection management content will be added in the next iteration */}
                  <div className="p-6 text-center bg-muted/40 rounded-lg border border-dashed">
                    <p className="text-muted-foreground">
                      Connect systems in the Connect tab to manage them here.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="help">
              <ConnectionGuide />
            </TabsContent>
          </Tabs>
        </div>
      </ConnectionProvider>
    </BaseLayout>
  );
};

export default ConnectionHub;
