
import React from "react";
import MigrationStatus from "../MigrationStatus";
import type { MigrationStep, PerformanceMetrics } from "@/hooks/migration-demo/types";

type MigrationStatusSectionProps = {
  migrationStatus: "idle" | "loading" | "success" | "error";
  activeStep?: MigrationStep;
  performanceMetrics?: Partial<PerformanceMetrics>;
  errorMessage?: string;
}

const MigrationStatusSection = ({ 
  migrationStatus, 
  activeStep, 
  performanceMetrics,
  errorMessage
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
      {migrationStatus === "error" && (
        <MigrationStatus 
          status="error" 
          errorMessage={errorMessage}
        />
      )}
    </>
  );
};

export default MigrationStatusSection;
