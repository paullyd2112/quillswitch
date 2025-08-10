
import React, { useState } from "react";
import FadeIn from "@/components/animations/FadeIn";
import GlassPanel from "@/components/ui-elements/GlassPanel";
import { Settings, Bell, Zap, AlertTriangle, Shield } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const SettingsTab: React.FC = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [notifications, setNotifications] = useState({
    statusChanges: true,
    errors: true,
    completions: true,
    dataValidation: true,
  });

  const handleToggleNotification = (key: string) => (checked: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: checked }));
  };

  const handleSaveNotifications = () => {
    toast.success("Notification settings saved");
  };

  return (
    <FadeIn>
      <GlassPanel className="mb-6">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Migration Settings</h2>
          <p className="text-muted-foreground mb-6">
            Configure preferences and options for your CRM migration.
          </p>
          
          <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general">
              <Card>
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                  <CardDescription>
                    Basic settings for this migration project
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted/30 rounded-lg p-6 text-center">
                    <Settings className="h-12 w-12 mx-auto mb-3 text-muted-foreground/70" />
                    <h3 className="text-lg font-medium">Settings Coming Soon</h3>
                    <p className="text-muted-foreground mt-2">
                      Advanced configuration options for your migration will be available in the next update.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Project Notifications</CardTitle>
                  <CardDescription>
                    Control what notifications you receive for this specific migration project
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-2">
                      <div className="flex items-center space-x-2">
                        <Zap className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <Label htmlFor="statusChanges" className="font-medium">Status Changes</Label>
                          <p className="text-sm text-muted-foreground">Notify when this project's status changes</p>
                        </div>
                      </div>
                      <Switch
                        id="statusChanges"
                        checked={notifications.statusChanges}
                        onCheckedChange={handleToggleNotification("statusChanges")}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between py-2">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <Label htmlFor="errors" className="font-medium">Errors & Warnings</Label>
                          <p className="text-sm text-muted-foreground">Notify about errors during this migration</p>
                        </div>
                      </div>
                      <Switch
                        id="errors"
                        checked={notifications.errors}
                        onCheckedChange={handleToggleNotification("errors")}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between py-2">
                      <div className="flex items-center space-x-2">
                        <Bell className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <Label htmlFor="completions" className="font-medium">Project Completion</Label>
                          <p className="text-sm text-muted-foreground">Notify when this project is completed</p>
                        </div>
                      </div>
                      <Switch
                        id="completions"
                        checked={notifications.completions}
                        onCheckedChange={handleToggleNotification("completions")}
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
                        checked={notifications.dataValidation}
                        onCheckedChange={handleToggleNotification("dataValidation")}
                      />
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-border">
                      <p className="text-sm text-muted-foreground mb-4">
                        These settings only affect notifications for this specific project. 
                        To manage your global notification preferences, visit the 
                        <Link to="/app/settings?tab=notifications" className="text-primary ml-1 hover:underline">
                          Account Settings
                        </Link>.
                      </p>
                      
                      <div className="flex justify-end">
                        <Button onClick={handleSaveNotifications}>
                          Save Notification Settings
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="advanced">
              <Card>
                <CardHeader>
                  <CardTitle>Advanced Settings</CardTitle>
                  <CardDescription>
                    Configure advanced options for this migration project
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted/30 rounded-lg p-6 text-center">
                    <Settings className="h-12 w-12 mx-auto mb-3 text-muted-foreground/70" />
                    <h3 className="text-lg font-medium">Advanced Settings Coming Soon</h3>
                    <p className="text-muted-foreground mt-2">
                      Additional configuration options will be available in the next update.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </GlassPanel>
    </FadeIn>
  );
};

export default SettingsTab;
