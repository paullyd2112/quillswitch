
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Check, AlertCircle } from "lucide-react";
import { useConnection } from "@/contexts/ConnectionContext";

interface ConnectionStatusCardProps {
  handleNeedConnection?: () => void;
  inline?: boolean;
}

const ConnectionStatusCard: React.FC<ConnectionStatusCardProps> = ({ 
  handleNeedConnection,
  inline = false
}) => {
  const { connectedSystems } = useConnection();
  
  // Check for connected source and destination CRMs
  const sourceCrms = connectedSystems.filter(system => system.type === "source");
  const destinationCrms = connectedSystems.filter(system => system.type === "destination");
  
  const hasSourceCrm = sourceCrms.length > 0;
  const hasDestinationCrm = destinationCrms.length > 0;
  
  const sourceCrmNames = sourceCrms.map(system => system.name).join(', ');
  const destinationCrmNames = destinationCrms.map(system => system.name).join(', ');

  if (inline) {
    if (hasSourceCrm && hasDestinationCrm) {
      return (
        <Alert className="bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800 inline-flex w-auto">
          <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
          <AlertDescription className="text-green-700 dark:text-green-300">
            Connected: {sourceCrmNames} → {destinationCrmNames}
          </AlertDescription>
        </Alert>
      );
    }
    
    return (
      <Alert className="bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 inline-flex w-auto">
        <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
        <AlertDescription className="text-amber-700 dark:text-amber-300">
          {!hasSourceCrm && !hasDestinationCrm ? "No CRMs connected" : 
           !hasSourceCrm ? "Missing source CRM connection" : "Missing destination CRM connection"}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connection Status</CardTitle>
        <CardDescription>
          Check your CRM system connections
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <span className="font-medium">Source CRM</span>
            <span className={hasSourceCrm ? "text-green-500 flex items-center gap-1" : "text-amber-500 flex items-center gap-1"}>
              {hasSourceCrm ? (
                <>
                  <Check size={16} />
                  {sourceCrmNames}
                </>
              ) : (
                <>
                  <AlertCircle size={16} />
                  Not Connected
                </>
              )}
            </span>
          </div>
          
          <div className="flex items-center justify-between border-b pb-2">
            <span className="font-medium">Destination CRM</span>
            <span className={hasDestinationCrm ? "text-green-500 flex items-center gap-1" : "text-amber-500 flex items-center gap-1"}>
              {hasDestinationCrm ? (
                <>
                  <Check size={16} />
                  {destinationCrmNames}
                </>
              ) : (
                <>
                  <AlertCircle size={16} />
                  Not Connected
                </>
              )}
            </span>
          </div>
          
          {handleNeedConnection && (!hasSourceCrm || !hasDestinationCrm) && (
            <button 
              onClick={handleNeedConnection}
              className="text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 text-sm font-medium mt-2"
            >
              Connect your CRMs
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ConnectionStatusCard;
