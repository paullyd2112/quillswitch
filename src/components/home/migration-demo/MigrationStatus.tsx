
import React from "react";
import type { MigrationStep } from "@/hooks/use-migration-demo";
import IdleStatus from "./status/IdleStatus";
import LoadingStatus from "./status/LoadingStatus";
import SuccessStatus from "./status/SuccessStatus";

type MigrationStatusProps = {
  status: "idle" | "loading" | "success";
  activeStep?: MigrationStep;
  performanceMetrics?: {
    averageRecordsPerSecond?: number;
    peakRecordsPerSecond?: number;
    estimatedTimeRemaining?: number;
    totalRecordsProcessed?: number;
    dataVolume?: number;
  };
};

const MigrationStatus = ({ status, activeStep, performanceMetrics }: MigrationStatusProps) => {
  if (status === "idle") {
    return <IdleStatus />;
  }

  if (status === "loading") {
    return <LoadingStatus activeStep={activeStep} performanceMetrics={performanceMetrics} />;
  }

  if (status === "success") {
    return <SuccessStatus performanceMetrics={performanceMetrics} />;
  }

  return null;
};

export default MigrationStatus;
