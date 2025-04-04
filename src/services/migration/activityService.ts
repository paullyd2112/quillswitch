
import { supabase } from "@/integrations/supabase/client";

/**
 * Log a user activity for a migration project
 */
export const logUserActivity = async (params: {
  project_id: string;
  activity_type: string;
  activity_description: string;
  activity_details?: any;
}) => {
  try {
    const { project_id, activity_type, activity_description, activity_details } = params;
    const user = await supabase.auth.getUser();
    
    await supabase.from('user_activities').insert({
      project_id,
      user_id: user.data.user?.id,
      activity_type,
      activity_description,
      activity_details
    });
    
  } catch (error) {
    console.error("Error logging user activity:", error);
  }
};

/**
 * Get user activities for a migration project
 */
export const getUserActivities = async (projectId: string) => {
  try {
    const { data, error } = await supabase
      .from('user_activities')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error("Error fetching user activities:", error);
    return [];
  }
};
