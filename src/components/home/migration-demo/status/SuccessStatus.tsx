
import React from "react";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";
import { PerformanceMetrics } from "@/hooks/migration-demo/types";

type SuccessStatusProps = {
  performanceMetrics?: Partial<PerformanceMetrics>;
};

const SuccessStatus = ({ performanceMetrics }: SuccessStatusProps) => {
  // Calculate the time taken if we have the data
  const formattedTimeTaken = performanceMetrics?.progressHistory && performanceMetrics.progressHistory.length > 1
    ? formatTimeTaken(
        performanceMetrics.progressHistory[0].timestamp,
        performanceMetrics.progressHistory[performanceMetrics.progressHistory.length - 1].timestamp
      )
    : null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="bg-green-100/30 text-green-600 dark:bg-green-900/30 dark:text-green-400 border-none">
          <CheckCircle2 className="mr-1 h-3 w-3" />
          Complete
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm">
        {performanceMetrics?.totalRecordsProcessed !== undefined && (
          <div>
            <div className="text-xs text-muted-foreground">Records Migrated</div>
            <div className="font-medium">{performanceMetrics.totalRecordsProcessed.toLocaleString()}</div>
          </div>
        )}

        {performanceMetrics?.averageRecordsPerSecond !== undefined && (
          <div>
            <div className="text-xs text-muted-foreground">Avg. Speed</div>
            <div className="font-medium">{performanceMetrics.averageRecordsPerSecond.toFixed(1)} records/sec</div>
          </div>
        )}

        {performanceMetrics?.dataVolume !== undefined && (
          <div>
            <div className="text-xs text-muted-foreground">Data Volume</div>
            <div className="font-medium">{(performanceMetrics.dataVolume / 1024 / 1024).toFixed(2)} MB</div>
          </div>
        )}

        {formattedTimeTaken && (
          <div>
            <div className="text-xs text-muted-foreground">Time Taken</div>
            <div className="font-medium">{formattedTimeTaken}</div>
          </div>
        )}
      </div>
    </div>
  );
};

// Format time taken in a human readable format
function formatTimeTaken(startTime: number, endTime: number): string {
  const durationMs = endTime - startTime;
  const seconds = Math.floor(durationMs / 1000);
  
  if (seconds < 60) {
    return `${seconds} sec`;
  }
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  if (minutes < 60) {
    return `${minutes}m ${remainingSeconds}s`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  return `${hours}h ${remainingMinutes}m ${remainingSeconds}s`;
}

export default SuccessStatus;
