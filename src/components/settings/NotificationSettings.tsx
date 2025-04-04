
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Bell, Mail, Shield, MessageSquare, CreditCard, AlertTriangle, Zap } from "lucide-react";

const NotificationSettings = () => {
  const [projectNotifications, setProjectNotifications] = useState({
    statusChanges: true,
    errors: true,
    completions: true,
    dataValidation: true,
    mappingChanges: false
  });

  const [accountNotifications, setAccountNotifications] = useState({
    billing: true,
    security: true,
    newsletter: false,
    productUpdates: true,
    maintenance: true
  });

  const [deliveryMethods, setDeliveryMethods] = useState({
    email: true,
    inApp: true,
    sms: false
  });

  const handleProjectNotificationChange = (key: string, checked: boolean) => {
    setProjectNotifications({
      ...projectNotifications,
      [key]: checked
    });
  };

  const handleAccountNotificationChange = (key: string, checked: boolean) => {
    setAccountNotifications({
      ...accountNotifications,
      [key]: checked
    });
  };

  const handleDeliveryMethodChange = (key: string, checked: boolean) => {
    setDeliveryMethods({
      ...deliveryMethods,
      [key]: checked
    });
  };

  const handleSaveNotifications = () => {
    // In a real app, this would send the notification preferences to the backend
    toast.success("Notification preferences saved");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Project Notifications</CardTitle>
          <CardDescription>
            Control notifications related to your migration projects.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4 text-muted-foreground" />
                <div>
                  <Label htmlFor="statusChanges" className="font-medium">Status Changes</Label>
                  <p className="text-sm text-muted-foreground">Notify when a project status changes</p>
                </div>
              </div>
              <Switch
                id="statusChanges"
                checked={projectNotifications.statusChanges}
                onCheckedChange={(checked) => handleProjectNotificationChange("statusChanges", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                <div>
                  <Label htmlFor="errors" className="font-medium">Errors & Warnings</Label>
                  <p className="text-sm text-muted-foreground">Notify about errors during migration</p>
                </div>
              </div>
              <Switch
                id="errors"
                checked={projectNotifications.errors}
                onCheckedChange={(checked) => handleProjectNotificationChange("errors", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-2">
                <Bell className="h-4 w-4 text-muted-foreground" />
                <div>
                  <Label htmlFor="completions" className="font-medium">Project Completions</Label>
                  <p className="text-sm text-muted-foreground">Notify when a project is completed</p>
                </div>
              </div>
              <Switch
                id="completions"
                checked={projectNotifications.completions}
                onCheckedChange={(checked) => handleProjectNotificationChange("completions", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <div>
                  <Label htmlFor="dataValidation" className="font-medium">Data Validation</Label>
                  <p className="text-sm text-muted-foreground">Notify about data validation issues</p>
                </div>
              </div>
              <Switch
                id="dataValidation"
                checked={projectNotifications.dataValidation}
                onCheckedChange={(checked) => handleProjectNotificationChange("dataValidation", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <div>
                  <Label htmlFor="mappingChanges" className="font-medium">Mapping Changes</Label>
                  <p className="text-sm text-muted-foreground">Notify when field mappings are changed</p>
                </div>
              </div>
              <Switch
                id="mappingChanges"
                checked={projectNotifications.mappingChanges}
                onCheckedChange={(checked) => handleProjectNotificationChange("mappingChanges", checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Account Notifications</CardTitle>
          <CardDescription>
            Control notifications related to your account, billing, and security.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-2">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <div>
                  <Label htmlFor="billing" className="font-medium">Billing Updates</Label>
                  <p className="text-sm text-muted-foreground">Invoices, payment reminders, and billing changes</p>
                </div>
              </div>
              <Switch
                id="billing"
                checked={accountNotifications.billing}
                onCheckedChange={(checked) => handleAccountNotificationChange("billing", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <div>
                  <Label htmlFor="security" className="font-medium">Security Alerts</Label>
                  <p className="text-sm text-muted-foreground">Unusual logins, password changes, 2FA events</p>
                </div>
              </div>
              <Switch
                id="security"
                checked={accountNotifications.security}
                onCheckedChange={(checked) => handleAccountNotificationChange("security", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <Label htmlFor="newsletter" className="font-medium">Newsletter</Label>
                  <p className="text-sm text-muted-foreground">Monthly newsletter with tips and updates</p>
                </div>
              </div>
              <Switch
                id="newsletter"
                checked={accountNotifications.newsletter}
                onCheckedChange={(checked) => handleAccountNotificationChange("newsletter", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4 text-muted-foreground" />
                <div>
                  <Label htmlFor="productUpdates" className="font-medium">Product Updates</Label>
                  <p className="text-sm text-muted-foreground">New features, improvements, and changes</p>
                </div>
              </div>
              <Switch
                id="productUpdates"
                checked={accountNotifications.productUpdates}
                onCheckedChange={(checked) => handleAccountNotificationChange("productUpdates", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-2">
                <Bell className="h-4 w-4 text-muted-foreground" />
                <div>
                  <Label htmlFor="maintenance" className="font-medium">Maintenance Notices</Label>
                  <p className="text-sm text-muted-foreground">Scheduled maintenance and downtime</p>
                </div>
              </div>
              <Switch
                id="maintenance"
                checked={accountNotifications.maintenance}
                onCheckedChange={(checked) => handleAccountNotificationChange("maintenance", checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Delivery Methods</CardTitle>
          <CardDescription>
            Choose how you would like to receive notifications.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div>
                <Label htmlFor="email" className="font-medium">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive notifications via email</p>
              </div>
              <Switch
                id="email"
                checked={deliveryMethods.email}
                onCheckedChange={(checked) => handleDeliveryMethodChange("email", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between py-2">
              <div>
                <Label htmlFor="inApp" className="font-medium">In-App Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive notifications in the application</p>
              </div>
              <Switch
                id="inApp"
                checked={deliveryMethods.inApp}
                onCheckedChange={(checked) => handleDeliveryMethodChange("inApp", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between py-2">
              <div>
                <Label htmlFor="sms" className="font-medium">SMS Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive notifications via SMS (charges may apply)</p>
              </div>
              <Switch
                id="sms"
                checked={deliveryMethods.sms}
                onCheckedChange={(checked) => handleDeliveryMethodChange("sms", checked)}
              />
            </div>
          </div>
          
          <div className="flex justify-end mt-6">
            <Button onClick={handleSaveNotifications}>Save Preferences</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationSettings;
