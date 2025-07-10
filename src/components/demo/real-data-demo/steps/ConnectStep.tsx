import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Database, ExternalLink } from "lucide-react";
import { Connection } from "../types";

interface ConnectStepProps {
  connections: Connection[];
  selectedSource: string;
  selectedDestination: string;
  onSelectSource: (id: string) => void;
  onSelectDestination: (id: string) => void;
  onConnectCrm: () => void;
  onBack: () => void;
  onNext: () => void;
}

const ConnectStep: React.FC<ConnectStepProps> = ({
  connections,
  selectedSource,
  selectedDestination,
  onSelectSource,
  onSelectDestination,
  onConnectCrm,
  onBack,
  onNext
}) => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Connect Your CRMs</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Select your source and destination CRM systems. If you haven't connected your CRMs yet, 
          you can do so in a new tab.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
        <Card className="h-full">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl flex items-center justify-center gap-2">
              <Database className="h-5 w-5" />
              Source CRM
            </CardTitle>
            <CardDescription>Where your data currently lives</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            {connections.length > 0 ? (
              <div className="space-y-3 flex-1">
                {connections.map((conn) => (
                  <Button
                    key={conn.id}
                    variant={selectedSource === conn.id ? "default" : "outline"}
                    className="w-full justify-start h-auto p-4 relative z-10"
                    onClick={() => onSelectSource(conn.id)}
                  >
                    <Database className="mr-3 h-4 w-4 flex-shrink-0" />
                    <div className="text-left">
                      <div className="font-medium">{conn.name}</div>
                      <div className="text-xs opacity-70">({conn.type})</div>
                    </div>
                  </Button>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 flex-1 flex flex-col justify-center">
                <Database className="mx-auto h-16 w-16 text-muted-foreground mb-6" />
                <p className="text-sm text-muted-foreground mb-6">
                  No CRM connections found
                </p>
                <Button 
                  onClick={onConnectCrm} 
                  variant="outline" 
                  className="mx-auto relative z-10 pointer-events-auto"
                  style={{ pointerEvents: 'auto' }}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Connect Your CRMs
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="h-full">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl flex items-center justify-center gap-2">
              <Database className="h-5 w-5" />
              Destination CRM
            </CardTitle>
            <CardDescription>Where you want to migrate your data</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            {connections.length > 0 ? (
              <div className="space-y-3 flex-1">
                {connections
                  .filter(conn => conn.id !== selectedSource)
                  .map((conn) => (
                    <Button
                      key={conn.id}
                      variant={selectedDestination === conn.id ? "default" : "outline"}
                      className="w-full justify-start h-auto p-4 relative z-10"
                      onClick={() => onSelectDestination(conn.id)}
                    >
                      <Database className="mr-3 h-4 w-4 flex-shrink-0" />
                      <div className="text-left">
                        <div className="font-medium">{conn.name}</div>
                        <div className="text-xs opacity-70">({conn.type})</div>
                      </div>
                    </Button>
                  ))}
              </div>
            ) : (
              <div className="text-center py-12 flex-1 flex flex-col justify-center">
                <Database className="mx-auto h-16 w-16 text-muted-foreground mb-6" />
                <p className="text-sm text-muted-foreground mb-6">
                  No CRM connections found
                </p>
                <Button 
                  onClick={onConnectCrm} 
                  variant="outline" 
                  className="mx-auto relative z-10 pointer-events-auto"
                  style={{ pointerEvents: 'auto' }}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Connect Your CRMs
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between max-w-5xl mx-auto">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button 
          onClick={onNext}
          disabled={!selectedSource || !selectedDestination}
        >
          Next: Configure Demo
        </Button>
      </div>
    </div>
  );
};

export default ConnectStep;