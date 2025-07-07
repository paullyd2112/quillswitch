import React, { useEffect, useState } from 'react';
import { useRealtime } from '@/contexts/RealtimeContext';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, CheckCircle, XCircle, Clock, Users } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface MigrationProgressData {
  projectId: string;
  totalRecords: number;
  processedRecords: number;
  failedRecords: number;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'paused';
  currentStage: string;
  estimatedTimeRemaining?: number;
  throughputPerSecond?: number;
  lastUpdate: Date;
  activeUsers: string[];
}

interface RealtimeMigrationProgressProps {
  projectId: string;
  onProgressUpdate?: (progress: MigrationProgressData) => void;
}

export const RealtimeMigrationProgress: React.FC<RealtimeMigrationProgressProps> = ({
  projectId,
  onProgressUpdate
}) => {
  const { migrationUpdates, subscribeMigrationUpdates, broadcastMigrationUpdate } = useRealtime();
  const [progress, setProgress] = useState<MigrationProgressData | null>(null);
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    subscribeMigrationUpdates(projectId);
  }, [projectId, subscribeMigrationUpdates]);

  useEffect(() => {
    const update = migrationUpdates[projectId];
    if (update) {
      const progressData: MigrationProgressData = {
        projectId,
        totalRecords: update.totalRecords || 0,
        processedRecords: update.processedRecords || 0,
        failedRecords: update.failedRecords || 0,
        status: update.status || 'pending',
        currentStage: update.currentStage || 'Initializing',
        estimatedTimeRemaining: update.estimatedTimeRemaining,
        throughputPerSecond: update.throughputPerSecond,
        lastUpdate: new Date(update.timestamp || Date.now()),
        activeUsers: update.activeUsers || []
      };
      
      setProgress(progressData);
      onProgressUpdate?.(progressData);
    }
  }, [migrationUpdates, projectId, onProgressUpdate]);

  const getStatusIcon = (status: MigrationProgressData['status']) => {
    switch (status) {
      case 'running': return <Activity className="h-4 w-4 text-info animate-pulse" />;
      case 'completed': return <CheckCircle className="h-4 w-4 text-success" />;
      case 'failed': return <XCircle className="h-4 w-4 text-error" />;
      case 'paused': return <Clock className="h-4 w-4 text-warning" />;
      default: return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: MigrationProgressData['status']) => {
    switch (status) {
      case 'running': return 'info';
      case 'completed': return 'success';
      case 'failed': return 'error';
      case 'paused': return 'warning';
      default: return 'secondary';
    }
  };

  const calculateProgress = () => {
    if (!progress || progress.totalRecords === 0) return 0;
    return Math.round((progress.processedRecords / progress.totalRecords) * 100);
  };

  const formatTimeRemaining = (seconds?: number) => {
    if (!seconds) return 'Calculating...';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s remaining`;
  };

  if (!progress) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <Activity className="h-8 w-8 mx-auto text-muted-foreground animate-pulse" />
              <p className="text-sm text-muted-foreground mt-2">
                Connecting to live migration data...
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon(progress.status)}
            Migration Progress
            {isLive && (
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 bg-success rounded-full animate-pulse" />
                <span className="text-xs text-success">LIVE</span>
              </div>
            )}
          </div>
          <Badge variant={getStatusColor(progress.status) as any}>
            {progress.status.toUpperCase()}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>{progress.currentStage}</span>
            <span>{calculateProgress()}%</span>
          </div>
          <Progress value={calculateProgress()} className="h-2" />
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">
              {progress.processedRecords.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">Processed</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">
              {progress.totalRecords.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">Total</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-error">
              {progress.failedRecords.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">Failed</div>
          </div>
          
          <div className="text-center">
            <div className="text-lg font-bold text-info">
              {progress.throughputPerSecond?.toFixed(1) || '0'}/s
            </div>
            <div className="text-xs text-muted-foreground">Rate</div>
          </div>
        </div>

        {/* Time Estimation */}
        {progress.status === 'running' && progress.estimatedTimeRemaining && (
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <Clock className="h-4 w-4 inline mr-2" />
            <span className="text-sm font-medium">
              {formatTimeRemaining(progress.estimatedTimeRemaining)}
            </span>
          </div>
        )}

        {/* Active Users */}
        {progress.activeUsers.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>
              {progress.activeUsers.length} user{progress.activeUsers.length > 1 ? 's' : ''} monitoring
            </span>
          </div>
        )}

        {/* Last Update */}
        <div className="text-xs text-muted-foreground text-center">
          Last updated {formatDistanceToNow(progress.lastUpdate, { addSuffix: true })}
        </div>
      </CardContent>
    </Card>
  );
};