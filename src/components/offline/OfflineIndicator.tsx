import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Wifi, WifiOff, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import { offlineService } from '@/services/offline/offlineService';
import { toast } from 'sonner';

const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);
  const [queuedActionsCount, setQueuedActionsCount] = useState(0);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  // Update online status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success('Connection restored');
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.error('Connection lost - working offline');
    };

    const handleSyncComplete = (event: CustomEvent) => {
      setLastSyncTime(new Date());
      setQueuedActionsCount(0);
      toast.success(`Synced ${event.detail.syncedCount} offline actions`);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('offlineSyncComplete', handleSyncComplete as EventListener);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('offlineSyncComplete', handleSyncComplete as EventListener);
    };
  }, []);

  // Initialize offline service and load queued actions
  useEffect(() => {
    const initializeOfflineService = async () => {
      try {
        await offlineService.initialize();
        offlineService.setupOnlineListeners();
        
        const actions = await offlineService.getQueuedActions();
        setQueuedActionsCount(actions.length);
      } catch (error) {
        console.error('Failed to initialize offline service:', error);
      }
    };

    initializeOfflineService();
  }, []);

  // Check sync status periodically
  useEffect(() => {
    const checkSyncStatus = () => {
      setIsSyncing(offlineService.isSyncing());
    };

    const interval = setInterval(checkSyncStatus, 1000);
    return () => clearInterval(interval);
  }, []);

  // Manual sync trigger
  const handleManualSync = async () => {
    if (!isOnline) {
      toast.error('Cannot sync while offline');
      return;
    }

    try {
      await offlineService.syncWhenOnline();
      const actions = await offlineService.getQueuedActions();
      setQueuedActionsCount(actions.length);
    } catch (error) {
      console.error('Manual sync failed:', error);
      toast.error('Sync failed');
    }
  };

  const getStatusColor = () => {
    if (!isOnline) return 'destructive';
    if (isSyncing) return 'default';
    if (queuedActionsCount > 0) return 'secondary';
    return 'default';
  };

  const getStatusText = () => {
    if (!isOnline) return 'Offline';
    if (isSyncing) return 'Syncing...';
    if (queuedActionsCount > 0) return `${queuedActionsCount} pending`;
    return 'Online';
  };

  const getStatusIcon = () => {
    if (!isOnline) return <WifiOff className="h-3 w-3" />;
    if (isSyncing) return <RefreshCw className="h-3 w-3 animate-spin" />;
    if (queuedActionsCount > 0) return <XCircle className="h-3 w-3" />;
    return <Wifi className="h-3 w-3" />;
  };

  return (
    <div className="flex items-center space-x-2">
      <Badge variant={getStatusColor()} className="flex items-center space-x-1">
        {getStatusIcon()}
        <span>{getStatusText()}</span>
      </Badge>

      {(queuedActionsCount > 0 || !isOnline) && (
        <Card className="w-80">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center space-x-2">
              {!isOnline ? <WifiOff className="h-4 w-4" /> : <RefreshCw className="h-4 w-4" />}
              <span>{!isOnline ? 'Offline Mode' : 'Sync Status'}</span>
            </CardTitle>
            <CardDescription className="text-xs">
              {!isOnline 
                ? 'Changes are saved locally and will sync when connection is restored'
                : `${queuedActionsCount} actions waiting to sync`
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-0">
            {isSyncing && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Syncing changes...</span>
                  <span>{queuedActionsCount} remaining</span>
                </div>
                <Progress value={queuedActionsCount === 0 ? 100 : 50} className="h-1" />
              </div>
            )}
            
            {isOnline && !isSyncing && queuedActionsCount > 0 && (
              <Button 
                size="sm" 
                onClick={handleManualSync}
                className="w-full"
              >
                <RefreshCw className="h-3 w-3 mr-2" />
                Sync Now
              </Button>
            )}
            
            {lastSyncTime && (
              <p className="text-xs text-muted-foreground mt-2">
                Last sync: {lastSyncTime.toLocaleTimeString()}
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OfflineIndicator;