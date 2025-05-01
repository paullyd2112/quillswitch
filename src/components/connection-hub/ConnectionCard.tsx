
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SystemConfig } from "@/config/connectionSystems";
import { useConnection } from "@/contexts/ConnectionContext";
import ConnectionModal from "./ConnectionModal";
import { Check, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ConnectionCardProps {
  system: SystemConfig;
  type: "source" | "destination" | "related";
}

const ConnectionCard: React.FC<ConnectionCardProps> = ({ system, type }) => {
  const { connectedSystems, currentSystem } = useConnection();
  const [showModal, setShowModal] = useState(false);
  
  const isConnected = connectedSystems.some(s => s.id === system.id);
  const isConnecting = currentSystem === system.id;
  
  return (
    <>
      <Card className={`p-4 transition-colors hover:bg-accent/5 ${
        isConnected ? "border-brand-200 dark:border-brand-800" : ""
      }`}>
        <div className="flex flex-col h-full">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center">
              {system.icon && (
                <div className="w-8 h-8 bg-muted rounded-md mr-3 flex items-center justify-center text-muted-foreground">
                  {system.icon}
                </div>
              )}
              <div>
                <h3 className="font-medium">{system.name}</h3>
                <p className="text-xs text-muted-foreground">{system.description}</p>
              </div>
            </div>
            {isConnected && (
              <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800">
                <Check className="h-3 w-3 mr-1" />
                Connected
              </Badge>
            )}
          </div>
          
          <div className="mt-auto pt-3">
            <div className="flex justify-between items-center">
              <Button 
                variant={isConnected ? "outline" : "default"}
                size="sm"
                onClick={() => setShowModal(true)}
                disabled={isConnecting}
                className={isConnected ? "text-brand-600 border-brand-200 hover:bg-brand-50" : ""}
              >
                {isConnected ? "Reconfigure" : "Connect"}
              </Button>
              
              {system.docsUrl && (
                <Button variant="ghost" size="sm" asChild>
                  <a href={system.docsUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Docs
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>
      
      {showModal && (
        <ConnectionModal
          system={system}
          type={type}
          isOpen={showModal}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export default ConnectionCard;
