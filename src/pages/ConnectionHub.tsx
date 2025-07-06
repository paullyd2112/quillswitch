
import React, { useState } from "react";
import BaseLayout from "@/components/layout/BaseLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UnifiedConnectionManager from "@/components/unified/UnifiedConnectionManager";
import ConnectionGuide from "@/components/connection-hub/ConnectionGuide";
import SecurityInfoCard from "@/components/connection-hub/SecurityInfoCard";
import { ArrowRight, Info, Shield, Building2, CheckCircle, Users } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const ConnectionHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState("connections");
  const [connectionCount, setConnectionCount] = useState(0);
  const navigate = useNavigate();

  const handleConnectionChange = () => {
    // Refresh connection data when connections change
    setTimeout(() => {
      // This would normally fetch the actual count from the service
      setConnectionCount(prev => prev + 1);
    }, 1000);
  };

  const handleContinueToSetup = () => {
    if (connectionCount < 2) {
      alert("Please connect at least 2 systems (source and destination) to proceed with migration setup.");
      return;
    }
    navigate("/app/setup");
  };

  return (
    <BaseLayout>
      <div className="container px-4 py-8 max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Unified API Connection Hub</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Connect your CRM systems through our unified API platform. Secure, fast, and reliable integrations with 28+ CRM systems.
          </p>
        </div>
        
        <div className="space-y-4 mb-6">
          <Alert className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
            <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <AlertDescription className="text-blue-700 dark:text-blue-300">
              Connect at least 2 CRM systems (source and destination) to enable migration functionality.
            </AlertDescription>
          </Alert>
          
          <Alert className="bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800">
            <Shield className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertDescription className="text-green-700 dark:text-green-300">
              All connections use OAuth 2.0 authentication and are managed through Unified.to's secure infrastructure.
            </AlertDescription>
          </Alert>
        </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="w-full sm:w-auto grid grid-cols-3 gap-1">
              <TabsTrigger value="connections">
                <Building2 className="h-4 w-4 mr-2" />
                Connections
              </TabsTrigger>
              <TabsTrigger value="help">
                <Users className="h-4 w-4 mr-2" />
                Setup Guide
              </TabsTrigger>
              <TabsTrigger value="security">
                <Shield className="h-4 w-4 mr-2" />
                Security
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="connections" className="space-y-6">
              <UnifiedConnectionManager onConnectionChange={handleConnectionChange} />
              
              <Card className="border-2 border-dashed">
                <CardContent className="pt-6">
                  <div className="text-center space-y-4">
                    <h3 className="text-lg font-semibold">Ready to start your migration?</h3>
                    <p className="text-muted-foreground">
                      {connectionCount < 2 ? (
                        "Connect at least 2 systems to set up your migration"
                      ) : (
                        "Great! You have enough connections to proceed with migration setup"
                      )}
                    </p>
                    <Button 
                      onClick={handleContinueToSetup}
                      disabled={connectionCount < 2}
                      size="lg"
                      className="min-w-48"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Set Up Migration
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="help">
              <ConnectionGuide />
            </TabsContent>
            
            <TabsContent value="security">
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-2">Unified API Security</h2>
                <p className="text-muted-foreground mb-6">
                  Learn about the security measures protecting your CRM integrations through Unified.to.
                </p>
                
                <SecurityInfoCard />
                
                <div className="grid md:grid-cols-2 gap-6 mt-8">
                  <Card>
                    <CardHeader className="bg-blue-50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-800">
                      <CardTitle className="text-blue-800 dark:text-blue-400">Security Features</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      <ul className="space-y-3">
                        <li className="flex items-start gap-2">
                          <div className="mt-1 text-blue-600 dark:text-blue-400">•</div>
                          <p className="text-sm">OAuth 2.0 authentication for all CRM connections</p>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="mt-1 text-blue-600 dark:text-blue-400">•</div>
                          <p className="text-sm">End-to-end encryption for all credential storage</p>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="mt-1 text-blue-600 dark:text-blue-400">•</div>
                          <p className="text-sm">Automatic token refresh and secure session management</p>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="mt-1 text-blue-600 dark:text-blue-400">•</div>
                          <p className="text-sm">SOC 2 Type II compliant infrastructure via Unified.to</p>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Privacy & Compliance</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      <div className="space-y-3">
                        <div>
                          <h3 className="font-medium mb-1">How is my data protected?</h3>
                          <p className="text-sm text-muted-foreground">
                            All data is encrypted in transit and at rest. We never store your CRM credentials directly.
                          </p>
                        </div>
                        <div>
                          <h3 className="font-medium mb-1">GDPR Compliance</h3>
                          <p className="text-sm text-muted-foreground">
                            Fully GDPR compliant data processing with user consent and data portability rights.
                          </p>
                        </div>
                        <div>
                          <h3 className="font-medium mb-1">Data Retention</h3>
                          <p className="text-sm text-muted-foreground">
                            Connection tokens are automatically refreshed and old tokens are securely deleted.
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
    </BaseLayout>
  );
};

export default ConnectionHub;
