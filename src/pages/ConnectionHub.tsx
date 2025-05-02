
import React, { useState } from "react";
import BaseLayout from "@/components/layout/BaseLayout";
import { ConnectionProvider } from "@/contexts/ConnectionContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CrmConnectionSection from "@/components/connection-hub/CrmConnectionSection";
import IntegratedToolsSection from "@/components/connection-hub/IntegratedToolsSection";
import ConnectionGuide from "@/components/connection-hub/ConnectionGuide";
import ProgressIndicator from "@/components/connection-hub/ProgressIndicator";
import { Info, Zap } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const ConnectionHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState("connect");

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
          
          <ProgressIndicator />
          
          <Alert className="mb-6 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
            <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <AlertDescription className="text-blue-700 dark:text-blue-300">
              Start by connecting both your old and new CRM systems, then add any additional tools you use.
            </AlertDescription>
          </Alert>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList>
              <TabsTrigger value="connect">Connect Systems</TabsTrigger>
              <TabsTrigger value="manage">Manage Connections</TabsTrigger>
              <TabsTrigger value="help">Help & Guides</TabsTrigger>
            </TabsList>
            
            <TabsContent value="connect" className="space-y-8">
              <div className="grid gap-10">
                {/* Step 1: Connect Old CRM */}
                <CrmConnectionSection 
                  step="1" 
                  title="Connect Old CRM" 
                  description="Select and connect your current CRM system that you want to migrate from"
                  type="source"
                />
                
                {/* Step 2: Connect New CRM */}
                <CrmConnectionSection 
                  step="2" 
                  title="Connect New CRM" 
                  description="Select and connect your target CRM system where your data will be migrated to"
                  type="destination"
                />
                
                {/* Step 3: Connect Other Tools */}
                <IntegratedToolsSection 
                  step="3" 
                  title="Connect Your Other Tools" 
                  description="Select and connect additional tools and applications you use with your CRM"
                />
              </div>
              
              <div className="flex justify-center mt-10">
                <a 
                  href="/migrations/setup" 
                  className="px-6 py-3 bg-brand-600 text-white rounded-md hover:bg-brand-700 transition-colors inline-flex items-center font-medium"
                >
                  <Zap className="mr-2 h-4 w-4" /> Continue to Migration Setup
                </a>
              </div>
            </TabsContent>
            
            <TabsContent value="manage">
              <div className="grid gap-4">
                <h2 className="text-xl font-semibold">Manage Your Connections</h2>
                <p>View and manage all your connected services.</p>
                <div className="grid gap-6 mt-4">
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
