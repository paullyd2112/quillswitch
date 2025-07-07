import React, { useEffect } from 'react';
import { useRealtime, UserPresence } from '@/contexts/RealtimeContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Users, Wifi, WifiOff } from 'lucide-react';

interface UserPresenceIndicatorProps {
  projectId?: string;
  showCount?: boolean;
  maxVisible?: number;
}

export const UserPresenceIndicator: React.FC<UserPresenceIndicatorProps> = ({
  projectId,
  showCount = true,
  maxVisible = 5
}) => {
  const { currentUsers, updatePresence, isConnected, connectionCount } = useRealtime();

  // Update presence when component mounts and on activity
  useEffect(() => {
    updatePresence({
      project_id: projectId,
      current_page: window.location.pathname,
      status: 'online'
    });

    // Update presence on page visibility change
    const handleVisibilityChange = () => {
      updatePresence({
        status: document.hidden ? 'away' : 'online'
      });
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [projectId, updatePresence]);

  const filteredUsers = projectId 
    ? currentUsers.filter(user => user.project_id === projectId)
    : currentUsers;

  const visibleUsers = filteredUsers.slice(0, maxVisible);
  const hiddenCount = Math.max(0, filteredUsers.length - maxVisible);

  const getStatusColor = (status: UserPresence['status']) => {
    switch (status) {
      case 'online': return 'bg-success';
      case 'away': return 'bg-warning';
      case 'busy': return 'bg-error';
      default: return 'bg-muted';
    }
  };

  const getInitials = (email?: string) => {
    if (!email) return 'U';
    return email.split('@')[0].substring(0, 2).toUpperCase();
  };

  return (
    <TooltipProvider>
      <div className="flex items-center gap-2 p-2 rounded-lg bg-card/50 border">
        {/* Connection Status */}
        <div className="flex items-center gap-1">
          {isConnected ? (
            <Wifi className="h-4 w-4 text-success" />
          ) : (
            <WifiOff className="h-4 w-4 text-error" />
          )}
        </div>

        {/* User Avatars */}
        <div className="flex -space-x-2">
          {visibleUsers.map((user) => (
            <Tooltip key={user.user_id}>
              <TooltipTrigger>
                <div className="relative">
                  <Avatar className="h-8 w-8 border-2 border-background">
                    <AvatarImage src={user.avatar_url} />
                    <AvatarFallback className="text-xs">
                      {getInitials(user.email)}
                    </AvatarFallback>
                  </Avatar>
                  {/* Status indicator */}
                  <div className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background ${getStatusColor(user.status)}`} />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-sm">
                  <div className="font-medium">{user.email}</div>
                  <div className="text-muted-foreground capitalize">{user.status}</div>
                  {user.current_page && (
                    <div className="text-xs text-muted-foreground">
                      On: {user.current_page}
                    </div>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          ))}
          
          {hiddenCount > 0 && (
            <Tooltip>
              <TooltipTrigger>
                <div className="h-8 w-8 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                  <span className="text-xs font-medium">+{hiddenCount}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-sm">
                  {hiddenCount} more user{hiddenCount > 1 ? 's' : ''} online
                </div>
              </TooltipContent>
            </Tooltip>
          )}
        </div>

        {/* Connection Count */}
        {showCount && (
          <Badge variant="secondary" className="ml-2">
            <Users className="h-3 w-3 mr-1" />
            {connectionCount}
          </Badge>
        )}
      </div>
    </TooltipProvider>
  );
};