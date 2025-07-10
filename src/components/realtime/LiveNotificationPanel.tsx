import React, { useState } from 'react';
import { useRealtime, RealtimeNotification } from '@/contexts/RealtimeContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Bell, 
  X, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Users, 
  Activity,
  BellOff
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export const LiveNotificationPanel: React.FC = () => {
  const { notifications, markNotificationRead } = useRealtime();
  const [isMinimized, setIsMinimized] = useState(true);

  const getNotificationIcon = (type: RealtimeNotification['type']) => {
    switch (type) {
      case 'migration_update': return <Activity className="h-4 w-4 text-info" />;
      case 'completion': return <CheckCircle className="h-4 w-4 text-success" />;
      case 'error': return <XCircle className="h-4 w-4 text-error" />;
      case 'mapping_change': return <AlertTriangle className="h-4 w-4 text-warning" />;
      case 'user_joined': return <Users className="h-4 w-4 text-info" />;
      default: return <Bell className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getNotificationColor = (type: RealtimeNotification['type']) => {
    switch (type) {
      case 'completion': return 'default';
      case 'error': return 'destructive';
      case 'mapping_change': return 'secondary';
      case 'migration_update': return 'outline';
      case 'user_joined': return 'secondary';
      default: return 'secondary';
    }
  };

  const clearAllNotifications = () => {
    notifications.forEach(notification => {
      markNotificationRead(notification.id);
    });
  };

  if (isMinimized || notifications.length === 0) {
    return notifications.length > 0 ? (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsMinimized(false)}
          className="rounded-full shadow-lg"
        >
          <Bell className="h-4 w-4" />
          <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 text-xs">
            {notifications.length}
          </Badge>
        </Button>
      </div>
    ) : null;
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 max-h-96 z-50 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Live Notifications
            {notifications.length > 0 && (
              <Badge variant="secondary" className="h-5 px-2 text-xs">
                {notifications.length}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1">
            {notifications.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllNotifications}
                className="h-6 px-2 text-xs"
              >
                Clear All
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(true)}
              className="h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-0">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <BellOff className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              No notifications yet
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              You'll see live updates here
            </p>
          </div>
        ) : (
          <ScrollArea className="h-80">
            <div className="space-y-1 p-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors"
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-sm font-medium truncate">
                        {notification.title}
                      </h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markNotificationRead(notification.id)}
                        className="h-6 w-6 p-0 flex-shrink-0"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                    
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {notification.message}
                    </p>
                    
                    <div className="flex items-center justify-between mt-2">
                      <Badge 
                        variant={getNotificationColor(notification.type) as any}
                        className="text-xs h-5"
                      >
                        {notification.type.replace('_', ' ')}
                      </Badge>
                      
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};