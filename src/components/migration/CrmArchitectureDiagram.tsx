
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRightLeft, Database, Globe, Server, Layers, Zap, Shield } from "lucide-react";
import GlassPanel from "@/components/ui-elements/GlassPanel";
import ConnectionHealthIndicator from "@/components/integrations/ConnectionHealthIndicator";
import { ConnectionStatus } from "@/types/connectionHealth";

interface CrmArchitectureDiagramProps {
  sourceCrm?: string;
  destinationCrm?: string;
  connectedTools?: Array<{
    name: string;
    category: "marketing" | "support" | "sales" | "analytics" | "other";
  }>;
  className?: string;
  connectionStatus?: ConnectionStatus;
}

const CrmArchitectureDiagram: React.FC<CrmArchitectureDiagramProps> = ({
  sourceCrm = "Salesforce",
  destinationCrm = "HubSpot",
  connectedTools = [],
  className,
  connectionStatus = 'healthy'
}) => {
  // Group tools by category
  const toolsByCategory = connectedTools.reduce((acc, tool) => {
    if (!acc[tool.category]) {
      acc[tool.category] = [];
    }
    acc[tool.category].push(tool);
    return acc;
  }, {} as Record<string, typeof connectedTools>);
  
  const categoryIcons = {
    marketing: <Zap size={16} className="text-pink-500" />,
    support: <Shield size={16} className="text-blue-500" />,
    sales: <ArrowRightLeft size={16} className="text-green-500" />,
    analytics: <Layers size={16} className="text-amber-500" />,
    other: <Globe size={16} className="text-purple-500" />
  };

  return (
    <div className={className}>
      <Card className="shadow-md border-slate-700 dark:border-slate-700 bg-slate-900">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-medium text-white">CRM Integration Architecture</h3>
            <ConnectionHealthIndicator 
              status={connectionStatus} 
              showLabel 
              size="lg"
            />
          </div>
          
          <div className="relative h-[500px] rounded-lg border border-dashed border-slate-700 bg-slate-800 p-4">
            {/* Source CRM Box */}
            <div className="absolute left-8 top-1/2 -translate-y-1/2 w-[150px]">
              <GlassPanel className="h-[220px] flex flex-col items-center justify-center text-center p-4 bg-slate-800/80 border-slate-700">
                <Database className="h-14 w-14 mb-3 text-blue-400" />
                <div className="text-lg font-medium mb-2 text-white">Source CRM</div>
                <Badge variant="outline" className="bg-blue-900/30 text-blue-400 border-blue-700 py-2 px-4 text-base">
                  {sourceCrm}
                </Badge>
              </GlassPanel>
            </div>
            
            {/* Destination CRM Box */}
            <div className="absolute right-8 top-1/2 -translate-y-1/2 w-[150px]">
              <GlassPanel className="h-[220px] flex flex-col items-center justify-center text-center p-4 bg-slate-800/80 border-slate-700">
                <Database className="h-14 w-14 mb-3 text-green-400" />
                <div className="text-lg font-medium mb-2 text-white">Target CRM</div>
                <Badge variant="outline" className="bg-green-900/30 text-green-400 border-green-700 py-2 px-4 text-base">
                  {destinationCrm}
                </Badge>
              </GlassPanel>
            </div>
            
            {/* Central Migration Engine */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[240px]">
              <GlassPanel className="h-[280px] flex flex-col items-center justify-center text-center p-4 bg-slate-800/80 border-slate-700">
                <div className="text-xl font-medium mb-2 text-white">Integration Engine</div>
                <div className="text-slate-400 mb-4">
                  Secure data migration with mapping preservation
                </div>
                
                <div className="bg-brand-900/30 p-3 rounded-full mb-4">
                  <ArrowRightLeft className="h-10 w-10 text-brand-400" />
                </div>
                
                <div className="grid grid-cols-2 gap-3 w-full">
                  <div className="flex flex-col items-center p-2 bg-slate-900/60 rounded border border-slate-700">
                    <Server size={16} className="mb-1 text-white" />
                    <span className="text-white">Extract</span>
                  </div>
                  <div className="flex flex-col items-center p-2 bg-slate-900/60 rounded border border-slate-700">
                    <Layers size={16} className="mb-1 text-white" />
                    <span className="text-white">Transform</span>
                  </div>
                  <div className="flex flex-col items-center p-2 bg-slate-900/60 rounded border border-slate-700">
                    <Shield size={16} className="mb-1 text-white" />
                    <span className="text-white">Validate</span>
                  </div>
                  <div className="flex flex-col items-center p-2 bg-slate-900/60 rounded border border-slate-700">
                    <Database size={16} className="mb-1 text-white" />
                    <span className="text-white">Load</span>
                  </div>
                </div>
              </GlassPanel>
            </div>
            
            {/* Connection Lines */}
            <div className="absolute left-[158px] top-1/2 w-[calc(50%-158px-120px)] h-0 border-t-2 border-dashed border-slate-600" />
            <div className="absolute right-[158px] top-1/2 w-[calc(50%-158px-120px)] h-0 border-t-2 border-dashed border-slate-600" />
            
            {/* Data Models Box (Top) */}
            <div className="absolute left-1/2 top-6 -translate-x-1/2 w-[300px]">
              <GlassPanel className="h-[120px] flex flex-col items-center justify-center text-center p-4 bg-slate-800/80 border-slate-700">
                <div className="text-2xl font-medium mb-2 text-white">Universal Data Model</div>
                <div className="text-slate-400 text-lg">
                  Standardized schema mapping across CRMs
                </div>
              </GlassPanel>
            </div>
            
            {/* Vertical connection to data model */}
            <div className="absolute left-1/2 top-[126px] w-0 h-[46px] border-l-2 border-dashed border-slate-600" />
            
            {/* Connected Tools */}
            <div className="absolute left-0 right-0 bottom-8 flex justify-center">
              <GlassPanel className="px-6 py-3 bg-slate-800/80 border-slate-700">
                <div className="text-xl font-medium mb-2 text-white text-center">Connected External Tools</div>
                <div className="flex flex-wrap gap-3 justify-center">
                  {Object.entries(toolsByCategory).length > 0 ? (
                    Object.entries(toolsByCategory).map(([category, tools]) => (
                      <div key={category} className="flex items-center">
                        {categoryIcons[category as keyof typeof categoryIcons]}
                        <span className="ml-1 text-slate-300">
                          {tools.map(t => t.name).join(', ')}
                        </span>
                      </div>
                    ))
                  ) : (
                    <span className="text-slate-400 text-lg">Marketing, Analytics, Support & Automation tools</span>
                  )}
                </div>
              </GlassPanel>
            </div>
            
            {/* Vertical connection to tools */}
            <div className="absolute left-1/2 top-[320px] w-0 h-[100px] border-l-2 border-dashed border-slate-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CrmArchitectureDiagram;
