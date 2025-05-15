
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useConnection } from "@/contexts/ConnectionContext";

interface ConnectionStatusCardProps {
  handleNeedConnection: () => void;
}

const ConnectionStatusCard: React.FC<ConnectionStatusCardProps> = ({ 
  handleNeedConnection 
}) => {
  const { connectedSystems } = useConnection();
  
  // Extract source and destination systems
  const sourceSystem = connectedSystems.find(
    system => system.type === "source"
  );
  const destinationSystem = connectedSystems.find(
    system => system.type === "destination"
  );

  return (
    <Card className="border-slate-700 dark:border-slate-700 bg-slate-900">
      <CardHeader className="pb-3">
        <CardTitle className="text-4xl font-bold text-white">Connection Status</CardTitle>
        <p className="text-slate-400 text-xl mt-1">
          Check the status of your CRM connections
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-6">
          {/* Source CRM Connection */}
          <div className="bg-slate-800/70 rounded-lg p-6">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-amber-900/30 text-amber-500 font-bold text-xl">
                  1
                </div>
                <div>
                  <h3 className="text-3xl font-semibold text-white mb-1">Source CRM</h3>
                  <p className="text-slate-400 text-lg">Your original CRM system</p>
                </div>
              </div>
              
              {sourceSystem ? (
                <div className="flex items-center py-1 px-3 bg-green-900/20 border border-green-700 rounded-lg text-green-400">
                  <span className="h-2 w-2 bg-green-400 rounded-full mr-2"></span>
                  <span>Connected: {sourceSystem.name}</span>
                </div>
              ) : (
                <Button 
                  onClick={handleNeedConnection}
                  className="bg-slate-700 hover:bg-slate-600 gap-2"
                >
                  Connect Source
                </Button>
              )}
            </div>
          </div>
          
          {/* Destination CRM Connection */}
          <div className="bg-slate-800/70 rounded-lg p-6">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-amber-900/30 text-amber-500 font-bold text-xl">
                  2
                </div>
                <div>
                  <h3 className="text-3xl font-semibold text-white mb-1">Destination CRM</h3>
                  <p className="text-slate-400 text-lg">Your target CRM system</p>
                </div>
              </div>
              
              {destinationSystem ? (
                <div className="flex items-center py-1 px-3 bg-green-900/20 border border-green-700 rounded-lg text-green-400">
                  <span className="h-2 w-2 bg-green-400 rounded-full mr-2"></span>
                  <span>Connected: {destinationSystem.name}</span>
                </div>
              ) : (
                <Button 
                  onClick={handleNeedConnection}
                  className="bg-slate-700 hover:bg-slate-600 gap-2"
                >
                  Connect Destination
                </Button>
              )}
            </div>
          </div>
          
          {/* Related Tools */}
          <div className="bg-slate-800/70 rounded-lg p-6">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-900/30 text-blue-500 text-xl">
                  <span className="i">i</span>
                </div>
                <div>
                  <h3 className="text-3xl font-semibold text-white mb-1">Related Tools</h3>
                  <p className="text-slate-400 text-lg">Other tools and integrations</p>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                className="bg-slate-800 border-slate-600 text-white hover:bg-slate-700"
              >
                Manage Tools
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConnectionStatusCard;
