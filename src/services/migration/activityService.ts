
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
export const logUserActivity = async (params: {
  project_id: string;
  activity_type: string;
  activity_description: string;
  activity_details?: any;
}): Promise<void> => {
  try {
    await supabase
      .from('user_activities')
      .insert({
        project_id: params.project_id,
        user_id: (await supabase.auth.getUser()).data.user?.id,
        activity_type: params.activity_type,
        activity_description: params.activity_description,
        activity_details: params.activity_details || null
      });
  } catch (error) {
    handleServiceError(error, "Error logging user activity", true);
  }
};
