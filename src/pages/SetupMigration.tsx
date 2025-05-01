
import React, { useState } from "react";
import BaseLayout from "@/components/layout/BaseLayout";
import ContentSection from "@/components/layout/ContentSection";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useConnection } from "@/contexts/ConnectionContext";
import { ArrowRight, Check, Info, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const SetupMigration = () => {
  const navigate = useNavigate();
  const { connectedSystems } = useConnection();
  const [isChecking, setIsChecking] = useState(false);
  
  // Check for connected source and destination CRMs
  const sourceCrms = connectedSystems.filter(system => system.type === "source");
  const destinationCrms = connectedSystems.filter(system => system.type === "destination");
  
  const hasSourceCrm = sourceCrms.length > 0;
  const hasDestinationCrm = destinationCrms.length > 0;
  
  // Redirect to the connection hub if needed
  const handleNeedConnection = () => {
    toast.info("Please connect your CRM systems before proceeding");
    navigate("/connect");
  };
  
  // Handle starting the migration setup wizard
  const handleStartSetup = () => {
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
    <BaseLayout>
      <div className="container px-4 py-8 max-w-6xl mx-auto">
        <ContentSection>
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Migration Setup</h1>
            <p className="text-muted-foreground">
              Configure your CRM migration settings
            </p>
          </div>
          
          <div className="grid gap-8">
            {/* Connection Status Card */}
            <Card>
              <CardHeader>
                <CardTitle>Connection Status</CardTitle>
                <CardDescription>
                  Check the status of your CRM connections
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-md bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      hasSourceCrm 
                        ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" 
                        : "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
                    }`}>
                      {hasSourceCrm ? <Check className="h-4 w-4" /> : "1"}
                    </div>
                    <div>
                      <h3 className="font-medium">Source CRM</h3>
                      <p className="text-xs text-muted-foreground">Your original CRM system</p>
                    </div>
                  </div>
                  
                  <div>
                    {hasSourceCrm ? (
                      <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                        Connected: {sourceCrms[0]?.name}
                      </span>
                    ) : (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleNeedConnection}
                      >
                        Connect Source
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-md bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      hasDestinationCrm 
                        ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" 
                        : "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
                    }`}>
                      {hasDestinationCrm ? <Check className="h-4 w-4" /> : "2"}
                    </div>
                    <div>
                      <h3 className="font-medium">Destination CRM</h3>
                      <p className="text-xs text-muted-foreground">Your target CRM system</p>
                    </div>
                  </div>
                  
                  <div>
                    {hasDestinationCrm ? (
                      <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                        Connected: {destinationCrms[0]?.name}
                      </span>
                    ) : (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleNeedConnection}
                      >
                        Connect Destination
                      </Button>
                    )}
                  </div>
                </div>
                
                {/* Related Tools Status */}
                <div className="flex items-center justify-between p-3 rounded-md bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                      <Info className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-medium">Related Tools</h3>
                      <p className="text-xs text-muted-foreground">Other tools and applications</p>
                    </div>
                  </div>
                  
                  <div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleNeedConnection}
                    >
                      Manage Tools
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Next Steps Card */}
            <Card>
              <CardHeader>
                <CardTitle>Next Steps</CardTitle>
                <CardDescription>
                  Continue setting up your migration
                </CardDescription>
              </CardHeader>
              <CardContent>
                {(!hasSourceCrm || !hasDestinationCrm) ? (
                  <Alert className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
                    <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    <AlertDescription className="text-amber-700 dark:text-amber-300">
                      Please connect both your source and destination CRM systems before proceeding with migration setup.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                    <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <AlertDescription className="text-green-700 dark:text-green-300">
                      Your CRM systems are connected. You can now continue with the migration setup.
                    </AlertDescription>
                  </Alert>
                )}
                
                <div className="mt-6 flex gap-4">
                  <Button 
                    variant="outline" 
                    onClick={handleNeedConnection}
                  >
                    Back to Connection Hub
                  </Button>
                  
                  <Button 
                    onClick={handleStartSetup} 
                    disabled={!hasSourceCrm || !hasDestinationCrm || isChecking}
                  >
                    {isChecking ? (
                      "Checking connections..."
                    ) : (
                      <>Continue <ArrowRight className="ml-2 h-4 w-4" /></>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </ContentSection>
      </div>
    </BaseLayout>
  );
};

export default SetupMigration;
