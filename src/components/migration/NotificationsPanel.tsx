
import React, { useState, useEffect } from "react";
import { 
  getProjectNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead,
  deleteNotification,
  MigrationNotification 
} from "@/services/migration/notificationService";
import {
  Bell,
  Check,
  ChevronDown,
  ExternalLink,
  Info,
  MessageSquare,
  RefreshCw,
  Trash2,
  X,
  AlertTriangle,
  CheckCircle,
  PlayCircle,
  PauseCircle,
  ClipboardCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface NotificationsPanelProps {
  projectId: string;
}

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ projectId }) => {
  const [notifications, setNotifications] = useState<MigrationNotification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const fetchNotifications = async () => {
    setIsLoading(true);
    const data = await getProjectNotifications(projectId, 50, true);
    setNotifications(data);
    setIsLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen, projectId]);

  const handleMarkAsRead = async (notificationId: string) => {
    const success = await markNotificationAsRead(notificationId);
    if (success) {
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => 
          notification.id === notificationId 
            ? { ...notification, is_read: true } 
            : notification
        )
      );
    }
  };

  const handleMarkAllAsRead = async () => {
    const success = await markAllNotificationsAsRead(projectId);
    if (success) {
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => ({ ...notification, is_read: true }))
      );
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    const success = await deleteNotification(notificationId);
    if (success) {
      setNotifications(prevNotifications => 
        prevNotifications.filter(notification => notification.id !== notificationId)
      );
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'migration_started':
        return <PlayCircle className="h-4 w-4 text-blue-500" />;
      case 'migration_completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'migration_paused':
        return <PauseCircle className="h-4 w-4 text-amber-500" />;
      case 'migration_resumed':
        return <PlayCircle className="h-4 w-4 text-blue-500" />;
      case 'validation_completed':
        return <ClipboardCheck className="h-4 w-4 text-purple-500" />;
      case 'error_occurred':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'stage_completed':
        return <Check className="h-4 w-4 text-green-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="icon"
          className="relative"
        >
          <Bell className="h-[1.2rem] w-[1.2rem]" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[380px] p-0" 
        align="end"
        sideOffset={5}
      >
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <h4 className="font-medium">Notifications</h4>
            {unreadCount > 0 && (
              <Badge 
                variant="outline" 
                className="ml-1 bg-blue-50 text-blue-700 hover:bg-blue-50 dark:bg-blue-950/30 dark:text-blue-400"
              >
                {unreadCount} new
              </Badge>
            )}
          </div>
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={fetchNotifications}
              disabled={isLoading}
            >
              <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
              <span className="sr-only">Refresh</span>
            </Button>
            {unreadCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 text-xs"
                onClick={handleMarkAllAsRead}
              >
                <Check className="mr-1 h-3 w-3" />
                Mark all read
              </Button>
            )}
          </div>
        </div>
        
        <Separator />
        
        <ScrollArea className="h-[320px] py-1">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
              <MessageSquare className="mb-2 h-10 w-10 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground">No notifications yet</p>
              <p className="text-xs text-muted-foreground/70 mt-1">
                You'll be notified about migration events here
              </p>
            </div>
          ) : (
            <div>
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={cn(
                    "flex gap-3 p-3 hover:bg-muted/50 relative",
                    !notification.is_read && "bg-blue-50/50 dark:bg-blue-950/10"
                  )}
                >
                  <div className="pt-1">
                    {getNotificationIcon(notification.notification_type)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className={cn(
                      "text-sm",
                      !notification.is_read && "font-medium"
                    )}>
                      {notification.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {notification.message}
                    </p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    {!notification.is_read && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handleMarkAsRead(notification.id)}
                      >
                        <Check className="h-3 w-3" />
                        <span className="sr-only">Mark as read</span>
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-red-500/70 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/10"
                      onClick={() => handleDeleteNotification(notification.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        
        <Separator />
        
        <div className="p-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full justify-center text-xs"
            asChild
          >
            <Link to="/app/settings?tab=notifications">
              Manage Notification Settings
              <ExternalLink className="ml-1 h-3 w-3" />
            </Link>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationsPanel;
