import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserPresenceIndicator } from './UserPresenceIndicator';
import { RealtimeMigrationProgress } from './RealtimeMigrationProgress';
import { useRealtime } from '@/contexts/RealtimeContext';
import { 
  Users, 
  Activity, 
  Zap, 
  CheckCircle, 
  PlayCircle,
  PauseCircle,
  RotateCcw
} from 'lucide-react';

export const RealtimeDemo: React.FC = () => {
  const { broadcastMigrationUpdate, sendNotification } = useRealtime();
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const demoProjectId = 'demo-project-123';

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && progress < 100) {
      interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = Math.min(prev + Math.random() * 5, 100);
          
          // Simulate migration updates
          broadcastMigrationUpdate(demoProjectId, {
            totalRecords: 1000,
            processedRecords: Math.floor((newProgress / 100) * 1000),
            failedRecords: Math.floor(Math.random() * 5),
            status: newProgress >= 100 ? 'completed' : 'running',
            currentStage: newProgress >= 100 ? 'Migration Complete' : `Processing ${Math.floor(newProgress)}%...`,
            throughputPerSecond: 15 + Math.random() * 10,
            estimatedTimeRemaining: Math.floor(((100 - newProgress) / 100) * 120),
            timestamp: new Date().toISOString(),
            activeUsers: ['demo@user.com', 'colleague@user.com']
          });
          
          // Send milestone notifications
          if (newProgress >= 50 && prev < 50) {
            sendNotification({
              type: 'migration_update',
              title: 'Migration Halfway Complete',
              message: '500 out of 1000 records have been successfully migrated',
              project_id: demoProjectId
            });
          }
          
          if (newProgress >= 100) {
            setIsRunning(false);
            sendNotification({
              type: 'completion',
              title: 'Demo Migration Complete!',
              message: 'All 1000 records migrated successfully in real-time',
              project_id: demoProjectId
            });
          }
          
          return newProgress;
        });
      }, 500);
    }
    
    return () => clearInterval(interval);
  }, [isRunning, progress, broadcastMigrationUpdate, sendNotification]);

  const startDemo = () => {
    setIsRunning(true);
    sendNotification({
      type: 'migration_update',
      title: 'Demo Migration Started',
      message: 'Watch real-time collaboration in action!',
      project_id: demoProjectId
    });
  };

  const pauseDemo = () => {
    setIsRunning(false);
    sendNotification({
      type: 'migration_update',
      title: 'Demo Migration Paused',
      message: 'Migration paused - you can resume anytime',
      project_id: demoProjectId
    });
  };

  const resetDemo = () => {
    setIsRunning(false);
    setProgress(0);
    sendNotification({
      type: 'migration_update',
      title: 'Demo Reset',
      message: 'Ready to start a new migration demo',
      project_id: demoProjectId
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Real-Time Collaboration Demo
          </CardTitle>
          <p className="text-muted-foreground">
            Experience live user presence, migration progress, and instant notifications
          </p>
        </CardHeader>
        
        <CardContent>
          {/* User Presence */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Live User Presence
            </h3>
            <UserPresenceIndicator 
              projectId={demoProjectId}
              showCount={true}
              maxVisible={3}
            />
          </div>

          {/* Demo Controls */}
          <div className="flex items-center gap-2 mb-6">
            <Button 
              onClick={startDemo} 
              disabled={isRunning || progress >= 100}
              size="sm"
            >
              <PlayCircle className="h-4 w-4 mr-2" />
              Start Demo Migration
            </Button>
            
            <Button 
              onClick={pauseDemo}
              disabled={!isRunning}
              variant="outline"
              size="sm"
            >
              <PauseCircle className="h-4 w-4 mr-2" />
              Pause
            </Button>
            
            <Button 
              onClick={resetDemo}
              variant="outline" 
              size="sm"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h4 className="font-medium">Live Presence</h4>
              <p className="text-sm text-muted-foreground">
                See who's online and working on the same project
              </p>
            </div>
            
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <Activity className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h4 className="font-medium">Real-Time Progress</h4>
              <p className="text-sm text-muted-foreground">
                Watch migration progress update live across all users
              </p>
            </div>
            
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <CheckCircle className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h4 className="font-medium">Instant Notifications</h4>
              <p className="text-sm text-muted-foreground">
                Get notified of important events and milestones
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Live Migration Progress */}
      {(progress > 0 || isRunning) && (
        <RealtimeMigrationProgress 
          projectId={demoProjectId}
          onProgressUpdate={(data) => {
            console.log('Demo progress update:', data);
          }}
        />
      )}
    </div>
  );
};