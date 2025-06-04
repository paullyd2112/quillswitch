
import { useMemo } from 'react';
import { formatDateTime, formatTimeAgo, formatActivityType, formatActivityDescription, formatUserName } from '@/utils/formatters';

interface Activity {
  id: string;
  activity_type: string;
  activity_description: string;
  created_at: string;
  user_id?: string;
  activity_details?: any;
}

interface FormattedActivity extends Activity {
  formattedType: string;
  formattedDescription: string;
  formattedTime: string;
  formattedTimeAgo: string;
  formattedUser: string;
  icon: string;
  color: string;
}

export const useActivityFormatting = (activities: Activity[] = []) => {
  const formattedActivities = useMemo((): FormattedActivity[] => {
    return activities.map(activity => {
      const formattedType = formatActivityType(activity.activity_type);
      const formattedDescription = formatActivityDescription(activity.activity_description);
      const formattedTime = formatDateTime(activity.created_at);
      const formattedTimeAgo = formatTimeAgo(activity.created_at);
      
      // Determine icon and color based on activity type
      let icon = '📝';
      let color = 'text-blue-600';
      
      const type = activity.activity_type?.toLowerCase() || '';
      
      if (type.includes('migration')) {
        icon = '🔄';
        color = 'text-green-600';
      } else if (type.includes('connection') || type.includes('auth')) {
        icon = '🔗';
        color = 'text-blue-600';
      } else if (type.includes('error') || type.includes('failed')) {
        icon = '❌';
        color = 'text-red-600';
      } else if (type.includes('success') || type.includes('completed')) {
        icon = '✅';
        color = 'text-green-600';
      } else if (type.includes('warning')) {
        icon = '⚠️';
        color = 'text-amber-600';
      } else if (type.includes('user') || type.includes('profile')) {
        icon = '👤';
        color = 'text-purple-600';
      } else if (type.includes('data') || type.includes('mapping')) {
        icon = '📊';
        color = 'text-blue-600';
      } else if (type.includes('security') || type.includes('vault')) {
        icon = '🔒';
        color = 'text-red-600';
      }
      
      return {
        ...activity,
        formattedType,
        formattedDescription,
        formattedTime,
        formattedTimeAgo,
        formattedUser: formatUserName({ email: activity.user_id }),
        icon,
        color
      };
    });
  }, [activities]);

  return {
    formattedActivities,
    totalCount: activities.length,
    recentActivities: formattedActivities.slice(0, 5),
    groupedByDate: groupActivitiesByDate(formattedActivities)
  };
};

const groupActivitiesByDate = (activities: FormattedActivity[]) => {
  const groups: Record<string, FormattedActivity[]> = {};
  
  activities.forEach(activity => {
    const date = new Date(activity.created_at).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(activity);
  });
  
  return groups;
};
