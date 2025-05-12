
import React from "react";
import type { MigrationStep, PerformanceMetrics } from "@/hooks/migration-demo/types";
import IdleStatus from "./status/IdleStatus";
import LoadingStatus from "./status/LoadingStatus";
import SuccessStatus from "./status/SuccessStatus";
import ErrorStatus from "./status/ErrorStatus";

type MigrationStatusProps = {
  status: "idle" | "loading" | "success" | "error";
  activeStep?: MigrationStep;
  performanceMetrics?: Partial<PerformanceMetrics>;
  errorMessage?: string;
};

const MigrationStatus = ({ status, activeStep, performanceMetrics, errorMessage }: MigrationStatusProps) => {
  if (status === "idle") {
    return <IdleStatus />;
  }

  if (status === "loading") {
    return <LoadingStatus activeStep={activeStep} performanceMetrics={performanceMetrics} />;
  }

  if (status === "success") {
    return <SuccessStatus performanceMetrics={performanceMetrics} />;
  }
  
  if (status === "error") {
    return <ErrorStatus errorMessage={errorMessage} />;
  }

  return null;
};

export default MigrationStatus;
