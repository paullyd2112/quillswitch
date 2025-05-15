
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ContentSection from "@/components/layout/ContentSection";
import ProgressIndicator from "@/components/connection-hub/ProgressIndicator";
import CrmConnectionSection from "@/components/connection-hub/CrmConnectionSection";
import IntegratedToolsSection from "@/components/connection-hub/IntegratedToolsSection";
import WizardContainer from "@/components/setup-wizard/WizardContainer";
import ConnectionStatusCard from "@/components/setup-migration/ConnectionStatusCard";
import { useConnection } from "@/contexts/ConnectionContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

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
    <div className="container px-4 py-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">CRM Migration Setup</h1>
        <p className="text-muted-foreground">
          Connect your systems and configure your migration in one place
        </p>
      </div>
      
      <ProgressIndicator />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="w-full sm:w-auto grid grid-cols-2 gap-1">
          <TabsTrigger value="connect" disabled={activeTab === "wizard" && !hasRequiredConnections}>
            1. Connect Systems
          </TabsTrigger>
          <TabsTrigger value="wizard" disabled={!hasRequiredConnections}>
            2. Configure Migration
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="connect" className="space-y-8">
          <div className="grid gap-8">
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
        
          <div className="flex justify-end pt-6">
            <Button 
              onClick={handleContinueToWizard} 
              disabled={!hasRequiredConnections}
              className="px-6 py-3 bg-brand-600 text-white rounded-md hover:bg-brand-700 transition-colors inline-flex items-center font-medium gap-2"
            >
              {hasRequiredConnections ? (
                <>Continue to Configuration <ArrowRight size={16} /></>
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
              className="mr-4 gap-2"
            >
              <ArrowLeft size={16} /> Back to Connections
            </Button>
            
            <ConnectionStatusCard inline={true} />
          </div>
          
          <WizardContainer />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MigrationSetupContent;
