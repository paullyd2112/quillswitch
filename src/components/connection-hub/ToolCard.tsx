
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, ExternalLink, AlertCircle, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { SystemConfig } from "@/config/connectionSystems";
import { useConnection } from "@/contexts/ConnectionContext";
import ConnectionModal from "./ConnectionModal";
import { getReconnectionCapability, reconnectionInfoMap, ReconnectionCapability } from "@/utils/reconnectionCapabilityUtils";

interface ToolCardProps {
  tool: SystemConfig;
}

const ToolCard: React.FC<ToolCardProps> = ({ tool }) => {
  const { connectedSystems, currentSystem } = useConnection();
  const [showModal, setShowModal] = useState(false);
  
  const isConnected = connectedSystems.some(s => s.id === tool.id);
  const isConnecting = currentSystem === tool.id;
  
  // Get reconnection capability using our new utility function
  const reconnectionCapability = getReconnectionCapability(tool.id, tool.category);
  const reconnectionInfo = reconnectionInfoMap[reconnectionCapability];
  
  // Enhanced descriptions for tooltips
  const enhancedDescriptions = {
    full: "Automatically reconnects to your new CRM after migration. No action needed.",
    partial: "Some features reconnect automatically. Manual configuration of certain settings needed post-migration.",
    basic: "Credentials transfer. Manual reconfiguration of integration settings needed post-migration.",
    manual: "Requires complete setup in the tool after migration. Document current settings beforehand."
  };
  
  // Helper function to render the appropriate icon
  const renderIcon = (capability: ReconnectionCapability) => {
    switch (capability) {
      case "full":
        return <Check className="h-4 w-4" />;
      case "partial":
        return <AlertCircle className="h-4 w-4" />;
      case "basic":
        return <Info className="h-4 w-4" />;
      case "manual":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };
  
  return (
    <>
      <Card className={`p-4 transition-colors hover:bg-accent/5 h-full ${
        isConnected ? "border-brand-200 dark:border-brand-800" : ""
      }`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <div className="w-9 h-9 bg-muted rounded-md flex items-center justify-center text-muted-foreground mr-3">
                {tool.icon}
              </div>
            </div>
            {isConnected && (
              <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800">
                <Check className="h-3 w-3 mr-1" />
                Connected
              </Badge>
            )}
          </div>
          
          <h3 className="font-medium">{tool.name}</h3>
          <p className="text-xs text-muted-foreground mb-3">{tool.description}</p>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className={`flex items-center mt-2 px-2 py-1 rounded-full text-xs w-fit ${
                  reconnectionCapability === "full"
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800"
                    : reconnectionCapability === "partial"
                      ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800"
                      : reconnectionCapability === "basic"
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800"
                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800"
                }`}>
                  {renderIcon(reconnectionCapability)}
                  <span className="ml-1">{reconnectionInfo.label}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs p-3">
                <p>{enhancedDescriptions[reconnectionCapability] || reconnectionInfo.description}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
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
              
              {tool.docsUrl && (
                <Button variant="ghost" size="sm" asChild>
                  <a href={tool.docsUrl} target="_blank" rel="noopener noreferrer">
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
          system={tool}
          type="related"
          isOpen={showModal}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export default ToolCard;
