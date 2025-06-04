
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Database, 
  ArrowRight, 
  CheckCircle, 
  Globe,
  Zap,
  Shield,
  Settings
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth";
import FadeIn from "@/components/animations/FadeIn";
import GlassPanel from "@/components/ui-elements/GlassPanel";
import ConnectionSection from "@/components/connection-hub/ConnectionSection";
import EcosystemAutoConnector from "./EcosystemAutoConnector";

const MigrationSetupContent: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("connect");
  const [setupProgress, setSetupProgress] = useState(0);
  const [connectedEcosystemTools, setConnectedEcosystemTools] = useState<any[]>([]);

  const handleStartMigration = () => {
    if (setupProgress < 100) {
      toast.error("Please complete all setup steps before starting migration.");
      return;
    }
    
    toast.success("Migration started successfully!");
    navigate("/app/migrations/new");
  };

  const handleEcosystemToolsConnected = (tools: any[]) => {
    setConnectedEcosystemTools(tools);
    toast.success(`Connected ${tools.length} ecosystem tools for auto-reconnection.`);
    updateSetupProgress();
  };

  const updateSetupProgress = () => {
    // Calculate progress based on completed steps
    let progress = 0;
    if (connectedEcosystemTools.length > 0) progress += 25;
    // Add other progress indicators as needed
    setSetupProgress(progress);
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              Please log in to access the migration setup.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/auth")}>
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <FadeIn>
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold">Migration Setup</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Set up your CRM migration by connecting your systems and configuring the Ecosystem Auto-Connector 
              to ensure all your integrated tools are seamlessly reconnected after migration.
            </p>
          </div>

          {/* Progress Overview */}
          <GlassPanel className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Setup Progress</h2>
                <span className="text-sm text-muted-foreground">{setupProgress}% Complete</span>
              </div>
              <Progress value={setupProgress} className="w-full" />
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className={`h-4 w-4 ${setupProgress >= 25 ? 'text-green-500' : 'text-muted-foreground'}`} />
                  <span className="text-sm">Ecosystem Scan</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className={`h-4 w-4 ${setupProgress >= 50 ? 'text-green-500' : 'text-muted-foreground'}`} />
                  <span className="text-sm">CRM Connection</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className={`h-4 w-4 ${setupProgress >= 75 ? 'text-green-500' : 'text-muted-foreground'}`} />
                  <span className="text-sm">Data Mapping</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className={`h-4 w-4 ${setupProgress >= 100 ? 'text-green-500' : 'text-muted-foreground'}`} />
                  <span className="text-sm">Ready to Migrate</span>
                </div>
              </div>
            </div>
          </GlassPanel>

          {/* Main Setup Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="ecosystem" className="gap-2">
                <Globe className="h-4 w-4" />
                Ecosystem
              </TabsTrigger>
              <TabsTrigger value="connect" className="gap-2">
                <Database className="h-4 w-4" />
                Connect CRMs
              </TabsTrigger>
              <TabsTrigger value="configure" className="gap-2">
                <Settings className="h-4 w-4" />
                Configure
              </TabsTrigger>
              <TabsTrigger value="review" className="gap-2">
                <CheckCircle className="h-4 w-4" />
                Review
              </TabsTrigger>
            </TabsList>

            <TabsContent value="ecosystem" className="space-y-6">
              <EcosystemAutoConnector 
                projectId="setup-project"
                onToolsConnected={handleEcosystemToolsConnected}
              />
              
              <div className="flex justify-end">
                <Button 
                  onClick={() => setActiveTab("connect")}
                  className="gap-2"
                >
                  Continue to CRM Setup
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="connect" className="space-y-6">
              <div className="grid gap-6">
                <ConnectionSection 
                  title="Source CRM"
                  description="Connect your current CRM system to extract data"
                  type="source"
                />
                
                <ConnectionSection 
                  title="Destination CRM"
                  description="Connect your target CRM system to receive migrated data"
                  type="destination"
                />
              </div>
              
              <div className="flex justify-between">
                <Button 
                  variant="outline"
                  onClick={() => setActiveTab("ecosystem")}
                  className="gap-2"
                >
                  Back to Ecosystem
                </Button>
                <Button 
                  onClick={() => setActiveTab("configure")}
                  className="gap-2"
                >
                  Continue to Configuration
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="configure" className="space-y-6">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Migration Configuration
                    </CardTitle>
                    <CardDescription>
                      Configure your migration settings and data mapping preferences.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-6 bg-muted/30 rounded-lg text-center">
                      <Settings className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
                      <h3 className="font-medium mb-2">Advanced Configuration</h3>
                      <p className="text-sm text-muted-foreground">
                        Detailed migration configuration options will be available here.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="flex justify-between">
                <Button 
                  variant="outline"
                  onClick={() => setActiveTab("connect")}
                  className="gap-2"
                >
                  Back to Connections
                </Button>
                <Button 
                  onClick={() => setActiveTab("review")}
                  className="gap-2"
                >
                  Review Setup
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="review" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Setup Review
                  </CardTitle>
                  <CardDescription>
                    Review your migration setup before starting the process.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4">
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-medium mb-2">Ecosystem Auto-Connector</h3>
                      <p className="text-sm text-muted-foreground">
                        {connectedEcosystemTools.length > 0 
                          ? `${connectedEcosystemTools.length} tools configured for auto-reconnection`
                          : "No ecosystem tools configured"}
                      </p>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-medium mb-2">CRM Connections</h3>
                      <p className="text-sm text-muted-foreground">
                        Source and destination CRM configuration
                      </p>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <Button 
                      onClick={handleStartMigration}
                      className="w-full gap-2"
                      size="lg"
                    >
                      <Zap className="h-4 w-4" />
                      Start Migration
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex justify-start">
                <Button 
                  variant="outline"
                  onClick={() => setActiveTab("configure")}
                  className="gap-2"
                >
                  Back to Configuration
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </FadeIn>
    </div>
  );
};

export default MigrationSetupContent;
