
import React from "react";
import MigrationStatus from "../MigrationStatus";
import type { MigrationStep } from "@/hooks/use-migration-demo";

type MigrationStatusSectionProps = {
  migrationStatus: "idle" | "loading" | "success";
  activeStep?: MigrationStep;
  performanceMetrics?: {
    averageRecordsPerSecond?: number;
    peakRecordsPerSecond?: number;
    estimatedTimeRemaining?: number;
    totalRecordsProcessed?: number;
    dataVolume?: number;
  };
}

const MigrationStatusSection = ({ 
  migrationStatus, 
  activeStep, 
  performanceMetrics 
}: MigrationStatusSectionProps) => {
  return (
    <>
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
    </>
  );
};

export default MigrationStatusSection;
