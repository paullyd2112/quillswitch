
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Cloud, 
  Play, 
  Pause, 
  Square, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle,
  Clock,
  Zap,
  Calendar,
  Server
} from 'lucide-react';
import { useCloudMigration } from '@/hooks/useCloudMigration';
import { CloudMigrationRequest } from '@/services/cloud/CloudMigrationService';

interface CloudMigrationDashboardProps {
  projectId: string;
  migrationConfig?: CloudMigrationRequest;
  workspaceId: string;
}

const CloudMigrationDashboard: React.FC<CloudMigrationDashboardProps> = ({
  projectId,
  migrationConfig,
  workspaceId
}) => {
  const [isScheduling, setIsScheduling] = useState(false);
  const {
    isStarting,
    progress,
    isLoading,
    error,
    startMigration,
    pauseMigration,
    resumeMigration,
    cancelMigration,
    scheduleRecurring,
    isRunning,
    isPaused,
    isCompleted,
    isFailed
  } = useCloudMigration(projectId);

  const handleStartMigration = async () => {
    if (!migrationConfig) return;
    
    try {
      await startMigration(migrationConfig);
    } catch (error) {
      console.error('Failed to start migration:', error);
    }
  };

  const handleScheduleRecurring = async () => {
    if (!migrationConfig) return;
    
    setIsScheduling(true);
    try {
      await scheduleRecurring({
        name: `Scheduled Migration for Project ${projectId}`,
        description: 'Automated recurring migration',
        cronExpression: '0 2 * * 0', // Every Sunday at 2 AM
        migrationConfig,
        workspaceId
      });
    } catch (error) {
      console.error('Failed to schedule migration:', error);
    } finally {
      setIsScheduling(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'failed': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'paused': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return <RefreshCw className="h-4 w-4 animate-spin" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'failed': return <AlertCircle className="h-4 w-4" />;
      case 'paused': return <Pause className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Cloud Migration Header */}
      <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-blue-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Cloud className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Cloud Migration Center</h2>
              <p className="text-sm text-muted-foreground font-normal">
                Run migrations in the cloud - completely independent of your local machine
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center gap-3 p-3 bg-white/50 dark:bg-slate-800/50 rounded-lg">
              <Server className="h-5 w-5 text-green-600" />
              <div>
                <div className="font-medium">Always Online</div>
                <div className="text-sm text-muted-foreground">Runs 24/7 in the cloud</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white/50 dark:bg-slate-800/50 rounded-lg">
              <Zap className="h-5 w-5 text-blue-600" />
              <div>
                <div className="font-medium">High Performance</div>
                <div className="text-sm text-muted-foreground">Optimized for speed</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white/50 dark:bg-slate-800/50 rounded-lg">
              <Calendar className="h-5 w-5 text-purple-600" />
              <div>
                <div className="font-medium">Schedulable</div>
                <div className="text-sm text-muted-foreground">Set up recurring runs</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Migration Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              Migration Status
              {progress && (
                <Badge className={getStatusColor(progress.stage.toLowerCase())}>
                  {getStatusIcon(progress.stage.toLowerCase())}
                  {progress.stage}
                </Badge>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Control Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={handleStartMigration}
              disabled={isStarting || isRunning}
              className="gap-2"
            >
              <Play className="h-4 w-4" />
              {isStarting ? 'Starting...' : 'Start Cloud Migration'}
            </Button>
            
            <Button
              onClick={pauseMigration}
              disabled={!isRunning}
              variant="outline"
              className="gap-2"
            >
              <Pause className="h-4 w-4" />
              Pause
            </Button>
            
            <Button
              onClick={resumeMigration}
              disabled={!isPaused}
              variant="outline"
              className="gap-2"
            >
              <Play className="h-4 w-4" />
              Resume
            </Button>
            
            <Button
              onClick={cancelMigration}
              disabled={!isRunning && !isPaused}
              variant="destructive"
              className="gap-2"
            >
              <Square className="h-4 w-4" />
              Cancel
            </Button>

            <Button
              onClick={handleScheduleRecurring}
              disabled={isScheduling}
              variant="outline"
              className="gap-2"
            >
              <Calendar className="h-4 w-4" />
              {isScheduling ? 'Scheduling...' : 'Schedule Recurring'}
            </Button>
          </div>

          {/* Progress Information */}
          {progress && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Current Stage: {progress.stage}</span>
                  <span>{progress.percentage.toFixed(1)}%</span>
                </div>
                <Progress value={progress.percentage} className="h-3" />
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                  <div className="text-muted-foreground">Processing</div>
                  <div className="font-medium">{progress.currentObject}</div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                  <div className="text-muted-foreground">Records</div>
                  <div className="font-medium">
                    {progress.processedRecords.toLocaleString()} / {progress.totalRecords.toLocaleString()}
                  </div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                  <div className="text-muted-foreground">Throughput</div>
                  <div className="font-medium">{progress.throughputPerSecond}/sec</div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                  <div className="text-muted-foreground">ETA</div>
                  <div className="font-medium">{Math.ceil(progress.estimatedTimeRemaining / 60)}min</div>
                </div>
              </div>

              {progress.errors && progress.errors.length > 0 && (
                <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <span className="font-medium text-red-800 dark:text-red-300">
                      Migration Errors ({progress.errors.length})
                    </span>
                  </div>
                  <div className="text-sm text-red-600 dark:text-red-400 space-y-1">
                    {progress.errors.slice(0, 3).map((error, index) => (
                      <div key={index}>• {error.message || error}</div>
                    ))}
                    {progress.errors.length > 3 && (
                      <div>... and {progress.errors.length - 3} more errors</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Status Messages */}
          {!progress && !isLoading && (
            <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-center gap-2">
                <Cloud className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
                  Ready for Cloud Migration
                </span>
              </div>
              <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                Start your migration to run it completely in the cloud. It will continue even if you close your browser.
              </p>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <span className="text-sm font-medium text-red-800 dark:text-red-300">
                  Error
                </span>
              </div>
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">{error}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cloud Benefits */}
      <Card>
        <CardHeader>
          <CardTitle>Why Use Cloud Migration?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <div className="font-medium">Independent Operation</div>
                  <div className="text-sm text-muted-foreground">
                    Runs completely in the cloud - no need to keep your computer on
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <div className="font-medium">Reliable & Resilient</div>
                  <div className="text-sm text-muted-foreground">
                    Automatic retries, error handling, and progress persistence
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <div className="font-medium">Scheduled Migrations</div>
                  <div className="text-sm text-muted-foreground">
                    Set up recurring migrations with cron-like schedules
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <div className="font-medium">Real-time Monitoring</div>
                  <div className="text-sm text-muted-foreground">
                    Live progress updates and comprehensive error reporting
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <div className="font-medium">High Performance</div>
                  <div className="text-sm text-muted-foreground">
                    Optimized cloud infrastructure for faster migrations
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <div className="font-medium">Secure & Compliant</div>
                  <div className="text-sm text-muted-foreground">
                    Enterprise-grade security with encrypted credential storage
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CloudMigrationDashboard;
