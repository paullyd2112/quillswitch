
import React from "react";
import GlassPanel from "@/components/ui-elements/GlassPanel";
import MigrationFooter from "./MigrationFooter";
import type { MigrationStep, PerformanceMetrics } from "@/hooks/migration-demo/types";
import MigrationHeaderSection from "./visualizer/MigrationHeaderSection";
import MigrationStatusSection from "./visualizer/MigrationStatusSection";
import MigrationProgressSection from "./visualizer/MigrationProgressSection";

type MigrationVisualizerProps = {
  migrationStatus: "idle" | "loading" | "success" | "error";
  steps: MigrationStep[];
  overallProgress: number;
  activeStep?: MigrationStep;
  onClick: () => void;
  errorMessage?: string;
  performanceMetrics?: Partial<PerformanceMetrics>;
  onViewReport?: () => void;
}

const MigrationVisualizer = ({ 
  migrationStatus, 
  steps, 
  overallProgress, 
  activeStep,
  onClick,
  errorMessage,
  performanceMetrics,
  onViewReport
}: MigrationVisualizerProps) => {
  return (
    <GlassPanel 
      className={`p-6 transition-all duration-500 cursor-pointer hover:shadow-lg hover:scale-105 ${
        migrationStatus === "loading" 
          ? "bg-gradient-to-br from-brand-50/30 to-brand-100/10 dark:from-brand-900/20 dark:to-brand-800/5 border-brand-200/30 dark:border-brand-700/20" 
          : migrationStatus === "success"
            ? "bg-gradient-to-br from-green-50/20 to-green-100/10 dark:from-green-900/10 dark:to-green-800/5 border-green-200/30 dark:border-green-700/20"
            : migrationStatus === "error"
              ? "bg-gradient-to-br from-red-50/20 to-red-100/10 dark:from-red-900/10 dark:to-red-800/5 border-red-200/30 dark:border-red-700/20"
              : ""
      }`}
      onClick={onClick}
      intensity="medium"
      hover={true}
    >
      <div className="space-y-4">
        {/* Headers with improved visualization */}
        <MigrationHeaderSection 
          sourceTitle="Salesforce" 
          destinationTitle="HubSpot"
          migrationStatus={migrationStatus}
        />
        
        {/* Status Section */}
        <MigrationStatusSection
          migrationStatus={migrationStatus}
          activeStep={activeStep}
          performanceMetrics={performanceMetrics}
          errorMessage={errorMessage}
        />
        
        {/* Progress Bar with enhanced metrics */}
        <MigrationProgressSection
          migrationStatus={migrationStatus}
          overallProgress={overallProgress}
          performanceMetrics={performanceMetrics}
          errorMessage={errorMessage}
        />
      </div>
      
      <MigrationFooter status={migrationStatus} onViewReport={onViewReport} />
    </GlassPanel>
  );
};

export default MigrationVisualizer;
