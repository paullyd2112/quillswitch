
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
    <Card className="border-slate-700 dark:border-slate-700 bg-slate-900">
      <CardHeader className="pb-3">
        <CardTitle className="text-3xl font-semibold text-white">Next Steps</CardTitle>
        <CardDescription className="text-slate-400 text-lg">
          Continue setting up your migration
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {(!hasSourceCrm || !hasDestinationCrm) ? (
          <Alert className="bg-amber-900/20 border-amber-800 text-amber-300">
            <AlertCircle className="h-5 w-5 text-amber-400" />
            <AlertDescription className="text-amber-300 text-lg ml-2">
              Please connect both your source and destination CRM systems before proceeding with migration setup.
            </AlertDescription>
          </Alert>
        ) : (
          <Alert className="bg-green-900/20 border-green-800 text-green-300">
            <Check className="h-5 w-5 text-green-400" />
            <AlertDescription className="text-green-300 text-lg ml-2">
              Your CRM systems are connected. You can now continue with the migration setup.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="mt-8 flex gap-4">
          <Button 
            variant="outline" 
            onClick={handleNeedConnection}
            size="lg"
            className="bg-slate-800 border-slate-600 text-white hover:bg-slate-700"
          >
            Back to Connection Hub
          </Button>
          
          <Button 
            onClick={handleStartSetup} 
            disabled={!hasSourceCrm || !hasDestinationCrm || isChecking}
            size="lg"
            className="bg-brand-600 hover:bg-brand-700"
          >
            {isChecking ? (
              "Checking connections..."
            ) : (
              <>Continue <ArrowRight className="ml-2 h-5 w-5" /></>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NextStepsCard;
