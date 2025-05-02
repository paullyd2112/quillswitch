
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Info } from "lucide-react";
import { useConnection } from "@/contexts/ConnectionContext";

interface ConnectionStatusCardProps {
  handleNeedConnection: () => void;
}

const ConnectionStatusCard: React.FC<ConnectionStatusCardProps> = ({ handleNeedConnection }) => {
  const { connectedSystems } = useConnection();

  // Check for connected source and destination CRMs
  const sourceCrms = connectedSystems.filter(system => system.type === "source");
  const destinationCrms = connectedSystems.filter(system => system.type === "destination");
  
  const hasSourceCrm = sourceCrms.length > 0;
  const hasDestinationCrm = destinationCrms.length > 0;

  return (
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
  );
};

export default ConnectionStatusCard;
