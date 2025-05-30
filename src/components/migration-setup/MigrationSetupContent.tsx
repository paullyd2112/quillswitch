
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProgressIndicator from "@/components/connection-hub/ProgressIndicator";
import CrmConnectionSection from "@/components/connection-hub/CrmConnectionSection";
import IntegratedToolsSection from "@/components/connection-hub/IntegratedToolsSection";
import WizardContainer from "@/components/setup-wizard/WizardContainer";
import ConnectionStatusCard from "@/components/setup-migration/ConnectionStatusCard";
import { useConnection } from "@/contexts/ConnectionContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Zap } from "lucide-react";
import GlassPanel from "@/components/ui-elements/GlassPanel";
import FadeIn from "@/components/animations/FadeIn";

const MigrationSetupContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState("connect");
  const { connectedSystems } = useConnection();
  
  // Check for connected source and destination CRMs
  const sourceCrms = connectedSystems.filter(system => system.type === "source");
  const destinationCrms = connectedSystems.filter(system => system.type === "destination");
  
  const hasRequiredConnections = sourceCrms.length > 0 && destinationCrms.length > 0;
  
  // Navigate to the wizard tab when connections are ready
  const handleContinueToWizard = () => {
    setActiveTab("wizard");
  };
  
  // Navigate back to the connections tab
  const handleBackToConnections = () => {
    setActiveTab("connect");
  };

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Background elements matching home page */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10 px-4 py-8 max-w-7xl mx-auto">
        <FadeIn>
          <div className="mb-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium rounded-full bg-primary/10 border border-primary/20 text-primary backdrop-blur-sm">
              <Zap className="h-4 w-4" />
              Migration Setup
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text">
              CRM Migration Setup
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Connect your systems and configure your migration with enterprise-grade security and AI-powered precision
            </p>
          </div>
        </FadeIn>
        
        <FadeIn delay="200">
          <GlassPanel className="mb-8 p-6">
            <ProgressIndicator />
          </GlassPanel>
        </FadeIn>
        
        <FadeIn delay="300">
          <GlassPanel className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="w-full sm:w-auto grid grid-cols-2 gap-1 bg-slate-900/50 border border-slate-700">
                <TabsTrigger 
                  value="connect" 
                  disabled={activeTab === "wizard" && !hasRequiredConnections}
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  1. Connect Systems
                </TabsTrigger>
                <TabsTrigger 
                  value="wizard" 
                  disabled={!hasRequiredConnections}
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  2. Configure Migration
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="connect" className="space-y-8">
                <div className="grid gap-8">
                  {/* Step 1: Connect Old CRM */}
                  <GlassPanel className="p-6">
                    <CrmConnectionSection 
                      step="1" 
                      title="Connect Old CRM" 
                      description="Select and connect your current CRM system that you want to migrate from"
                      type="source"
                    />
                  </GlassPanel>
                  
                  {/* Step 2: Connect New CRM */}
                  <GlassPanel className="p-6">
                    <CrmConnectionSection 
                      step="2" 
                      title="Connect New CRM" 
                      description="Select and connect your target CRM system where your data will be migrated to"
                      type="destination"
                    />
                  </GlassPanel>
                  
                  {/* Step 3: Connect Other Tools */}
                  <GlassPanel className="p-6">
                    <IntegratedToolsSection 
                      step="3" 
                      title="Connect Your Other Tools" 
                      description="Select and connect additional tools and applications you use with your CRM"
                    />
                  </GlassPanel>
                </div>
              
                <div className="flex justify-end pt-6">
                  <Button 
                    onClick={handleContinueToWizard} 
                    disabled={!hasRequiredConnections}
                    size="lg"
                    className="px-8 py-6 text-lg bg-primary hover:bg-primary/90 text-white transition-all duration-300 hover:scale-105 shadow-lg"
                  >
                    {hasRequiredConnections ? (
                      <>Continue to Configuration <ArrowRight size={20} className="ml-2" /></>
                    ) : (
                      <>Connect Source & Destination CRMs First</>
                    )}
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="wizard" className="space-y-6">
                <div className="mb-6 flex items-center">
                  <Button 
                    variant="outline" 
                    onClick={handleBackToConnections}
                    size="sm"
                    className="mr-4 gap-2 bg-slate-900/50 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
                  >
                    <ArrowLeft size={16} /> Back to Connections
                  </Button>
                  
                  <GlassPanel className="p-4">
                    <ConnectionStatusCard inline={true} />
                  </GlassPanel>
                </div>
                
                <WizardContainer />
              </TabsContent>
            </Tabs>
          </GlassPanel>
        </FadeIn>
      </div>
    </div>
  );
};

export default MigrationSetupContent;
