
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useConnection } from "@/contexts/ConnectionContext";
import ContentSection from "@/components/layout/ContentSection";
import ProgressIndicator from "@/components/connection-hub/ProgressIndicator";
import ConnectionStatusCard from "./ConnectionStatusCard";
import NextStepsCard from "./NextStepsCard";

const SetupMigrationContent: React.FC = () => {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(false);
  
  // Redirect to the connection hub if needed
  const handleNeedConnection = () => {
    toast.info("Please connect your CRM systems before proceeding");
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
      toast.error("Please connect both source and destination CRMs first");
      return;
    }
    
    setIsChecking(true);
    
    // Simulate connection validation
    setTimeout(() => {
      navigate("/setup-wizard");
      // In a real implementation, this would be replaced with a redirect to the SetupWizard component
    }, 1500);
  };

  return (
    <div className="container px-4 py-8 max-w-6xl mx-auto">
      <ContentSection>
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Migration Setup</h1>
          <p className="text-muted-foreground">
            Configure your CRM migration settings
          </p>
        </div>
        
        <ProgressIndicator />
        
        <div className="grid gap-8">
          <ConnectionStatusCard handleNeedConnection={handleNeedConnection} />
          <NextStepsCard 
            handleNeedConnection={handleNeedConnection} 
            handleStartSetup={handleStartSetup}
            isChecking={isChecking}
          />
        </div>
      </ContentSection>
    </div>
  );
};

export default SetupMigrationContent;
