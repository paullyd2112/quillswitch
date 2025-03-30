
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserActivity } from "@/integrations/supabase/migrationTypes";
import { 
  Activity, 
  Download, 
  Upload, 
  Check, 
  X, 
  Pause, 
  Play, 
  AlertTriangle, 
  Settings, 
  User
} from "lucide-react";

interface ActivityTimelineProps {
  activities: UserActivity[];
  limit?: number;
}

const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ activities, limit = 10 }) => {
  const limitedActivities = activities.slice(0, limit);

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString();
  };

  const getActivityIcon = (activityType: string) => {
    switch (activityType) {
      case "project_creation":
        return <Settings className="h-4 w-4" />;
      case "data_extraction":
        return <Download className="h-4 w-4" />;
      case "data_import":
        return <Upload className="h-4 w-4" />;
      case "validation":
        return <Check className="h-4 w-4" />;
      case "error":
        return <X className="h-4 w-4" />;
      case "project_paused":
        return <Pause className="h-4 w-4" />;
      case "project_resumed":
        return <Play className="h-4 w-4" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4" />;
      case "user_action":
        return <User className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getActivityColor = (activityType: string) => {
    switch (activityType) {
      case "project_creation":
        return "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400";
      case "data_extraction":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400";
      case "data_import":
        return "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400";
      case "validation":
        return "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400";
      case "error":
        return "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400";
      case "project_paused":
        return "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400";
      case "project_resumed":
        return "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400";
      case "warning":
        return "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400";
      case "user_action":
        return "bg-slate-100 dark:bg-slate-900/30 text-slate-600 dark:text-slate-400";
      default:
        return "bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        {limitedActivities.length > 0 ? (
          <div className="relative pl-6 space-y-6">
            <div className="absolute inset-y-0 left-3 w-px -translate-x-1/2 bg-border"></div>
            
            {limitedActivities.map((activity) => (
              <div key={activity.id} className="relative">
                <div className={`absolute left-0 -translate-x-1/2 flex h-6 w-6 items-center justify-center rounded-full ${getActivityColor(activity.activity_type)}`}>
                  {getActivityIcon(activity.activity_type)}
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{activity.activity_description}</span>
                    <span className="text-muted-foreground">{formatDate(activity.created_at)}</span>
                  </div>
                  {activity.activity_details && (
                    <p className="text-xs text-muted-foreground">
                      {JSON.stringify(activity.activity_details)
                        .replace(/[{}]/g, '')
                        .replace(/"/g, '')
                        .replace(/,/g, ', ')}
                    </p>
                  )}
                </div>
              </div>
            ))}
            
            {activities.length > limit && (
              <div className="text-center pt-2">
                <p className="text-sm text-muted-foreground">
                  + {activities.length - limit} more activities
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="py-6 text-center">
            <p className="text-muted-foreground">No activity recorded yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityTimeline;
