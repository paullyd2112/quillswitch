
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
import { createDefaultMigrationProject } from "@/services/migration/setupService";
import { startMigrationFromSetup } from "@/services/migration/executionService";
import { useSetupWizard } from "@/contexts/SetupWizardContext";
import FadeIn from "@/components/animations/FadeIn";
import GlassPanel from "@/components/ui-elements/GlassPanel";
import ConnectionSection from "@/components/connection-hub/ConnectionSection";
import EcosystemAutoConnector from "./EcosystemAutoConnector";

const MigrationSetupContent: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { formData, selectedSourceCrms, selectedDestinationCrms, multiCrmEnabled, multiDestinationEnabled, customCrmNames } = useSetupWizard();
  const [activeTab, setActiveTab] = useState("ecosystem");
  const [setupProgress, setSetupProgress] = useState(0);
  const [connectedEcosystemTools, setConnectedEcosystemTools] = useState<any[]>([]);
  const [crmConnectionsCompleted, setCrmConnectionsCompleted] = useState(false);
  const [configurationCompleted, setConfigurationCompleted] = useState(false);

  const handleStartMigration = async () => {
    if (setupProgress < 100) {
      toast.error("Please complete all setup steps before starting migration.");
      return;
    }
    
    try {
      // Create migration project from setup data
      const project = await createDefaultMigrationProject({
        ...formData,
        multiCrmSourceList: selectedSourceCrms,
        multiDestinationList: selectedDestinationCrms,
        multiCrmEnabled,
        multiDestinationEnabled,
        customCrmNames
      });

      if (project) {
        // Start migration execution
        const success = await startMigrationFromSetup(project.id);
        
        if (success) {
          toast.success("Migration started successfully!");
          navigate(`/app/migrations/${project.id}`);
        } else {
          toast.error("Failed to start migration execution.");
        }
      }
    } catch (error) {
      console.error("Failed to start migration:", error);
      toast.error("Failed to start migration. Please try again.");
    }
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
    if (crmConnectionsCompleted) progress += 35;
    if (configurationCompleted) progress += 40;
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
              
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className={`h-5 w-5 ${crmConnectionsCompleted ? 'text-green-500' : 'text-muted-foreground'}`} />
                  <span className="text-sm">
                    {crmConnectionsCompleted ? 'CRM connections completed' : 'Complete CRM connections'}
                  </span>
                </div>
                <Button 
                  onClick={() => {
                    setCrmConnectionsCompleted(true);
                    updateSetupProgress();
                  }}
                  disabled={crmConnectionsCompleted}
                  size="sm"
                >
                  {crmConnectionsCompleted ? 'Completed' : 'Mark Complete'}
                </Button>
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
                  disabled={!crmConnectionsCompleted}
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium mb-2">Batch Size</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Number of records to process at once
                        </p>
                        <div className="text-sm font-medium">100 records (recommended)</div>
                      </div>
                      
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium mb-2">Validation Level</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Data validation strictness
                        </p>
                        <div className="text-sm font-medium">Standard validation</div>
                      </div>
                      
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium mb-2">Error Handling</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          How to handle migration errors
                        </p>
                        <div className="text-sm font-medium">Continue on error</div>
                      </div>
                      
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium mb-2">Backup Strategy</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Data backup before migration
                        </p>
                        <div className="text-sm font-medium">Automatic backup</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className={`h-5 w-5 ${configurationCompleted ? 'text-green-500' : 'text-muted-foreground'}`} />
                  <span className="text-sm">
                    {configurationCompleted ? 'Configuration completed' : 'Review and confirm configuration'}
                  </span>
                </div>
                <Button 
                  onClick={() => {
                    setConfigurationCompleted(true);
                    updateSetupProgress();
                  }}
                  disabled={configurationCompleted}
                  size="sm"
                >
                  {configurationCompleted ? 'Completed' : 'Confirm Settings'}
                </Button>
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
                  disabled={!configurationCompleted}
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
