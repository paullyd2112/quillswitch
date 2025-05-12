
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { MigrationStep, PerformanceMetrics } from "@/hooks/migration-demo/types";
import { formatTimeSpan } from "../utils/format-utils";

type LoadingStatusProps = {
  activeStep?: MigrationStep;
  performanceMetrics?: Partial<PerformanceMetrics>;
};

const LoadingStatus = ({ activeStep, performanceMetrics }: LoadingStatusProps) => {
  // Format estimated time remaining if available
  const formattedTimeRemaining = performanceMetrics?.estimatedTimeRemaining 
    ? formatTimeSpan(performanceMetrics.estimatedTimeRemaining)
    : null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-brand-100/30 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400 border-none">
            <Loader2 className="mr-1 h-3 w-3 animate-spin" />
            Migrating
          </Badge>
          {activeStep && (
            <span className="text-sm text-muted-foreground">
              Currently processing: <span className="font-medium text-foreground">{activeStep.name}</span>
            </span>
          )}
        </div>

        {/* Show processing speed if available */}
        {performanceMetrics?.averageRecordsPerSecond && (
          <span className="text-xs text-muted-foreground">
            {performanceMetrics.averageRecordsPerSecond.toLocaleString()} records/sec
          </span>
        )}
      </div>

      {/* Show active step progress if available */}
      {activeStep && (
        <div className="space-y-1">
          <div className="flex justify-between items-center text-xs">
            <span>{activeStep.description}</span>
            <span>{activeStep.progress.toFixed(0)}%</span>
          </div>
          <Progress value={activeStep.progress} className="h-2" />
        </div>
      )}

      {/* Show time estimate if available */}
      {formattedTimeRemaining && (
        <div className="text-sm text-muted-foreground">
          Estimated time remaining: <span className="font-medium">{formattedTimeRemaining.formatted}</span>
        </div>
      )}

      {/* Show records processed if available */}
      {performanceMetrics?.totalRecordsProcessed !== undefined && (
        <div className="text-sm text-muted-foreground">
          Records processed: <span className="font-medium">{performanceMetrics.totalRecordsProcessed.toLocaleString()}</span>
          {performanceMetrics.dataVolume && (
            <span> ({(performanceMetrics.dataVolume / 1024 / 1024).toFixed(2)} MB)</span>
          )}
        </div>
      )}
    </div>
  );
};

export default LoadingStatus;
