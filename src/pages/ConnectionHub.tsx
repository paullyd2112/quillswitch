
import React, { useState } from "react";
import BaseLayout from "@/components/layout/BaseLayout";
import { ConnectionProvider } from "@/contexts/ConnectionContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CrmConnectionSection from "@/components/connection-hub/CrmConnectionSection";
import IntegratedToolsSection from "@/components/connection-hub/IntegratedToolsSection";
import ConnectionGuide from "@/components/connection-hub/ConnectionGuide";
import ProgressIndicator from "@/components/connection-hub/ProgressIndicator";
import SecurityInfoCard from "@/components/connection-hub/SecurityInfoCard";
import { Info, Lock, Shield, Zap } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import FadeIn from "@/components/animations/FadeIn";

const ConnectionHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState("connect");

  return (
    <BaseLayout>
      <ConnectionProvider>
        <div className="container px-6 py-12 max-w-7xl mx-auto">
          <FadeIn>
            <div className="mb-12 max-w-3xl">
              <h1 className="text-4xl font-semibold mb-3">Connection Hub</h1>
              <p className="text-lg text-tech-text-secondary">
                Configure and manage your CRM connections with enterprise-grade security
              </p>
            </div>
          </FadeIn>
          
          <FadeIn delay="100">
            <ProgressIndicator />
          </FadeIn>
          
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            <FadeIn delay="200" className="flex-grow">
              <Alert className="bg-tech-subtle border-tech-accent/30 mb-0">
                <Info className="h-4 w-4 text-tech-accent" />
                <AlertDescription className="text-tech-text-secondary">
                  Start by connecting both your old and new CRM systems, then add any additional tools you use.
                </AlertDescription>
              </Alert>
            </FadeIn>
            
            <FadeIn delay="300" className="md:w-1/3">
              <Alert className="bg-tech-subtle border-tech-accent/30 mb-0 h-full">
                <Shield className="h-4 w-4 text-tech-highlight" />
                <AlertDescription className="text-tech-text-secondary">
                  Your credentials are secured using end-to-end encryption.
                </AlertDescription>
              </Alert>
            </FadeIn>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="bg-tech-subtle border border-tech-border rounded-xl p-1 w-full flex justify-start overflow-x-auto scrollbar-thin mb-8">
              <TabsTrigger value="connect" className="data-[state=active]:bg-tech-accent data-[state=active]:text-tech-text-primary rounded-lg flex-1">
                Connect Systems
              </TabsTrigger>
              <TabsTrigger value="manage" className="data-[state=active]:bg-tech-accent data-[state=active]:text-tech-text-primary rounded-lg flex-1">
                Manage Connections
              </TabsTrigger>
              <TabsTrigger value="help" className="data-[state=active]:bg-tech-accent data-[state=active]:text-tech-text-primary rounded-lg flex-1">
                Help & Guides
              </TabsTrigger>
              <TabsTrigger value="security" className="data-[state=active]:bg-tech-accent data-[state=active]:text-tech-text-primary rounded-lg flex-1">
                Security
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="connect" className="space-y-10 animate-fade-in">
              <FadeIn>
                <div className="grid gap-12">
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
                
                <div className="flex justify-center mt-16">
                  <a 
                    href="/migrations/setup" 
                    className="btn-tech-primary inline-flex items-center font-medium justify-center"
                  >
                    <Zap className="mr-2 h-5 w-5" /> Continue to Migration Setup
                  </a>
                </div>
              </FadeIn>
            </TabsContent>
            
            <TabsContent value="manage" className="animate-fade-in">
              <FadeIn>
                <div className="grid gap-6">
                  <h2 className="text-2xl font-semibold">Manage Your Connections</h2>
                  <p className="text-tech-text-secondary">View and manage all your connected services.</p>
                  
                  <div className="grid gap-8 mt-6">
                    <div className="p-12 text-center bg-tech-subtle/40 rounded-xl border border-dashed border-tech-border">
                      <p className="text-tech-text-secondary mb-4">
                        Connect systems in the Connect tab to manage them here.
                      </p>
                      <a href="#connect" onClick={() => setActiveTab("connect")} className="btn-tech-secondary inline-flex">
                        Go to Connect Systems
                      </a>
                    </div>
                  </div>
                </div>
              </FadeIn>
            </TabsContent>
            
            <TabsContent value="help" className="animate-fade-in">
              <ConnectionGuide />
            </TabsContent>
            
            <TabsContent value="security" className="animate-fade-in">
              <FadeIn>
                <div className="space-y-8">
                  <h2 className="text-2xl font-semibold">Security & Privacy</h2>
                  <p className="text-tech-text-secondary max-w-3xl">
                    Learn how QuillSwitch protects your sensitive API keys and connection credentials with enterprise-grade security protocols.
                  </p>
                  
                  <SecurityInfoCard />
                  
                  <div className="grid md:grid-cols-2 gap-8 mt-8">
                    <Card className="bg-tech-card border-tech-border shadow-tech">
                      <CardHeader className="bg-tech-subtle border-b border-tech-border">
                        <CardTitle className="text-tech-accent flex items-center">
                          <Lock className="mr-2 h-5 w-5" /> Best Practices
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6 space-y-4">
                        <ul className="space-y-3">
                          <li className="flex items-start gap-3">
                            <div className="mt-1.5 text-tech-highlight text-lg">•</div>
                            <p className="text-sm text-tech-text-secondary">Use dedicated API keys for QuillSwitch with proper access control</p>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="mt-1.5 text-tech-highlight text-lg">•</div>
                            <p className="text-sm text-tech-text-secondary">Regularly rotate your API keys for enhanced security</p>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="mt-1.5 text-tech-highlight text-lg">•</div>
                            <p className="text-sm text-tech-text-secondary">Avoid using personal accounts; create service accounts when possible</p>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="mt-1.5 text-tech-highlight text-lg">•</div>
                            <p className="text-sm text-tech-text-secondary">Never share API keys via email or insecure channels</p>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-tech-card border-tech-border shadow-tech">
                      <CardHeader className="bg-tech-subtle border-b border-tech-border">
                        <CardTitle className="text-tech-accent flex items-center">
                          <Shield className="mr-2 h-5 w-5" /> Security FAQ
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6 space-y-4">
                        <div className="space-y-4">
                          <div>
                            <h3 className="font-medium text-tech-text-primary">Where are my API keys stored?</h3>
                            <p className="text-sm text-tech-text-secondary mt-1">
                              Your encrypted API keys are stored in our secure vault using pgsodium encryption.
                            </p>
                          </div>
                          <div>
                            <h3 className="font-medium text-tech-text-primary">Can QuillSwitch access my API keys?</h3>
                            <p className="text-sm text-tech-text-secondary mt-1">
                              No. Your API keys are encrypted with your personal encryption key that only exists on your device.
                            </p>
                          </div>
                          <div>
                            <h3 className="font-medium text-tech-text-primary">What happens if I use a different device?</h3>
                            <p className="text-sm text-tech-text-secondary mt-1">
                              You'll need to reconnect your systems when using a new device for security reasons.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </FadeIn>
            </TabsContent>
          </Tabs>
        </div>
      </ConnectionProvider>
    </BaseLayout>
  );
};

export default ConnectionHub;
