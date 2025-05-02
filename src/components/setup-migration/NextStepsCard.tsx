
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, ArrowRight, Check } from "lucide-react";
import { useConnection } from "@/contexts/ConnectionContext";

interface NextStepsCardProps {
  handleNeedConnection: () => void;
  handleStartSetup: () => void;
  isChecking: boolean;
}

const NextStepsCard: React.FC<NextStepsCardProps> = ({ 
  handleNeedConnection, 
  handleStartSetup, 
  isChecking 
}) => {
  const { connectedSystems } = useConnection();
  
  // Check for connected source and destination CRMs
  const sourceCrms = connectedSystems.filter(system => system.type === "source");
  const destinationCrms = connectedSystems.filter(system => system.type === "destination");
  
  const hasSourceCrm = sourceCrms.length > 0;
  const hasDestinationCrm = destinationCrms.length > 0;

  return (
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
  );
};

export default NextStepsCard;
