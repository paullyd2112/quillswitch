
import React from "react";
import MigrationProgressBar from "../MigrationProgressBar";

type MigrationProgressSectionProps = {
  migrationStatus: "idle" | "loading" | "success" | "error";
  overallProgress: number;
  performanceMetrics?: {
    averageRecordsPerSecond?: number;
    peakRecordsPerSecond?: number;
  };
  errorMessage?: string;
}

const MigrationProgressSection = ({ 
  migrationStatus, 
  overallProgress,
  performanceMetrics,
  errorMessage
}: MigrationProgressSectionProps) => {
  // Only show progress information when actively migrating, completed, or error
  return (
    <>
      {migrationStatus !== "idle" && (
        <div className="space-y-2">
          {migrationStatus === "error" ? (
            <div className="text-sm text-red-500 font-medium px-2 py-1 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded">
              {errorMessage || "An error occurred during migration. Please try again."}
            </div>
          ) : (
            <MigrationProgressBar progress={overallProgress} />
          )}
          
          {/* Show performance metrics when available and not in error state */}
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
