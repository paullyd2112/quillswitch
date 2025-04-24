
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRightLeft, Database, Globe, Server, Layers, Zap, Shield } from "lucide-react";
import GlassPanel from "@/components/ui-elements/GlassPanel";

interface CrmArchitectureDiagramProps {
  sourceCrm?: string;
  destinationCrm?: string;
  connectedTools?: Array<{
    name: string;
    category: "marketing" | "support" | "sales" | "analytics" | "other";
  }>;
  className?: string;
}

const CrmArchitectureDiagram: React.FC<CrmArchitectureDiagramProps> = ({
  sourceCrm = "Salesforce",
  destinationCrm = "HubSpot",
  connectedTools = [],
  className,
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
      <Card className="shadow-md">
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-6">CRM Integration Architecture</h3>
          
          <div className="relative h-[400px] rounded-lg border border-dashed border-border bg-slate-50 dark:bg-slate-900/50 p-4">
            {/* Source CRM Box */}
            <div className="absolute left-6 top-1/2 -translate-y-1/2 w-[120px]">
              <GlassPanel className="h-[180px] flex flex-col items-center justify-center text-center p-3">
                <Database className="h-10 w-10 mb-2 text-blue-500" />
                <div className="text-sm font-medium mb-1">Source CRM</div>
                <Badge variant="outline" className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
                  {sourceCrm}
                </Badge>
              </GlassPanel>
            </div>
            
            {/* Destination CRM Box */}
            <div className="absolute right-6 top-1/2 -translate-y-1/2 w-[120px]">
              <GlassPanel className="h-[180px] flex flex-col items-center justify-center text-center p-3">
                <Database className="h-10 w-10 mb-2 text-green-500" />
                <div className="text-sm font-medium mb-1">Target CRM</div>
                <Badge variant="outline" className="bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800">
                  {destinationCrm}
                </Badge>
              </GlassPanel>
            </div>
            
            {/* Central Migration Engine */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[180px]">
              <GlassPanel className="h-[240px] flex flex-col items-center justify-center text-center p-4">
                <div className="bg-brand-100 dark:bg-brand-900/50 p-3 rounded-full mb-3">
                  <ArrowRightLeft className="h-8 w-8 text-brand-600" />
                </div>
                <div className="font-medium mb-1">Integration Engine</div>
                <div className="text-xs text-muted-foreground mb-3">
                  Secure data migration with mapping preservation
                </div>
                <div className="grid grid-cols-2 gap-2 w-full">
                  <div className="flex flex-col items-center text-xs p-1 bg-brand-50/50 dark:bg-brand-900/20 rounded border border-brand-100 dark:border-brand-800/30">
                    <Server size={12} className="mb-1" />
                    <span>Extract</span>
                  </div>
                  <div className="flex flex-col items-center text-xs p-1 bg-brand-50/50 dark:bg-brand-900/20 rounded border border-brand-100 dark:border-brand-800/30">
                    <Layers size={12} className="mb-1" />
                    <span>Transform</span>
                  </div>
                  <div className="flex flex-col items-center text-xs p-1 bg-brand-50/50 dark:bg-brand-900/20 rounded border border-brand-100 dark:border-brand-800/30">
                    <Shield size={12} className="mb-1" />
                    <span>Validate</span>
                  </div>
                  <div className="flex flex-col items-center text-xs p-1 bg-brand-50/50 dark:bg-brand-900/20 rounded border border-brand-100 dark:border-brand-800/30">
                    <Database size={12} className="mb-1" />
                    <span>Load</span>
                  </div>
                </div>
              </GlassPanel>
            </div>
            
            {/* Connected Tools */}
            <div className="absolute left-0 right-0 bottom-4 flex justify-center">
              <GlassPanel className="px-4 py-2">
                <div className="text-xs font-medium mb-1 text-center">Connected External Tools</div>
                <div className="flex flex-wrap gap-2 justify-center">
                  {Object.entries(toolsByCategory).length > 0 ? (
                    Object.entries(toolsByCategory).map(([category, tools]) => (
                      <div key={category} className="flex items-center">
                        {categoryIcons[category as keyof typeof categoryIcons]}
                        <span className="ml-1 text-xs">
                          {tools.map(t => t.name).join(', ')}
                        </span>
                      </div>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground">Marketing, Analytics, Support & Automation tools</span>
                  )}
                </div>
              </GlassPanel>
            </div>
            
            {/* Connection Lines */}
            <div className="absolute left-[126px] top-1/2 w-[calc(50%-126px-90px)] h-0 border-t border-dashed border-gray-300 dark:border-gray-700" />
            <div className="absolute right-[126px] top-1/2 w-[calc(50%-126px-90px)] h-0 border-t border-dashed border-gray-300 dark:border-gray-700" />
            
            {/* Vertical connection to tools */}
            <div className="absolute left-1/2 top-[240px] w-0 h-[80px] border-l border-dashed border-gray-300 dark:border-gray-700" />
            
            {/* Data Models Box (Top) */}
            <div className="absolute left-1/2 top-4 -translate-x-1/2 w-[220px]">
              <GlassPanel className="h-[80px] flex items-center justify-center p-3">
                <div className="text-center">
                  <div className="font-medium text-sm mb-1">Universal Data Model</div>
                  <div className="text-xs text-muted-foreground">
                    Standardized schema mapping across CRMs
                  </div>
                </div>
              </GlassPanel>
            </div>
            
            {/* Vertical connection to data model */}
            <div className="absolute left-1/2 top-[84px] w-0 h-[46px] border-l border-dashed border-gray-300 dark:border-gray-700" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CrmArchitectureDiagram;
