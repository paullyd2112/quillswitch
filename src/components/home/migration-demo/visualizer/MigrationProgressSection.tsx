
import React from "react";
import MigrationProgressBar from "../MigrationProgressBar";

type MigrationProgressSectionProps = {
  migrationStatus: "idle" | "loading" | "success";
  overallProgress: number;
  performanceMetrics?: {
    averageRecordsPerSecond?: number;
    peakRecordsPerSecond?: number;
  };
}

const MigrationProgressSection = ({ 
  migrationStatus, 
  overallProgress,
  performanceMetrics
}: MigrationProgressSectionProps) => {
  // Only show progress information when actively migrating or completed
  return (
    <>
      {migrationStatus !== "idle" && (
        <div className="space-y-2">
          <MigrationProgressBar progress={overallProgress} />
          
          {/* Show performance metrics when available */}
          {performanceMetrics && (migrationStatus === "loading" || migrationStatus === "success") && (
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-400">
              <div>
                <span className="font-medium">Average Speed:</span>{" "}
                {performanceMetrics.averageRecordsPerSecond 
                  ? `${Math.round(performanceMetrics.averageRecordsPerSecond)} records/s` 
                  : "Calculating..."}
              </div>
              <div>
                <span className="font-medium">Peak Speed:</span>{" "}
                {performanceMetrics.peakRecordsPerSecond 
                  ? `${Math.round(performanceMetrics.peakRecordsPerSecond)} records/s` 
                  : "Calculating..."}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default MigrationProgressSection;
