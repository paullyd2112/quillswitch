
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { apiClient } from "./apiClient";
import { UserNotificationPreferences } from "@/integrations/supabase/userTypes";
import { safeTable } from "@/services/utils/supabaseUtils";

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
 * Delivery methods for notifications
 */
export type NotificationDeliveryMethod = 'in_app' | 'email' | 'sms' | 'webhook';

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
 * Interface for notification preferences
 */
export interface NotificationPreferences {
  statusChanges: boolean;
  errors: boolean;
  completions: boolean;
  dataValidation: boolean;
  mappingChanges: boolean;
  deliveryMethods: {
    email: boolean;
    inApp: boolean;
    sms: boolean;
  };
  emailAddress?: string;
  phoneNumber?: string;
}

// Default notification preferences
export const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  statusChanges: true,
  errors: true,
  completions: true,
  dataValidation: true,
  mappingChanges: false,
  deliveryMethods: {
    email: false,
    inApp: true,
    sms: false
  }
};

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
    await triggerWebhookNotification(data as MigrationNotification);
    
    // Send email notification if enabled
    await sendEmailNotificationIfEnabled(data as MigrationNotification);
    
    return data as MigrationNotification;
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
    
    return (data || []) as MigrationNotification[];
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
 * Get notification preferences for a user from database
 */
export const getNotificationPreferences = async (userId: string): Promise<NotificationPreferences> => {
  try {
    // Explicitly cast the response type to handle the user_notification_preferences table
    const { data, error } = await safeTable<UserNotificationPreferences>('user_notification_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) {
      console.error("Failed to get notification preferences:", error);
      throw error;
    }
    
    if (!data) {
      // Create default preferences if none exist
      const preferences = DEFAULT_NOTIFICATION_PREFERENCES;
      await saveNotificationPreferences(userId, preferences);
      return preferences;
    }
    
    // Map from database format to application format
    const dbPrefs = data as unknown as UserNotificationPreferences;
    return {
      statusChanges: dbPrefs.status_changes,
      errors: dbPrefs.errors,
      completions: dbPrefs.completions,
      dataValidation: dbPrefs.data_validation,
      mappingChanges: dbPrefs.mapping_changes,
      deliveryMethods: {
        email: dbPrefs.email_delivery,
        inApp: dbPrefs.in_app_delivery,
        sms: dbPrefs.sms_delivery
      },
      emailAddress: dbPrefs.email_address || undefined,
      phoneNumber: dbPrefs.phone_number || undefined
    };
  } catch (error) {
    console.error("Error in getNotificationPreferences:", error);
    // Fall back to default preferences
    return DEFAULT_NOTIFICATION_PREFERENCES;
  }
};

/**
 * Helper function to get the user's email
 */
const getUserEmail = async (): Promise<string | undefined> => {
  const session = await supabase.auth.getSession();
  return session.data.session?.user.email;
};

/**
 * Save notification preferences for a user
 */
export const saveNotificationPreferences = async (
  userId: string, 
  preferences: NotificationPreferences
): Promise<boolean> => {
  try {
    // Check if user has preferences already
    const { data: existingData, error: checkError } = await safeTable<UserNotificationPreferences>('user_notification_preferences')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (checkError) throw checkError;
    
    const dbPreferences = {
      user_id: userId,
      status_changes: preferences.statusChanges,
      errors: preferences.errors,
      completions: preferences.completions,
      data_validation: preferences.dataValidation,
      mapping_changes: preferences.mappingChanges,
      email_delivery: preferences.deliveryMethods.email,
      in_app_delivery: preferences.deliveryMethods.inApp,
      sms_delivery: preferences.deliveryMethods.sms,
      email_address: preferences.emailAddress,
      phone_number: preferences.phoneNumber
    };
    
    let result;
    
    if (existingData) {
      // Update existing preferences
      result = await safeTable<UserNotificationPreferences>('user_notification_preferences')
        .update(dbPreferences)
        .eq('user_id', userId);
    } else {
      // Insert new preferences
      result = await safeTable<UserNotificationPreferences>('user_notification_preferences')
        .insert(dbPreferences);
    }
    
    if (result.error) throw result.error;
    
    toast.success("Notification preferences saved", {
      description: "Your notification settings have been updated."
    });
    
    return true;
  } catch (error: any) {
    console.error("Failed to save notification preferences:", error);
    
    toast.error("Error saving preferences", {
      description: error.message || "There was an error saving your notification preferences"
    });
    
    return false;
  }
};

/**
 * Helper function to trigger webhooks for notifications
 */
const triggerWebhookNotification = async (notification: MigrationNotification): Promise<void> => {
  try {
    // Get all registered webhooks - Fixed to use the correct method
    const webhooksResponse = await apiClient.webhooks.getWebhooks();
    
    // Type guard to ensure we have the proper response structure
    const webhooks = webhooksResponse?.data?.data;
    
    if (!webhooks || !Array.isArray(webhooks) || webhooks.length === 0) {
      return;
    }
    
    // Trigger each webhook with the notification data
    for (const webhook of webhooks) {
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

/**
 * Helper function to send email notifications if enabled
 */
const sendEmailNotificationIfEnabled = async (notification: MigrationNotification): Promise<void> => {
  try {
    // Get user information to know where to send email
    const userSession = await supabase.auth.getSession();
    if (!userSession.data.session?.user.id) {
      console.log('No authenticated user found for email notification');
      return;
    }
    
    const userId = userSession.data.session.user.id;
    
    // Get user notification preferences
    const preferences = await getNotificationPreferences(userId);
    if (!preferences || !preferences.deliveryMethods.email || !preferences.emailAddress) {
      console.log('Email notifications not enabled for this user');
      return;
    }
    
    // Check if this notification type is enabled
    switch (notification.notification_type) {
      case 'migration_started':
      case 'migration_paused':
      case 'migration_resumed':
        if (!preferences.statusChanges) return;
        break;
      case 'migration_completed':
        if (!preferences.completions) return;
        break;
      case 'error_occurred':
        if (!preferences.errors) return;
        break;
      case 'validation_completed':
        if (!preferences.dataValidation) return;
        break;
      case 'stage_completed':
        if (!preferences.statusChanges) return;
        break;
    }
    
    // Get project info for more context in the email
    const { data: projectData } = await supabase
      .from('migration_projects')
      .select('company_name')
      .eq('id', notification.project_id)
      .single();
    
    const projectName = projectData?.company_name || 'CRM Migration Project';
    
    try {
      // Call the email notification edge function
      const response = await fetch(`https://kxjidapjtcxwzpwdomnm.supabase.co/functions/v1/send-notification-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        },
        body: JSON.stringify({
          email: preferences.emailAddress,
          title: notification.title,
          message: notification.message,
          notificationType: notification.notification_type,
          projectName
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Email notification failed: ${errorData.error || response.statusText}`);
      }
      
      console.log('Email notification sent successfully');
    } catch (emailError: any) {
      console.error('Failed to send email notification:', emailError);
    }
  } catch (error: any) {
    console.error("Error in sendEmailNotificationIfEnabled:", error);
  }
};
