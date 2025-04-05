
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Bell, Mail, Shield, MessageSquare, CreditCard, AlertTriangle, Zap, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getNotificationPreferences, saveNotificationPreferences } from "@/services/migration/notificationService";

const NotificationSettings = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
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
    email: false,
    inApp: true,
    sms: false
  });

  const [emailAddress, setEmailAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    const fetchUserPreferences = async () => {
      try {
        setIsLoading(true);
        
        // Get current user
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) {
          throw new Error("User not found");
        }
        
        // Get saved email address from user profile
        setEmailAddress(userData.user.email || "");
        
        // Get notification preferences
        const preferences = await getNotificationPreferences(userData.user.id);
        if (preferences) {
          setProjectNotifications({
            statusChanges: preferences.statusChanges,
            errors: preferences.errors,
            completions: preferences.completions,
            dataValidation: preferences.dataValidation,
            mappingChanges: preferences.mappingChanges
          });
          
          setDeliveryMethods(preferences.deliveryMethods);
          
          if (preferences.phoneNumber) {
            setPhoneNumber(preferences.phoneNumber);
          }
        }
      } catch (error) {
        console.error("Failed to fetch notification preferences:", error);
        toast.error("Failed to load notification preferences");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserPreferences();
  }, []);

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

  const handleSaveNotifications = async () => {
    try {
      setIsSaving(true);
      
      // Get current user
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        throw new Error("User not found");
      }
      
      // Validate email if email notifications are enabled
      if (deliveryMethods.email && !emailAddress) {
        toast.error("Please provide an email address for email notifications");
        return;
      }
      
      // Validate phone number if SMS notifications are enabled
      if (deliveryMethods.sms && !phoneNumber) {
        toast.error("Please provide a phone number for SMS notifications");
        return;
      }
      
      // Save the notification preferences
      const success = await saveNotificationPreferences(userData.user.id, {
        ...projectNotifications,
        deliveryMethods,
        emailAddress,
        phoneNumber
      });
      
      if (success) {
        toast.success("Notification preferences saved");
      } else {
        throw new Error("Failed to save preferences");
      }
    } catch (error) {
      console.error("Error saving notification preferences:", error);
      toast.error("Failed to save notification preferences");
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestEmailNotification = async () => {
    if (!deliveryMethods.email || !emailAddress) {
      toast.error("Email notifications are not enabled. Please enable them and provide an email address.");
      return;
    }

    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        throw new Error("User not found");
      }

      // Create a test notification in the database
      const response = await fetch(`https://kxjidapjtcxwzpwdomnm.supabase.co/functions/v1/send-notification-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        },
        body: JSON.stringify({
          email: emailAddress,
          title: "Test Notification",
          message: "This is a test email notification from your CRM Migration platform. If you received this, your email notifications are working correctly!",
          notificationType: "migration_started",
          projectName: "Test Project"
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to send test notification");
      }

      toast.success("Test email notification sent");
    } catch (error: any) {
      console.error("Error sending test notification:", error);
      toast.error(`Failed to send test notification: ${error.message}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

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
                <Label htmlFor="email" className="font-medium">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive notifications via email</p>
              </div>
              <Switch
                id="email"
                checked={deliveryMethods.email}
                onCheckedChange={(checked) => handleDeliveryMethodChange("email", checked)}
              />
            </div>
            
            {deliveryMethods.email && (
              <div className="ml-6 border-l-2 border-muted pl-4 pb-2">
                <Label htmlFor="emailAddress" className="text-sm font-medium mb-2 block">
                  Email Address
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="emailAddress"
                    type="email"
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    placeholder="your-email@example.com"
                  />
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={handleTestEmailNotification}
                    type="button"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Test
                  </Button>
                </div>
              </div>
            )}
            
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
            
            {deliveryMethods.sms && (
              <div className="ml-6 border-l-2 border-muted pl-4 pb-2">
                <Label htmlFor="phoneNumber" className="text-sm font-medium mb-2 block">
                  Phone Number
                </Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+1 (123) 456-7890"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Enter phone number in international format (e.g., +1 234 567 8900)
                </p>
              </div>
            )}
          </div>
          
          <div className="flex justify-end mt-6">
            <Button 
              onClick={handleSaveNotifications} 
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                  Saving...
                </>
              ) : "Save Preferences"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationSettings;
