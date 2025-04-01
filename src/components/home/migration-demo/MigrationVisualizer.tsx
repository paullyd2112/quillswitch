
import React from "react";
import { Database } from "lucide-react";
import GlassPanel from "@/components/ui-elements/GlassPanel";
import MigrationHeader from "./MigrationHeader";
import MigrationProgressBar from "./MigrationProgressBar";
import MigrationStepsList from "./MigrationStepsList";
import MigrationStatus from "./MigrationStatus";
import MigrationFooter from "./MigrationFooter";

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
        <MigrationHeader 
          title="Salesforce" 
          type="source" 
          icon={<Database size={20} />} 
        />
        
        {migrationStatus === "idle" && <MigrationStatus status="idle" />}
        
        {migrationStatus === "loading" && (
          <>
            <MigrationProgressBar progress={overallProgress} />
            <MigrationStepsList steps={steps} />
          </>
        )}
        
        {migrationStatus === "success" && <MigrationStatus status="success" />}
        
        <MigrationHeader 
          title="HubSpot" 
          type="destination" 
          icon={<Database size={20} />} 
        />
      </div>
      
      <MigrationFooter status={migrationStatus} />
    </GlassPanel>
  );
};

export default MigrationVisualizer;
