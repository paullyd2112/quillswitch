
import { supabase } from "@/integrations/supabase/client";
import { UserActivity } from "@/integrations/supabase/migrationTypes";
import { handleServiceError } from "../utils/serviceUtils";

/**
 * Get user activities for a project
 */
export const getUserActivities = async (projectId: string): Promise<UserActivity[]> => {
  try {
    const { data, error } = await supabase
      .from('user_activities')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data || [];
  } catch (error: any) {
    handleServiceError(error, "Error fetching user activities", true);
    return [];
  }
};

/**
 * Log user activity
 */
export const logUserActivity = async (
  projectId: string, 
  activityType: string,
  activityDescription: string,
  activityDetails: any = null
): Promise<void> => {
  try {
    await supabase
      .from('user_activities')
      .insert({
        project_id: projectId,
        user_id: (await supabase.auth.getUser()).data.user?.id,
        activity_type: activityType,
        activity_description: activityDescription,
        activity_details: activityDetails
      });
  } catch (error) {
    handleServiceError(error, "Error logging user activity", true);
  }
};
