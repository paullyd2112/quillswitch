
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useConnection } from "@/contexts/ConnectionContext";
import { useUserOnboarding } from "@/components/onboarding/UserOnboardingProvider";
import ContentSection from "@/components/layout/ContentSection";
import ProgressIndicator from "@/components/connection-hub/ProgressIndicator";
import ConnectionStatusCard from "./ConnectionStatusCard";
import NextStepsCard from "./NextStepsCard";
import InteractiveArchitectureView from "@/components/migration/InteractiveArchitectureView";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";

const SetupMigrationContent: React.FC = () => {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(false);
  const { showOnboardingTour } = useUserOnboarding();
  
  // Redirect to the connection hub if needed
  const handleNeedConnection = () => {
    toast({
      title: "Connection Required",
      description: "Please connect your CRM systems before proceeding"
    });
    navigate("/connect");
  };
  
  // Handle starting the migration setup wizard
  const handleStartSetup = () => {
    const { connectedSystems } = useConnection();
    
    // Check for connected source and destination CRMs
    const sourceCrms = connectedSystems.filter(system => system.type === "source");
    const destinationCrms = connectedSystems.filter(system => system.type === "destination");
    
    const hasSourceCrm = sourceCrms.length > 0;
    const hasDestinationCrm = destinationCrms.length > 0;
    
    if (!hasSourceCrm || !hasDestinationCrm) {
      toast({
        title: "Connection Required",
        description: "Please connect both source and destination CRMs first",
        variant: "destructive",
      });
      return;
    }
    
    setIsChecking(true);
    
    // Simulate connection validation
    setTimeout(() => {
      // Create a new migration and redirect to the wizard
      toast({
        title: "Success",
        description: "Migration setup initialized successfully!"
      });
      navigate("/setup-wizard");
      // In a real implementation, this would create a migration and redirect to its dashboard
    }, 1500);
  };

  return (
    <div className="container px-4 py-8 max-w-6xl mx-auto">
      <ContentSection>
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Migration Setup</h1>
            <p className="text-muted-foreground">
              Configure your CRM migration settings
            </p>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={showOnboardingTour}
            className="gap-1.5"
          >
            <Info size={16} />
            Setup Guide
          </Button>
        </div>
        
        <ProgressIndicator />
        
        <div className="grid gap-8 mt-8">
          <InteractiveArchitectureView />
          
          <div className="grid md:grid-cols-2 gap-6">
            <ConnectionStatusCard handleNeedConnection={handleNeedConnection} />
            <NextStepsCard 
              handleNeedConnection={handleNeedConnection} 
              handleStartSetup={handleStartSetup}
              isChecking={isChecking}
            />
          </div>
        </div>
      </ContentSection>
    </div>
  );
};

export default SetupMigrationContent;
