
import React from "react";
import { Check } from "lucide-react";
import { formatBytes, formatRecordsPerSecond } from "../utils/format-utils";

type SuccessStatusProps = {
  performanceMetrics?: {
    averageRecordsPerSecond?: number;
    peakRecordsPerSecond?: number;
    estimatedTimeRemaining?: number;
    totalRecordsProcessed?: number;
    dataVolume?: number;
  };
};

const SuccessStatus = ({ performanceMetrics }: SuccessStatusProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-8 space-y-4">
      <div className="relative">
        {/* Success glow effect */}
        <div className="absolute inset-0 rounded-full bg-green-500/20 animate-ping" style={{ animationDuration: '1.5s' }}></div>
        <div className="absolute inset-[-4px] rounded-full bg-gradient-to-r from-green-400/30 to-emerald-500/30 animate-pulse"></div>
        
        {/* Success icon with glassy effect */}
        <div className="relative bg-gradient-to-br from-green-100 to-green-200/30 dark:from-green-900/40 dark:to-green-800/20 p-4 rounded-full backdrop-blur-md border border-green-200/50 dark:border-green-700/30">
          <Check className="h-10 w-10 text-green-600 dark:text-green-400" />
        </div>
      </div>
      <div className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-400 font-medium tracking-wide">
        All data migrated successfully!
      </div>
      <div className="text-xs text-center text-muted-foreground space-y-1">
        <div className="text-green-500 dark:text-green-400">✓ Contacts</div>
        <div className="text-green-500 dark:text-green-400">✓ Opportunities & Deals</div>
        <div className="text-green-500 dark:text-green-400">✓ Activities & Tasks</div>
        <div className="text-green-500 dark:text-green-400">✓ Cases & Tickets</div>
        <div className="text-green-500 dark:text-green-400">✓ Accounts & Companies</div>
        <div className="text-green-500 dark:text-green-400">✓ Custom Objects</div>
      </div>
      
      {/* Show summary metrics for completed migration */}
      {performanceMetrics && (
        <div className="w-full max-w-[250px] bg-green-50/30 dark:bg-green-900/20 rounded-lg p-3 border border-green-100/30 dark:border-green-800/30">
          <div className="text-center text-green-800 dark:text-green-300 text-xs mb-2 font-medium">Migration Summary</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {performanceMetrics.totalRecordsProcessed && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Records:</span>
                <span className="font-medium">{performanceMetrics.totalRecordsProcessed.toLocaleString()}</span>
              </div>
            )}
            {performanceMetrics.averageRecordsPerSecond && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Avg Speed:</span>
                <span className="font-medium">{formatRecordsPerSecond(performanceMetrics.averageRecordsPerSecond)}</span>
              </div>
            )}
            {performanceMetrics.dataVolume && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Data Volume:</span>
                <span className="font-medium">{formatBytes(performanceMetrics.dataVolume)}</span>
              </div>
            )}
            {performanceMetrics.peakRecordsPerSecond && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Peak Speed:</span>
                <span className="font-medium">{formatRecordsPerSecond(performanceMetrics.peakRecordsPerSecond)}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SuccessStatus;
