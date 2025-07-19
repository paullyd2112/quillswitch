
import React, { useState } from "react";
import BaseLayout from "@/components/layout/BaseLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
        <div className="mb-12 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 text-hero-gradient">Unified API Connection Hub</h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Connect your CRM systems through our <span className="text-primary font-semibold">unified API platform</span>. 
            Secure, fast, and reliable integrations with <span className="text-primary font-semibold">28+ CRM systems</span>.
          </p>
        </div>
        
        <div className="space-y-6 mb-8">
          <div className="badge-premium text-blue-400">
            <Info className="h-4 w-4" />
            <span className="font-semibold text-foreground">Setup Required</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">Connect at least 2 CRM systems (source and destination) to enable migration functionality</span>
          </div>
          
          <div className="badge-premium text-green-400">
            <Shield className="h-4 w-4" />
            <span className="font-semibold text-foreground">Enterprise Security</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">All connections use OAuth 2.0 authentication and Unified.to's secure infrastructure</span>
          </div>
        </div>
          
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="glass-panel p-1.5 h-auto">
            <TabsTrigger value="connections" className="gap-2 px-6 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Building2 className="h-4 w-4" />
              Connections
            </TabsTrigger>
            <TabsTrigger value="help" className="gap-2 px-6 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Users className="h-4 w-4" />
              Setup Guide
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2 px-6 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Shield className="h-4 w-4" />
              Security
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="connections" className="space-y-6">
            <div className="card-premium">
              <div className="p-8">
                <div className="mb-6">
                  <h3 className="font-display text-2xl font-bold mb-2">Native CRM Connections</h3>
                  <p className="text-muted-foreground">
                    Direct integrations with CRM systems (coming soon)
                  </p>
                </div>
                <div className="text-center space-y-6 py-12">
                  <p className="text-muted-foreground text-lg">
                    Native CRM connection management is being developed. Use the Salesforce integration in the migration flow for now.
                  </p>
                  <div className="btn-premium-primary interactive-premium" onClick={() => navigate("/app/migrate")}>
                    Go to Migration <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="help">
            <div className="card-premium">
              <ConnectionGuide />
            </div>
          </TabsContent>
          
          <TabsContent value="security">
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="font-display text-3xl font-bold mb-4 text-hero-gradient">Unified API Security</h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  Learn about the security measures protecting your CRM integrations through Unified.to.
                </p>
              </div>
              
              <div className="card-premium">
                <SecurityInfoCard />
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="card-premium">
                  <div className="p-8">
                    <div className="mb-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="icon-container bg-primary/10">
                          <Shield className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="font-display text-xl font-bold">Security Features</h3>
                      </div>
                    </div>
                    <ul className="space-y-4">
                      {[
                        "OAuth 2.0 authentication for all CRM connections",
                        "End-to-end encryption for all credential storage", 
                        "Automatic token refresh and secure session management",
                        "SOC 2 Type II compliant infrastructure via Unified.to"
                      ].map((feature, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="card-premium">
                  <div className="p-8">
                    <div className="mb-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="icon-container bg-primary/10">
                          <Shield className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="font-display text-xl font-bold">Privacy & Compliance</h3>
                      </div>
                    </div>
                    <div className="space-y-6">
                      {[
                        {
                          title: "How is my data protected?",
                          description: "All data is encrypted in transit and at rest. We never store your CRM credentials directly."
                        },
                        {
                          title: "GDPR Compliance", 
                          description: "Fully GDPR compliant data processing with user consent and data portability rights."
                        },
                        {
                          title: "Data Retention",
                          description: "Connection tokens are automatically refreshed and old tokens are securely deleted."
                        }
                      ].map((item, index) => (
                        <div key={index}>
                          <h4 className="font-semibold mb-2 text-foreground">{item.title}</h4>
                          <p className="text-muted-foreground">{item.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </BaseLayout>
  );
};

export default ConnectionHub;
