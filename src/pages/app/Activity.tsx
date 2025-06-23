
import React from "react";
import ContentSection from "@/components/layout/ContentSection";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity as ActivityIcon, Clock, User, Database } from "lucide-react";

const Activity = () => {
  const activities = [
    {
      id: 1,
      type: "migration",
      title: "Salesforce Migration Started",
      description: "Migration from Salesforce to HubSpot initiated",
      timestamp: "2 hours ago",
      icon: Database,
      status: "in-progress"
    },
    {
      id: 2,
      type: "connection",
      title: "HubSpot Connection Established",
      description: "Successfully connected to HubSpot CRM",
      timestamp: "3 hours ago",
      icon: User,
      status: "success"
    },
    {
      id: 3,
      type: "validation",
      title: "Data Validation Completed",
      description: "All 10,500 records validated successfully",
      timestamp: "5 hours ago",
      icon: ActivityIcon,
      status: "success"
    },
    {
      id: 4,
      type: "mapping",
      title: "Field Mapping Updated",
      description: "Updated mapping for Contact fields",
      timestamp: "1 day ago",
      icon: Database,
      status: "success"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "text-green-600";
      case "in-progress":
        return "text-blue-600";
      case "error":
        return "text-red-600";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-8">
        <ContentSection 
          title="Activity Log"
          description="Track all system activities and migration events."
          centered={false}
        >
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest events and activities across your migrations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                    <div className={`p-2 rounded-full bg-muted ${getStatusColor(activity.status)}`}>
                      <activity.icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium">{activity.title}</h3>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          {activity.timestamp}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {activity.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              {activities.length === 0 && (
                <div className="bg-muted/30 rounded-lg p-8 text-center">
                  <ActivityIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground/70" />
                  <h3 className="text-lg font-medium">No Activity Yet</h3>
                  <p className="text-muted-foreground mt-2">
                    Activity will appear here as you use the platform.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </ContentSection>
      </div>
    </div>
  );
};

export default Activity;
