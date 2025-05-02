
import React, { useState } from "react";
import BaseLayout from "@/components/layout/BaseLayout";
import { ConnectionProvider } from "@/contexts/ConnectionContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CrmConnectionSection from "@/components/connection-hub/CrmConnectionSection";
import IntegratedToolsSection from "@/components/connection-hub/IntegratedToolsSection";
import ConnectionGuide from "@/components/connection-hub/ConnectionGuide";
import ProgressIndicator from "@/components/connection-hub/ProgressIndicator";
import SecurityInfoCard from "@/components/connection-hub/SecurityInfoCard";
import { Info, Shield, Zap } from "lucide-react";
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
          
          <Alert className="mb-6 bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800">
            <Shield className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertDescription className="text-green-700 dark:text-green-300">
              Your API keys and credentials are secured using end-to-end encryption. We never store your keys in plain text.
            </AlertDescription>
          </Alert>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList>
              <TabsTrigger value="connect">Connect Systems</TabsTrigger>
              <TabsTrigger value="manage">Manage Connections</TabsTrigger>
              <TabsTrigger value="help">Help & Guides</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
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
            
            <TabsContent value="security">
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Security & Privacy</h2>
                <p className="text-muted-foreground">
                  Learn how we protect your sensitive API keys and connection credentials.
                </p>
                
                <SecurityInfoCard />
                
                <div className="grid md:grid-cols-2 gap-6 mt-6">
                  <Card className="border-blue-100">
                    <CardHeader className="bg-blue-50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-800">
                      <CardTitle className="text-blue-800 dark:text-blue-400">Best Practices</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <div className="mt-1 text-blue-600 dark:text-blue-400">•</div>
                          <p className="text-sm">Use dedicated API keys for QuillSwitch with proper access control</p>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="mt-1 text-blue-600 dark:text-blue-400">•</div>
                          <p className="text-sm">Regularly rotate your API keys for enhanced security</p>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="mt-1 text-blue-600 dark:text-blue-400">•</div>
                          <p className="text-sm">Avoid using personal accounts; create service accounts when possible</p>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="mt-1 text-blue-600 dark:text-blue-400">•</div>
                          <p className="text-sm">Never share API keys via email or insecure channels</p>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Security FAQ</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      <div className="space-y-3">
                        <div>
                          <h3 className="font-medium">Where are my API keys stored?</h3>
                          <p className="text-sm text-muted-foreground">
                            Your encrypted API keys are stored locally on your device using secure browser storage.
                          </p>
                        </div>
                        <div>
                          <h3 className="font-medium">Can QuillSwitch access my API keys?</h3>
                          <p className="text-sm text-muted-foreground">
                            No. Your API keys are encrypted with your personal encryption key that only exists on your device.
                          </p>
                        </div>
                        <div>
                          <h3 className="font-medium">What happens if I use a different device?</h3>
                          <p className="text-sm text-muted-foreground">
                            You'll need to reconnect your systems when using a new device for security reasons.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </ConnectionProvider>
    </BaseLayout>
  );
};

export default ConnectionHub;
