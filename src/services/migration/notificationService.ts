
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { apiClient } from "./apiClient";

/**
 * Notification types
 */
export type NotificationType = 
  | 'migration_started' 
  | 'migration_completed'
  | 'migration_paused'
  | 'migration_resumed'
  | 'validation_completed'
  | 'error_occurred'
  | 'stage_completed';

/**
 * Interface for notifications
 */
export interface MigrationNotification {
  id: string;
  title: string;
  message: string;
  notification_type: NotificationType;
  project_id: string;
  user_id?: string;
  is_read: boolean;
  created_at: string;
}

/**
 * Create a new notification
 */
export const createNotification = async (
  projectId: string,
  title: string,
  message: string,
  type: NotificationType,
  userId?: string
): Promise<MigrationNotification | null> => {
  try {
    const { data, error } = await supabase
      .from('migration_notifications')
      .insert({
        project_id: projectId,
        title,
        message,
        notification_type: type,
        user_id: userId,
        is_read: false
      })
      .select()
      .single();
    
    if (error) throw error;
    
    // Trigger notification to all registered webhooks
    await triggerWebhookNotification(data);
    
    return data;
  } catch (error: any) {
    console.error("Failed to create notification:", error);
    return null;
  }
};

/**
 * Get notifications for a project
 */
export const getProjectNotifications = async (
  projectId: string,
  limit: number = 50,
  includeRead: boolean = false
): Promise<MigrationNotification[]> => {
  try {
    let query = supabase
      .from('migration_notifications')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })
      .limit(limit);
      
    if (!includeRead) {
      query = query.eq('is_read', false);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return data || [];
  } catch (error: any) {
    console.error("Failed to fetch notifications:", error);
    return [];
  }
};

/**
 * Mark a notification as read
 */
export const markNotificationAsRead = async (notificationId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('migration_notifications')
      .update({ is_read: true })
      .eq('id', notificationId);
    
    if (error) throw error;
    
    return true;
  } catch (error: any) {
    console.error("Failed to mark notification as read:", error);
    return false;
  }
};

/**
 * Mark all notifications for a project as read
 */
export const markAllNotificationsAsRead = async (projectId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('migration_notifications')
      .update({ is_read: true })
      .eq('project_id', projectId)
      .eq('is_read', false);
    
    if (error) throw error;
    
    return true;
  } catch (error: any) {
    console.error("Failed to mark all notifications as read:", error);
    return false;
  }
};

/**
 * Delete a notification
 */
export const deleteNotification = async (notificationId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('migration_notifications')
      .delete()
      .eq('id', notificationId);
    
    if (error) throw error;
    
    return true;
  } catch (error: any) {
    console.error("Failed to delete notification:", error);
    return false;
  }
};

/**
 * Helper function to trigger webhooks for notifications
 */
const triggerWebhookNotification = async (notification: MigrationNotification): Promise<void> => {
  try {
    // Get all registered webhooks
    const webhooks = await apiClient.webhooks.getWebhooks();
    
    if (!webhooks?.data?.data?.length) {
      return;
    }
    
    // Trigger each webhook with the notification data
    for (const webhook of webhooks.data.data) {
      try {
        // Call the webhook URL with notification data
        const response = await fetch(webhook.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            event: notification.notification_type,
            notification: {
              id: notification.id,
              title: notification.title,
              message: notification.message,
              type: notification.notification_type,
              project_id: notification.project_id,
              created_at: notification.created_at
            }
          }),
        });
        
        // Log webhook result
        console.log(`Webhook ${webhook.id} triggered with status ${response.status}`);
      } catch (webhookError) {
        console.error(`Failed to trigger webhook ${webhook.id}:`, webhookError);
      }
    }
  } catch (error) {
    console.error("Failed to trigger webhooks:", error);
  }
};
