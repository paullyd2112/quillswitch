
import React from "react";
import { Database, Check, Loader, Clock, Zap, BarChart3 } from "lucide-react";
import type { MigrationStep } from "@/hooks/use-migration-demo";
import { formatBytes } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";

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

// Helper function to get random action verb based on step name
const getActionVerb = (stepName: string): string => {
  const verbsByType: Record<string, string[]> = {
    "Contacts": ["importing", "loading", "fetching", "retrieving", "processing"],
    "Opportunities & Deals": ["syncing", "analyzing", "processing", "transferring", "mapping"],
    "Activities & Tasks": ["transferring", "moving", "syncing", "processing", "organizing"],
    "Cases & Tickets": ["processing", "handling", "migrating", "transferring", "analyzing"],
    "Accounts & Companies": ["connecting", "linking", "integrating", "mapping", "processing"],
    "Custom Objects": ["configuring", "setting up", "integrating", "customizing", "processing"],
  };
  
  // Get the array of verbs for the given step name or use default
  const verbs = verbsByType[stepName] || ["migrating", "processing", "transferring"];
  
  // Pick a random verb from the array
  const randomIndex = Math.floor(Math.random() * verbs.length);
  return verbs[randomIndex];
};

// Helper function to format time remaining
const formatTimeRemaining = (seconds?: number): string => {
  if (!seconds) return "Calculating...";
  
  if (seconds < 60) {
    return `${seconds} seconds`;
  }
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  return `${hours} hour${hours !== 1 ? 's' : ''} ${remainingMinutes > 0 ? `${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}` : ''}`;
};

// Helper function to format records per second
const formatRecordsPerSecond = (rps?: number): string => {
  if (!rps) return "Calculating...";
  
  if (rps < 1) {
    return `${(rps * 60).toFixed(1)} records/minute`;
  }
  
  return `${rps.toFixed(1)} records/second`;
};

const MigrationStatus = ({ status, activeStep, performanceMetrics }: MigrationStatusProps) => {
  if (status === "idle") {
    return (
      <div className="flex items-center justify-center py-12 opacity-80">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-brand-400/20 animate-pulse"></div>
          <Database className="h-10 w-10 text-brand-500 relative" />
        </div>
      </div>
    );
  }

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center py-6 space-y-4">
        <div className="relative">
          {/* Outer rings */}
          <div className="absolute inset-0 rounded-full bg-brand-400/10 animate-ping" style={{ animationDuration: '2s' }}></div>
          <div className="absolute inset-[-8px] rounded-full border-2 border-brand-300/30 animate-spin" style={{ animationDuration: '4s' }}></div>
          
          {/* Inner spinning loader */}
          <div className="relative bg-gradient-to-br from-brand-100 to-transparent p-4 rounded-full backdrop-blur-sm">
            <Loader className="h-12 w-12 text-brand-500 animate-spin" />
          </div>
        </div>
        <div className="text-brand-500 font-medium tracking-wide">
          <span className="inline-block mr-2 shimmer">Migration in progress</span>
          <span className="inline-flex">
            <span className="animate-bounce delay-100" style={{ animationDuration: '1.5s' }}>.</span>
            <span className="animate-bounce delay-200" style={{ animationDuration: '1.5s' }}>.</span>
            <span className="animate-bounce delay-300" style={{ animationDuration: '1.5s' }}>.</span>
          </span>
        </div>
        
        {activeStep && (
          <div className="text-sm text-brand-400 animate-pulse" style={{ animationDuration: '2.5s' }}>
            <span>{activeStep.name} </span>
            <span className="opacity-80">
              {activeStep.status === 'in_progress' ? getActionVerb(activeStep.name) : ''}
              <span className="inline-flex">
                <span className="animate-bounce delay-100" style={{ animationDuration: '1.5s' }}>.</span>
                <span className="animate-bounce delay-200" style={{ animationDuration: '1.5s' }}>.</span>
                <span className="animate-bounce delay-300" style={{ animationDuration: '1.5s' }}>.</span>
              </span>
            </span>
          </div>
        )}
        
        {/* Enhanced Performance metrics display */}
        {performanceMetrics && (
          <div className="mt-2 text-xs text-muted-foreground space-y-2 text-center px-4 w-full max-w-[280px]">
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-muted/30 p-2 rounded flex flex-col items-center">
                <div className="flex items-center justify-center space-x-1 mb-1">
                  <Zap className="h-3 w-3 text-amber-500" />
                  <span className="text-[10px] uppercase font-semibold text-muted-foreground">Speed</span>
                </div>
                <span className="font-mono text-xs">{formatRecordsPerSecond(performanceMetrics.averageRecordsPerSecond)}</span>
              </div>
              
              <div className="bg-muted/30 p-2 rounded flex flex-col items-center">
                <div className="flex items-center justify-center space-x-1 mb-1">
                  <Clock className="h-3 w-3 text-blue-500" />
                  <span className="text-[10px] uppercase font-semibold text-muted-foreground">Remaining</span>
                </div>
                <span className="font-mono text-xs">{formatTimeRemaining(performanceMetrics.estimatedTimeRemaining)}</span>
              </div>
              
              {performanceMetrics.totalRecordsProcessed && (
                <div className="bg-muted/30 p-2 rounded flex flex-col items-center">
                  <div className="flex items-center justify-center space-x-1 mb-1">
                    <BarChart3 className="h-3 w-3 text-green-500" />
                    <span className="text-[10px] uppercase font-semibold text-muted-foreground">Records</span>
                  </div>
                  <span className="font-mono text-xs">{performanceMetrics.totalRecordsProcessed.toLocaleString()}</span>
                </div>
              )}
              
              {performanceMetrics.dataVolume && (
                <div className="bg-muted/30 p-2 rounded flex flex-col items-center">
                  <div className="flex items-center justify-center space-x-1 mb-1">
                    <Database className="h-3 w-3 text-purple-500" />
                    <span className="text-[10px] uppercase font-semibold text-muted-foreground">Volume</span>
                  </div>
                  <span className="font-mono text-xs">{formatBytes(performanceMetrics.dataVolume)}</span>
                </div>
              )}
            </div>
            
            {performanceMetrics.peakRecordsPerSecond && performanceMetrics.peakRecordsPerSecond > 0 && (
              <Alert className="bg-brand-50/20 dark:bg-brand-950/20 border-brand-200/30 dark:border-brand-800/20 py-2">
                <AlertDescription className="text-xs flex items-center gap-1">
                  <Zap className="h-3 w-3 text-amber-500" />
                  Peak speed: <span className="font-mono">{formatRecordsPerSecond(performanceMetrics.peakRecordsPerSecond)}</span>
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </div>
    );
  }

  if (status === "success") {
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
  }

  return null;
};

export default MigrationStatus;
