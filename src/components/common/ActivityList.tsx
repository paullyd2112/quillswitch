
import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useActivityFormatting } from '@/hooks/useActivityFormatting';

interface Activity {
  id: string;
  activity_type: string;
  activity_description: string;
  created_at: string;
  user_id?: string;
  activity_details?: any;
}

interface ActivityListProps {
  activities: Activity[];
  title?: string;
  limit?: number;
  showGrouping?: boolean;
  loading?: boolean;
  className?: string;
  compact?: boolean;
}

const ActivityList: React.FC<ActivityListProps> = ({
  activities,
  title = "Recent Activity",
  limit,
  showGrouping = false,
  loading = false,
  className,
  compact = false
}) => {
  const { formattedActivities, groupedByDate } = useActivityFormatting(activities);
  
  const displayActivities = limit 
    ? formattedActivities.slice(0, limit)
    : formattedActivities;

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-start space-x-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (displayActivities.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No activities to display
          </div>
        </CardContent>
      </Card>
    );
  }

  if (showGrouping) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {Object.entries(groupedByDate).map(([date, dayActivities]) => (
            <div key={date}>
              <h4 className="text-sm font-medium text-muted-foreground mb-3">
                {new Date(date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </h4>
              <div className="space-y-3">
                {dayActivities.map((activity) => (
                  <ActivityItem
                    key={activity.id}
                    activity={activity}
                    compact={compact}
                  />
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {title}
          {limit && formattedActivities.length > limit && (
            <span className="text-sm font-normal text-muted-foreground">
              Showing {limit} of {formattedActivities.length}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {displayActivities.map((activity) => (
          <ActivityItem
            key={activity.id}
            activity={activity}
            compact={compact}
          />
        ))}
      </CardContent>
    </Card>
  );
};

interface ActivityItemProps {
  activity: {
    id: string;
    formattedType: string;
    formattedDescription: string;
    formattedTimeAgo: string;
    formattedUser: string;
    icon: string;
    color: string;
  };
  compact?: boolean;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ activity, compact = false }) => {
  return (
    <div className={cn(
      'flex items-start space-x-3 p-3 rounded-lg border bg-card/50',
      compact && 'p-2'
    )}>
      <div className={cn(
        'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm',
        'bg-background border'
      )}>
        <span>{activity.icon}</span>
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="outline" className={cn('text-xs', activity.color)}>
            {activity.formattedType}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {activity.formattedTimeAgo}
          </span>
        </div>
        
        <p className={cn(
          'text-sm text-foreground',
          compact && 'text-xs'
        )}>
          {activity.formattedDescription}
        </p>
        
        {!compact && activity.formattedUser && (
          <p className="text-xs text-muted-foreground mt-1">
            by {activity.formattedUser}
          </p>
        )}
      </div>
    </div>
  );
};

export default ActivityList;
