
import React from "react";
import { Database, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import MigrationStep from "./MigrationStep";
import GlassPanel from "@/components/ui-elements/GlassPanel";

type MigrationStep = {
  name: string;
  status: 'pending' | 'in_progress' | 'complete';
  progress: number;
};

type MigrationVisualizerProps = {
  migrationStatus: "idle" | "loading" | "success";
  steps: MigrationStep[];
  overallProgress: number;
  onClick: () => void;
}

const MigrationVisualizer = ({ 
  migrationStatus, 
  steps, 
  overallProgress, 
  onClick 
}: MigrationVisualizerProps) => {
  return (
    <GlassPanel 
      className={`p-6 transition-all duration-500 cursor-pointer hover:shadow-lg hover:scale-105 ${
        migrationStatus === "success" ? "bg-gradient-to-br from-green-50/20 to-green-100/10 dark:from-green-900/10 dark:to-green-800/5" : ""
      }`}
      onClick={onClick}
      intensity="medium"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="bg-red-100 text-red-600 p-2 rounded-full">
              <Database size={20} />
            </div>
            <span className="font-medium">Salesforce</span>
          </div>
          <Badge variant="outline" className="backdrop-blur-sm">Source</Badge>
        </div>
        
        {migrationStatus === "idle" && (
          <div className="flex items-center justify-center py-12 opacity-80">
            <Database className="h-8 w-8 text-brand-500 animate-pulse" />
          </div>
        )}
        
        {migrationStatus === "loading" && (
          <div className="py-4 space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Migration Progress</span>
              <span className="text-sm font-medium">{overallProgress}%</span>
            </div>
            <Progress 
              value={overallProgress} 
              className="h-2 transition-all duration-700 ease-in-out" 
            />
            
            <div className="space-y-4 max-h-48 overflow-y-auto py-2 pr-1 scrollbar-thin">
              {steps.map((step) => (
                <MigrationStep 
                  key={step.name} 
                  name={step.name} 
                  status={step.status} 
                  progress={step.progress} 
                />
              ))}
            </div>
          </div>
        )}
        
        {migrationStatus === "success" && (
          <div className="flex flex-col items-center justify-center py-12 space-y-3">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-green-500/20 animate-ping"></div>
              <div className="relative bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-3 rounded-full backdrop-blur-sm">
                <Check className="h-8 w-8" />
              </div>
            </div>
            <div className="text-green-600 dark:text-green-400 font-medium">All data migrated successfully!</div>
          </div>
        )}
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800 mt-2">
          <div className="flex items-center gap-3">
            <div className="bg-orange-100 text-orange-600 p-2 rounded-full">
              <Database size={20} />
            </div>
            <span className="font-medium">HubSpot</span>
          </div>
          <Badge variant="outline" className="backdrop-blur-sm">Destination</Badge>
        </div>
      </div>
      
      {migrationStatus === "idle" && (
        <div className="text-center mt-6 text-sm text-muted-foreground animate-pulse">
          Click to see a demo migration
        </div>
      )}
      
      {migrationStatus === "success" && (
        <div className="text-center mt-6 text-sm font-medium text-green-500">
          Migration complete! Click to run again.
        </div>
      )}
    </GlassPanel>
  );
};

export default MigrationVisualizer;
