
import React from "react";
import { Loader, Zap, Clock, BarChart3, Database, Cpu, Network } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { MigrationStep, PerformanceMetrics } from "@/hooks/migration-demo/types";
import { formatRecordsPerSecond, formatTimeRemaining, getActionVerb } from "../utils/format-utils";
import { formatBytes } from "@/lib/utils";
import MigrationPerformanceChart from "../MigrationPerformanceChart";

type LoadingStatusProps = {
  activeStep?: MigrationStep;
  performanceMetrics?: PerformanceMetrics;
};

const LoadingStatus = ({ activeStep, performanceMetrics }: LoadingStatusProps) => {
  // Calculate realistic estimates for real-world scenarios
  // Use default rate of 25 records/second if no performance metrics available yet
  const defaultRatePerSecond = 25;
  const effectiveRate = performanceMetrics?.averageRecordsPerSecond && performanceMetrics.averageRecordsPerSecond > 0 
    ? performanceMetrics.averageRecordsPerSecond 
    : defaultRatePerSecond;
  
  // Always provide real-world estimates for the demo
  const realWorldEstimates = {
    smallMigration: {
      records: 10000,
      time: Math.max(1, Math.round(10000 / effectiveRate / 60)), // minutes, minimum 1 minute
    },
    mediumMigration: {
      records: 100000,
      time: Math.max(1, Math.round(100000 / effectiveRate / 60)), // minutes, minimum 1 minute
    },
    largeMigration: {
      records: 1000000,
      time: Math.max(1, Math.round(1000000 / effectiveRate / 3600)), // hours, minimum 1 hour
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-4 space-y-4">
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
            {activeStep.status === 'in-progress' ? getActionVerb(activeStep.name) : ''}
            <span className="inline-flex">
              <span className="animate-bounce delay-100" style={{ animationDuration: '1.5s' }}>.</span>
              <span className="animate-bounce delay-200" style={{ animationDuration: '1.5s' }}>.</span>
              <span className="animate-bounce delay-300" style={{ animationDuration: '1.5s' }}>.</span>
            </span>
          </span>
        </div>
      )}
      
      {/* Performance metrics chart */}
      {performanceMetrics?.progressHistory && performanceMetrics.progressHistory.length > 0 && (
        <div className="w-full px-2 mt-2">
          <MigrationPerformanceChart progressHistory={performanceMetrics.progressHistory} height={150} />
        </div>
      )}
      
      {/* Enhanced Performance metrics display */}
      <div className="mt-2 text-xs text-muted-foreground space-y-2 text-center px-4 w-full max-w-[280px]">
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-muted/30 p-2 rounded flex flex-col items-center">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <Zap className="h-3 w-3 text-amber-500" />
              <span className="text-[10px] uppercase font-semibold text-muted-foreground">Speed</span>
            </div>
            <span className="font-mono text-xs">
              {performanceMetrics?.averageRecordsPerSecond && performanceMetrics.averageRecordsPerSecond > 0
                ? formatRecordsPerSecond(performanceMetrics.averageRecordsPerSecond)
                : formatRecordsPerSecond(defaultRatePerSecond)}
            </span>
          </div>
          
          <div className="bg-muted/30 p-2 rounded flex flex-col items-center">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <Clock className="h-3 w-3 text-blue-500" />
              <span className="text-[10px] uppercase font-semibold text-muted-foreground">Remaining</span>
            </div>
            <span className="font-mono text-xs">
              {performanceMetrics?.estimatedTimeRemaining 
                ? formatTimeRemaining(performanceMetrics.estimatedTimeRemaining)
                : "5-7 minutes"}
            </span>
          </div>
          
          {performanceMetrics?.memoryUsage && (
            <div className="bg-muted/30 p-2 rounded flex flex-col items-center">
              <div className="flex items-center justify-center space-x-1 mb-1">
                <Cpu className="h-3 w-3 text-purple-500" />
                <span className="text-[10px] uppercase font-semibold text-muted-foreground">Memory</span>
              </div>
              <span className="font-mono text-xs">{performanceMetrics.memoryUsage.toFixed(1)} MB</span>
            </div>
          )}
          
          {performanceMetrics?.networkSpeed && (
            <div className="bg-muted/30 p-2 rounded flex flex-col items-center">
              <div className="flex items-center justify-center space-x-1 mb-1">
                <Network className="h-3 w-3 text-green-500" />
                <span className="text-[10px] uppercase font-semibold text-muted-foreground">Network</span>
              </div>
              <span className="font-mono text-xs">{performanceMetrics.networkSpeed.toFixed(1)} KB/s</span>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          {(performanceMetrics?.totalRecordsProcessed || performanceMetrics?.totalRecordsProcessed === 0) && (
            <div className="bg-muted/30 p-2 rounded flex flex-col items-center">
              <div className="flex items-center justify-center space-x-1 mb-1">
                <BarChart3 className="h-3 w-3 text-green-500" />
                <span className="text-[10px] uppercase font-semibold text-muted-foreground">Records</span>
              </div>
              <span className="font-mono text-xs">{performanceMetrics.totalRecordsProcessed.toLocaleString()}</span>
            </div>
          )}
          
          {performanceMetrics?.dataVolume && (
            <div className="bg-muted/30 p-2 rounded flex flex-col items-center">
              <div className="flex items-center justify-center space-x-1 mb-1">
                <Database className="h-3 w-3 text-blue-500" />
                <span className="text-[10px] uppercase font-semibold text-muted-foreground">Volume</span>
              </div>
              <span className="font-mono text-xs">{formatBytes(performanceMetrics.dataVolume)}</span>
            </div>
          )}
        </div>
        
        {/* Real-world migration estimates section - Always visible */}
        <div className="mt-4 bg-brand-50/30 dark:bg-brand-950/20 border border-brand-200/30 dark:border-brand-800/30 p-3 rounded-md text-left">
          <h4 className="text-[11px] font-semibold mb-2 text-center uppercase text-brand-600 dark:text-brand-400">
            Real-World Estimates
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between text-[10px]">
              <span>Small migration (10K records):</span>
              <span className="font-mono font-medium">
                {realWorldEstimates.smallMigration.time} min
              </span>
            </div>
            <div className="flex justify-between text-[10px]">
              <span>Medium migration (100K records):</span>
              <span className="font-mono font-medium">
                {realWorldEstimates.mediumMigration.time} min
              </span>
            </div>
            <div className="flex justify-between text-[10px]">
              <span>Large migration (1M records):</span>
              <span className="font-mono font-medium">
                {realWorldEstimates.largeMigration.time} hrs
              </span>
            </div>
          </div>
        </div>
        
        {performanceMetrics?.peakRecordsPerSecond && performanceMetrics.peakRecordsPerSecond > 0 && (
          <Alert className="bg-brand-50/20 dark:bg-brand-950/20 border-brand-200/30 dark:border-brand-800/20 py-2">
            <AlertDescription className="text-xs flex items-center gap-1">
              <Zap className="h-3 w-3 text-amber-500" />
              Peak speed: <span className="font-mono">{formatRecordsPerSecond(performanceMetrics.peakRecordsPerSecond)}</span>
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};

export default LoadingStatus;
