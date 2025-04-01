
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const NotificationSettings = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Project Notifications</CardTitle>
          <CardDescription>
            Configure which project notifications you want to receive.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="project-updates" className="flex flex-col">
                <span>Project Updates</span>
                <span className="text-sm text-muted-foreground">
                  Get notified when a project status changes.
                </span>
              </Label>
              <Switch id="project-updates" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="task-assignments" className="flex flex-col">
                <span>Task Assignments</span>
                <span className="text-sm text-muted-foreground">
                  Get notified when you are assigned a task.
                </span>
              </Label>
              <Switch id="task-assignments" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="migration-errors" className="flex flex-col">
                <span>Migration Errors</span>
                <span className="text-sm text-muted-foreground">
                  Get notified when there are errors in your migrations.
                </span>
              </Label>
              <Switch id="migration-errors" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="migration-complete" className="flex flex-col">
                <span>Migration Completion</span>
                <span className="text-sm text-muted-foreground">
                  Get notified when a migration is completed.
                </span>
              </Label>
              <Switch id="migration-complete" defaultChecked />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account Notifications</CardTitle>
          <CardDescription>
            Configure which account-related notifications you want to receive.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="security-alerts" className="flex flex-col">
                <span>Security Alerts</span>
                <span className="text-sm text-muted-foreground">
                  Get notified about security-related events.
                </span>
              </Label>
              <Switch id="security-alerts" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="billing-updates" className="flex flex-col">
                <span>Billing Updates</span>
                <span className="text-sm text-muted-foreground">
                  Get notified about billing and subscription changes.
                </span>
              </Label>
              <Switch id="billing-updates" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="new-features" className="flex flex-col">
                <span>New Features</span>
                <span className="text-sm text-muted-foreground">
                  Get notified about new features and updates.
                </span>
              </Label>
              <Switch id="new-features" defaultChecked />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Delivery Methods</CardTitle>
          <CardDescription>
            Configure how you want to receive notifications.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-medium">Email Notifications</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email-frequency">Notification Frequency</Label>
                  <Select defaultValue="immediate">
                    <SelectTrigger id="email-frequency">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">Immediate</SelectItem>
                      <SelectItem value="daily">Daily Digest</SelectItem>
                      <SelectItem value="weekly">Weekly Summary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="in-app-notifications" className="flex flex-col">
                  <span>In-App Notifications</span>
                  <span className="text-sm text-muted-foreground">
                    Show notifications within the application.
                  </span>
                </Label>
                <Switch id="in-app-notifications" defaultChecked />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button>Save Notification Preferences</Button>
      </div>
    </div>
  );
};

export default NotificationSettings;
