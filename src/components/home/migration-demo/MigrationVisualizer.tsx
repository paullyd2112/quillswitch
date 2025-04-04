
import React from "react";
import { Database } from "lucide-react";
import GlassPanel from "@/components/ui-elements/GlassPanel";
import MigrationHeader from "./MigrationHeader";
import MigrationStatus from "./MigrationStatus";
import MigrationFooter from "./MigrationFooter";
import MigrationProgressBar from "./MigrationProgressBar";
import type { MigrationStep } from "@/hooks/use-migration-demo";

type MigrationVisualizerProps = {
  migrationStatus: "idle" | "loading" | "success";
  steps: MigrationStep[];
  overallProgress: number;
  activeStep?: MigrationStep;
  onClick: () => void;
  performanceMetrics?: {
    averageRecordsPerSecond?: number;
    peakRecordsPerSecond?: number;
    estimatedTimeRemaining?: number;
    totalRecordsProcessed?: number;
    dataVolume?: number;
  };
}

const MigrationVisualizer = ({ 
  migrationStatus, 
  steps, 
  overallProgress, 
  activeStep,
  onClick,
  performanceMetrics
}: MigrationVisualizerProps) => {
  return (
    <GlassPanel 
      className={`p-6 transition-all duration-500 cursor-pointer hover:shadow-lg hover:scale-105 ${
        migrationStatus === "loading" 
          ? "bg-gradient-to-br from-brand-50/30 to-brand-100/10 dark:from-brand-900/20 dark:to-brand-800/5 border-brand-200/30 dark:border-brand-700/20" 
          : migrationStatus === "success"
            ? "bg-gradient-to-br from-green-50/20 to-green-100/10 dark:from-green-900/10 dark:to-green-800/5 border-green-200/30 dark:border-green-700/20"
            : ""
      }`}
      onClick={onClick}
      intensity="medium"
      hover={true}
    >
      <div className="space-y-4">
        <MigrationHeader 
          title="Salesforce" 
          type="source" 
          icon={<Database size={20} />} 
        />
        
        {migrationStatus === "idle" && <MigrationStatus status="idle" />}
        {migrationStatus === "loading" && (
          <MigrationStatus 
            status="loading" 
            activeStep={activeStep} 
            performanceMetrics={performanceMetrics} 
          />
        )}
        {migrationStatus === "success" && (
          <MigrationStatus 
            status="success" 
            performanceMetrics={performanceMetrics}
          />
        )}
        
        <MigrationHeader 
          title="HubSpot" 
          type="destination" 
          icon={<Database size={20} />} 
        />
        
        {/* Add Progress Bar */}
        {migrationStatus !== "idle" && (
          <MigrationProgressBar progress={overallProgress} />
        )}
      </div>
      
      <MigrationFooter status={migrationStatus} />
    </GlassPanel>
  );
};

export default MigrationVisualizer;
