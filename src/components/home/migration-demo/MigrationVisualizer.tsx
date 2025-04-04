
import React from "react";
import GlassPanel from "@/components/ui-elements/GlassPanel";
import MigrationFooter from "./MigrationFooter";
import type { MigrationStep } from "@/hooks/use-migration-demo";
import MigrationHeaderSection from "./visualizer/MigrationHeaderSection";
import MigrationStatusSection from "./visualizer/MigrationStatusSection";
import MigrationProgressSection from "./visualizer/MigrationProgressSection";

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
        {/* Headers */}
        <MigrationHeaderSection 
          sourceTitle="Salesforce" 
          destinationTitle="HubSpot" 
        />
        
        {/* Status Section */}
        <MigrationStatusSection
          migrationStatus={migrationStatus}
          activeStep={activeStep}
          performanceMetrics={performanceMetrics}
        />
        
        {/* Progress Bar */}
        <MigrationProgressSection
          migrationStatus={migrationStatus}
          overallProgress={overallProgress}
        />
      </div>
      
      <MigrationFooter status={migrationStatus} />
    </GlassPanel>
  );
};

export default MigrationVisualizer;
