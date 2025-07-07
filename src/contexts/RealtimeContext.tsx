import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { RealtimeChannel, RealtimePresenceState } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface UserPresence {
  user_id: string;
  email?: string;
  project_id?: string;
  status: 'online' | 'away' | 'busy';
  last_seen: Date;
  current_page?: string;
  avatar_url?: string;
}

export interface RealtimeNotification {
  id: string;
  type: 'migration_update' | 'error' | 'completion' | 'mapping_change' | 'user_joined';
  title: string;
  message: string;
  user_id?: string;
  project_id?: string;
  timestamp: Date;
  data?: any;
}

interface RealtimeContextType {
  // Presence
  currentUsers: UserPresence[];
  updatePresence: (data: Partial<UserPresence>) => void;
  
  // Migration tracking
  migrationUpdates: Record<string, any>;
  subscribeMigrationUpdates: (projectId: string) => void;
  broadcastMigrationUpdate: (projectId: string, update: any) => void;
  
  // Notifications
  notifications: RealtimeNotification[];
  sendNotification: (notification: Omit<RealtimeNotification, 'id' | 'timestamp'>) => void;
  markNotificationRead: (notificationId: string) => void;
  
  // Data mapping collaboration
  subscribeDataMapping: (projectId: string, callback: (changes: any) => void) => void;
  broadcastMappingChange: (projectId: string, change: any) => void;
  
  // Connection status
  isConnected: boolean;
  connectionCount: number;
}

const RealtimeContext = createContext<RealtimeContextType | undefined>(undefined);

export const RealtimeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [channels, setChannels] = useState<Record<string, RealtimeChannel>>({});
  const [currentUsers, setCurrentUsers] = useState<UserPresence[]>([]);
  const [migrationUpdates, setMigrationUpdates] = useState<Record<string, any>>({});
  const [notifications, setNotifications] = useState<RealtimeNotification[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionCount, setConnectionCount] = useState(0);
  const { toast } = useToast();

  // Initialize main presence channel
  useEffect(() => {
    const presenceChannel = supabase.channel('global_presence', {
      config: {
        presence: { key: 'user_presence' }
      }
    });

    presenceChannel
      .on('presence', { event: 'sync' }, () => {
        const state = presenceChannel.presenceState();
        const users = Object.values(state).flat().map(p => p as unknown as UserPresence);
        setCurrentUsers(users);
        setConnectionCount(users.length);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        const newUsers = newPresences.map(p => p as unknown as UserPresence);
        newUsers.forEach(async (user) => {
          const currentUser = await supabase.auth.getUser();
          if (user.user_id !== currentUser.data.user?.id) {
            toast({
              title: "User Joined",
              description: `${user.email || 'A user'} joined the workspace`,
              duration: 3000,
            });
          }
        });
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        const leftUsers = leftPresences.map(p => p as unknown as UserPresence);
        leftUsers.forEach(user => {
          toast({
            title: "User Left",
            description: `${user.email || 'A user'} left the workspace`,
            duration: 3000,
          });
        });
      })
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED');
      });

    setChannels(prev => ({ ...prev, presence: presenceChannel }));

    // Initialize notifications channel
    const notificationsChannel = supabase.channel('notifications');
    
    notificationsChannel
      .on('broadcast', { event: 'notification' }, ({ payload }) => {
        const notification: RealtimeNotification = {
          ...payload,
          id: crypto.randomUUID(),
          timestamp: new Date(),
        };
        
        setNotifications(prev => [notification, ...prev].slice(0, 50)); // Keep last 50
        
        toast({
          title: notification.title,
          description: notification.message,
          duration: 5000,
        });
      })
      .subscribe();

    setChannels(prev => ({ ...prev, notifications: notificationsChannel }));

    return () => {
      Object.values(channels).forEach(channel => {
        supabase.removeChannel(channel);
      });
    };
  }, [toast]);

  const updatePresence = useCallback(async (data: Partial<UserPresence>) => {
    const channel = channels.presence;
    if (!channel) return;

    const user = await supabase.auth.getUser();
    if (!user.data.user) return;

    const presenceData: UserPresence = {
      user_id: user.data.user.id,
      email: user.data.user.email,
      status: 'online',
      last_seen: new Date(),
      ...data,
    };

    await channel.track(presenceData);
  }, [channels]);

  const subscribeMigrationUpdates = useCallback((projectId: string) => {
    const channelName = `migration_${projectId}`;
    
    if (channels[channelName]) return; // Already subscribed

    const migrationChannel = supabase.channel(channelName);
    
    migrationChannel
      .on('broadcast', { event: 'migration_update' }, ({ payload }) => {
        setMigrationUpdates(prev => ({
          ...prev,
          [projectId]: { ...prev[projectId], ...payload }
        }));
      })
      .subscribe();

    setChannels(prev => ({ ...prev, [channelName]: migrationChannel }));
  }, [channels]);

  const broadcastMigrationUpdate = useCallback((projectId: string, update: any) => {
    const channelName = `migration_${projectId}`;
    const channel = channels[channelName];
    
    if (channel) {
      channel.send({
        type: 'broadcast',
        event: 'migration_update',
        payload: update
      });
    }
  }, [channels]);

  const subscribeDataMapping = useCallback((projectId: string, callback: (changes: any) => void) => {
    const channelName = `mapping_${projectId}`;
    
    if (channels[channelName]) return;

    const mappingChannel = supabase.channel(channelName);
    
    mappingChannel
      .on('broadcast', { event: 'mapping_change' }, ({ payload }) => {
        callback(payload);
      })
      .subscribe();

    setChannels(prev => ({ ...prev, [channelName]: mappingChannel }));
  }, [channels]);

  const broadcastMappingChange = useCallback((projectId: string, change: any) => {
    const channelName = `mapping_${projectId}`;
    const channel = channels[channelName];
    
    if (channel) {
      channel.send({
        type: 'broadcast',
        event: 'mapping_change',
        payload: change
      });
    }
  }, [channels]);

  const sendNotification = useCallback((notification: Omit<RealtimeNotification, 'id' | 'timestamp'>) => {
    const channel = channels.notifications;
    if (channel) {
      channel.send({
        type: 'broadcast',
        event: 'notification',
        payload: notification
      });
    }
  }, [channels]);

  const markNotificationRead = useCallback((notificationId: string) => {
    setNotifications(prev => 
      prev.filter(n => n.id !== notificationId)
    );
  }, []);

  const value: RealtimeContextType = {
    currentUsers,
    updatePresence,
    migrationUpdates,
    subscribeMigrationUpdates,
    broadcastMigrationUpdate,
    notifications,
    sendNotification,
    markNotificationRead,
    subscribeDataMapping,
    broadcastMappingChange,
    isConnected,
    connectionCount,
  };

  return (
    <RealtimeContext.Provider value={value}>
      {children}
    </RealtimeContext.Provider>
  );
};

export const useRealtime = () => {
  const context = useContext(RealtimeContext);
  if (context === undefined) {
    throw new Error('useRealtime must be used within a RealtimeProvider');
  }
  return context;
};