
import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import ContentSection from "@/components/layout/ContentSection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileSettings from "@/components/settings/ProfileSettings";
import UserManagementSettings from "@/components/settings/UserManagementSettings";
import NotificationSettings from "@/components/settings/NotificationSettings";
import BillingSettings from "@/components/settings/BillingSettings";
import SecuritySettings from "@/components/settings/SecuritySettings";

const Settings = () => {
  const [activeTab, setActiveTab] = useState<string>("profile");
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        <ContentSection 
          title="Settings"
          description="Manage your account preferences and configurations."
          centered={false}
        >
          <div className="grid grid-cols-1 gap-6 mt-6">
            <Tabs 
              defaultValue="profile" 
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="mb-8 grid w-full grid-cols-5">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="user-management">User Management</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="billing">Billing</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile" className="space-y-4">
                <ProfileSettings />
              </TabsContent>
              
              <TabsContent value="user-management" className="space-y-4">
                <UserManagementSettings />
              </TabsContent>
              
              <TabsContent value="notifications" className="space-y-4">
                <NotificationSettings />
              </TabsContent>
              
              <TabsContent value="billing" className="space-y-4">
                <BillingSettings />
              </TabsContent>
              
              <TabsContent value="security" className="space-y-4">
                <SecuritySettings />
              </TabsContent>
            </Tabs>
          </div>
        </ContentSection>
      </div>
    </div>
  );
};

export default Settings;
