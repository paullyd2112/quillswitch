import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  Pause, 
  Square, 
  RefreshCw, 
  AlertCircle,
  CheckCircle,
  Clock,
  Zap,
  Settings
} from 'lucide-react';
import { toast } from 'sonner';
import { createMigrationEngine, MigrationProgress } from '@/services/migration/executionService';
import { useRealtimeMigration } from '@/hooks/useRealtimeMigration';

interface MigrationExecutionControlsProps {
  projectId: string;
  projectStatus: string;
  onStatusChange?: (status: string) => void;
}

const MigrationExecutionControls: React.FC<MigrationExecutionControlsProps> = ({
  projectId,
  projectStatus,
  onStatusChange
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentProgress, setCurrentProgress] = useState<MigrationProgress | null>(null);
  const { migrationData, startMigration, completeMigration, failMigration } = useRealtimeMigration(projectId);

  const handleStartMigration = async () => {
    setIsProcessing(true);
    try {
      const engine = createMigrationEngine({
        projectId,
        batchSize: 100,
        concurrency: 3,
        validateFirst: true,
        dryRun: false
      });

      // Set up progress callback
      engine.onProgress((progress) => {
        setCurrentProgress(progress);
      });

      startMigration();
      const success = await engine.startMigration();
      
      if (success) {
        onStatusChange?.('completed');
        completeMigration();
      } else {
        onStatusChange?.('failed');
        failMigration('Migration execution failed');
      }
    } catch (error) {
      console.error('Failed to start migration:', error);
      failMigration(error instanceof Error ? error.message : 'Unknown error');
      toast.error('Failed to start migration');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePauseMigration = async () => {
    setIsProcessing(true);
    try {
      const engine = createMigrationEngine({ projectId });
      await engine.pauseMigration();
      onStatusChange?.('paused');
    } catch (error) {
      console.error('Failed to pause migration:', error);
      toast.error('Failed to pause migration');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleResumeMigration = async () => {
    setIsProcessing(true);
    try {
      const engine = createMigrationEngine({ projectId });
      await engine.resumeMigration();
      onStatusChange?.('running');
    } catch (error) {
      console.error('Failed to resume migration:', error);
      toast.error('Failed to resume migration');
    } finally {
      setIsProcessing(false);
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

  const canStart = ['pending', 'failed'].includes(projectStatus);
  const canPause = projectStatus === 'running';
  const canResume = projectStatus === 'paused';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Migration Control Center
          </div>
          <Badge className={getStatusColor(projectStatus)}>
            {getStatusIcon(projectStatus)}
            {projectStatus.charAt(0).toUpperCase() + projectStatus.slice(1)}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Control Buttons */}
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={handleStartMigration}
            disabled={!canStart || isProcessing}
            className="gap-2"
          >
            <Play className="h-4 w-4" />
            {projectStatus === 'failed' ? 'Retry Migration' : 'Start Migration'}
          </Button>
          
          <Button
            onClick={handlePauseMigration}
            disabled={!canPause || isProcessing}
            variant="outline"
            className="gap-2"
          >
            <Pause className="h-4 w-4" />
            Pause
          </Button>
          
          <Button
            onClick={handleResumeMigration}
            disabled={!canResume || isProcessing}
            variant="outline"
            className="gap-2"
          >
            <Play className="h-4 w-4" />
            Resume
          </Button>
          
          <Button
            variant="outline"
            className="gap-2"
            disabled={projectStatus === 'running'}
          >
            <Settings className="h-4 w-4" />
            Settings
          </Button>
        </div>

        {/* Progress Information */}
        {currentProgress && (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Current Stage: {currentProgress.stage}</span>
                <span>{currentProgress.percentage.toFixed(1)}%</span>
              </div>
              <Progress value={currentProgress.percentage} />
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground">Total Records</div>
                <div className="font-medium">{currentProgress.totalRecords.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Processed</div>
                <div className="font-medium">{currentProgress.processedRecords.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Throughput</div>
                <div className="font-medium">{currentProgress.throughputPerSecond}/sec</div>
              </div>
              <div>
                <div className="text-muted-foreground">ETA</div>
                <div className="font-medium">{Math.ceil(currentProgress.estimatedTimeRemaining / 60)}min</div>
              </div>
            </div>
          </div>
        )}

        {/* Status Messages */}
        {projectStatus === 'pending' && (
          <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
                Ready to Start
              </span>
            </div>
            <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
              Your migration is configured and ready to begin. Click "Start Migration" to proceed.
            </p>
          </div>
        )}

        {projectStatus === 'running' && (
          <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />
              <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
                Migration in Progress
              </span>
            </div>
            <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
              Your migration is currently running. You can monitor progress above.
            </p>
          </div>
        )}

        {projectStatus === 'completed' && (
          <div className="p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-800 dark:text-green-300">
                Migration Completed
              </span>
            </div>
            <p className="text-sm text-green-600 dark:text-green-400 mt-1">
              Your migration has been completed successfully!
            </p>
          </div>
        )}

        {projectStatus === 'failed' && (
          <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <span className="text-sm font-medium text-red-800 dark:text-red-300">
                Migration Failed
              </span>
            </div>
            <p className="text-sm text-red-600 dark:text-red-400 mt-1">
              The migration encountered an error. Check the error logs and retry when ready.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MigrationExecutionControls;