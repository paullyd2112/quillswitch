
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, ExternalLink, AlertCircle, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { SystemConfig } from "@/config/connectionSystems";
import { useConnection } from "@/contexts/ConnectionContext";
import ConnectionModal from "./ConnectionModal";

interface ToolCardProps {
  tool: SystemConfig;
}

type ReconnectionCapability = "full" | "partial" | "basic" | "manual";

interface ReconnectionInfo {
  capability: ReconnectionCapability;
  label: string;
  icon: React.ReactNode;
  description: string;
  color: string;
}

const reconnectionInfoMap: Record<ReconnectionCapability, ReconnectionInfo> = {
  full: {
    capability: "full",
    label: "Full Auto-Reconnection",
    icon: <Check className="h-4 w-4" />,
    description: "This tool can be completely auto-reconnected after migration",
    color: "text-green-600 dark:text-green-400"
  },
  partial: {
    capability: "partial",
    label: "Partial Auto-Reconnection",
    icon: <AlertCircle className="h-4 w-4" />,
    description: "Some configuration may need manual review after migration",
    color: "text-amber-600 dark:text-amber-400"
  },
  basic: {
    capability: "basic",
    label: "Basic Reconnection",
    icon: <Info className="h-4 w-4" />,
    description: "Credentials will be transferred, but manual configuration is needed",
    color: "text-blue-600 dark:text-blue-400"
  },
  manual: {
    capability: "manual",
    label: "Manual Reconnection Required",
    icon: <AlertCircle className="h-4 w-4" />,
    description: "This tool requires manual reconnection after migration",
    color: "text-red-600 dark:text-red-400"
  }
};

// Helper function to determine reconnection capability (would be from backend in real app)
const getReconnectionCapability = (toolId: string): ReconnectionCapability => {
  // Simple mapping for demo purposes
  const capabilityMap: Record<string, ReconnectionCapability> = {
    salesforce: "full",
    hubspot: "full",
    dynamics: "partial",
    zoho: "partial",
    pipedrive: "full",
    salesloft: "partial",
    marketo: "basic",
    outreach: "basic",
    gong: "basic",
    zoominfo: "manual",
    pardot: "partial"
  };
  
  return capabilityMap[toolId] || "manual";
};

const ToolCard: React.FC<ToolCardProps> = ({ tool }) => {
  const { connectedSystems, currentSystem } = useConnection();
  const [showModal, setShowModal] = useState(false);
  
  const isConnected = connectedSystems.some(s => s.id === tool.id);
  const isConnecting = currentSystem === tool.id;
  
  // Get reconnection capability
  const reconnectionCapability = getReconnectionCapability(tool.id);
  const reconnectionInfo = reconnectionInfoMap[reconnectionCapability];
  
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
                <div className={`flex items-center text-xs mt-1 ${reconnectionInfo.color}`}>
                  {reconnectionInfo.icon}
                  <span className="ml-1">{reconnectionInfo.label}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">{reconnectionInfo.description}</p>
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
