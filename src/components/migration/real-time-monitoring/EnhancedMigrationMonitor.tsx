import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Zap, 
  TrendingUp, 
  AlertCircle,
  RefreshCw,
  Activity,
  Database,
  Globe
} from "lucide-react";
import { MigrationProgress, MigrationError } from "../automated-mapping/types";
import ErrorCategoryPanel from "./ErrorCategoryPanel";
import BottleneckAnalysis from "./BottleneckAnalysis";

interface EnhancedMigrationMonitorProps {
  progress: MigrationProgress;
  onRefresh?: () => void;
  onErrorResolve?: (errorId: string) => void;
}

const EnhancedMigrationMonitor: React.FC<EnhancedMigrationMonitorProps> = ({
  progress,
  onRefresh,
  onErrorResolve
}) => {
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    if (!autoRefresh || !onRefresh) return;

    const interval = setInterval(() => {
      onRefresh();
    }, 2000); // Refresh every 2 seconds

    return () => clearInterval(interval);
  }, [autoRefresh, onRefresh]);

  const getProgressPercentage = () => {
    return progress.totalRecords > 0 
      ? (progress.processedRecords / progress.totalRecords) * 100 
      : 0;
  };

  const getSuccessRate = () => {
    return progress.processedRecords > 0
      ? (progress.successfulRecords / progress.processedRecords) * 100
      : 0;
  };

  const formatTimeRemaining = (seconds?: number) => {
    if (!seconds) return "Calculating...";
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m ${secs}s`;
    return `${secs}s`;
  };

  const criticalErrors = progress.errors.filter(e => e.severity === 'critical');
  const highErrors = progress.errors.filter(e => e.severity === 'high');

  return (
    <div className="space-y-6">
      {/* Main Progress Overview */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Migration Progress
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={autoRefresh ? "text-primary" : ""}
            >
              <RefreshCw className={`h-4 w-4 ${autoRefresh ? "animate-spin" : ""}`} />
              Auto-refresh {autoRefresh ? "ON" : "OFF"}
            </Button>
            {onRefresh && (
              <Button variant="outline" size="sm" onClick={onRefresh}>
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <p className="text-2xl font-bold">
                  {progress.processedRecords.toLocaleString()} / {progress.totalRecords.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">Records Processed</p>
              </div>
              <div className="text-right space-y-1">
                <p className="text-lg font-semibold text-primary">
                  {getProgressPercentage().toFixed(1)}%
                </p>
                <p className="text-sm text-muted-foreground">Complete</p>
              </div>
            </div>
            <Progress value={getProgressPercentage()} className="h-3" />
          </div>

          {/* Status Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="border-emerald-200 bg-emerald-50/50">
              <CardContent className="p-4 text-center">
                <CheckCircle className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-emerald-700">
                  {progress.successfulRecords.toLocaleString()}
                </p>
                <p className="text-sm text-emerald-600">Successful</p>
                <Badge variant="outline" className="mt-1 text-xs border-emerald-300">
                  {getSuccessRate().toFixed(1)}% success rate
                </Badge>
              </CardContent>
            </Card>

            <Card className="border-red-200 bg-red-50/50">
              <CardContent className="p-4 text-center">
                <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-red-700">
                  {progress.failedRecords.toLocaleString()}
                </p>
                <p className="text-sm text-red-600">Failed</p>
                <Badge variant="destructive" className="mt-1 text-xs">
                  {progress.errors.length} error types
                </Badge>
              </CardContent>
            </Card>

            <Card className="border-blue-200 bg-blue-50/50">
              <CardContent className="p-4 text-center">
                <Zap className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-700">
                  {progress.recordsPerSecond?.toFixed(1) || "0"}/s
                </p>
                <p className="text-sm text-blue-600">Processing Rate</p>
                {progress.currentBatch && progress.totalBatches && (
                  <Badge variant="outline" className="mt-1 text-xs border-blue-300">
                    Batch {progress.currentBatch}/{progress.totalBatches}
                  </Badge>
                )}
              </CardContent>
            </Card>

            <Card className="border-orange-200 bg-orange-50/50">
              <CardContent className="p-4 text-center">
                <Clock className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <p className="text-lg font-bold text-orange-700">
                  {formatTimeRemaining(progress.estimatedTimeRemaining)}
                </p>
                <p className="text-sm text-orange-600">Est. Remaining</p>
              </CardContent>
            </Card>
          </div>

          {/* Critical Alerts */}
          {(criticalErrors.length > 0 || highErrors.length > 0) && (
            <div className="space-y-2">
              {criticalErrors.map((error) => (
                <div key={error.id} className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium text-red-800">{error.message}</p>
                    <p className="text-sm text-red-600">
                      {error.count} occurrences • {error.suggestedAction}
                    </p>
                  </div>
                  <Badge variant="destructive">Critical</Badge>
                </div>
              ))}
              {highErrors.map((error) => (
                <div key={error.id} className="flex items-center gap-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-orange-600 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium text-orange-800">{error.message}</p>
                    <p className="text-sm text-orange-600">
                      {error.count} occurrences • {error.suggestedAction}
                    </p>
                  </div>
                  <Badge variant="outline" className="border-orange-300">High</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Error Analysis & Bottlenecks */}
      <div className="grid md:grid-cols-2 gap-6">
        <ErrorCategoryPanel 
          errors={progress.errors} 
          onErrorResolve={onErrorResolve}
        />
        {progress.bottlenecks && progress.bottlenecks.length > 0 && (
          <BottleneckAnalysis bottlenecks={progress.bottlenecks} />
        )}
      </div>
    </div>
  );
};

export default EnhancedMigrationMonitor;