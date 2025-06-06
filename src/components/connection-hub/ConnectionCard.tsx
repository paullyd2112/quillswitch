
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SystemConfig } from "@/config/types/connectionTypes";
import { useConnection } from "@/contexts/ConnectionContext";
import ConnectionModal from "./ConnectionModal";
import { Check, ExternalLink, Key, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface ConnectionCardProps {
  system: SystemConfig;
  type: "source" | "destination" | "related";
}

const ConnectionCard: React.FC<ConnectionCardProps> = ({ system, type }) => {
  const { connectedSystems, currentSystem } = useConnection();
  const [showModal, setShowModal] = useState(false);
  
  const connectedSystem = connectedSystems.find(s => s.id === system.id);
  const isConnected = !!connectedSystem;
  const isConnecting = currentSystem === system.id;
  
  return (
    <>
      <Card className={`p-4 transition-colors hover:bg-accent/5 h-full flex flex-col ${
        isConnected ? "border-brand-200 dark:border-brand-800" : ""
      }`}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-medium">{system.name}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{system.description}</p>
          </div>
          {isConnected && (
            <div className="flex items-center gap-1 ml-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="text-green-700 dark:text-green-400 mr-1">
                    {connectedSystem?.authMethod === 'oauth' ? (
                      <Lock className="h-3 w-3" />
                    ) : (
                      <Key className="h-3 w-3" />
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">
                    {connectedSystem?.authMethod === 'oauth' 
                      ? 'Securely connected with OAuth' 
                      : 'Connected with encrypted API key'}
                  </p>
                </TooltipContent>
              </Tooltip>
              <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800">
                <Check className="h-3 w-3 mr-1" />
                Connected
              </Badge>
            </div>
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
