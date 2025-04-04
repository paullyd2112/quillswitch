
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import ContentSection from "@/components/layout/ContentSection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileSettings from "@/components/settings/ProfileSettings";
import SecuritySettings from "@/components/settings/SecuritySettings";
import NotificationSettings from "@/components/settings/NotificationSettings";
import BillingSettings from "@/components/settings/BillingSettings";
import ProjectSettings from "@/components/settings/ProjectSettings";
import DataPrivacySettings from "@/components/settings/DataPrivacySettings";
import ApiKeySettings from "@/components/settings/ApiKeySettings";

const Settings = () => {
  const [searchParams] = useSearchParams();
  const tabFromUrl = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState<string>("profile");
  
  useEffect(() => {
    // Map URL parameters to tab values
    const validTabs = ["profile", "security", "notifications", "billing", "projects", "api-keys", "data-privacy"];
    if (tabFromUrl && validTabs.includes(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);

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
              <TabsList className="mb-8 grid w-full grid-cols-7 lg:grid-cols-7 md:grid-cols-4 sm:grid-cols-2">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="billing">Billing</TabsTrigger>
                <TabsTrigger value="projects">Projects</TabsTrigger>
                <TabsTrigger value="api-keys">API Keys</TabsTrigger>
                <TabsTrigger value="data-privacy">Data & Privacy</TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile" className="space-y-4">
                <ProfileSettings />
              </TabsContent>
              
              <TabsContent value="security" className="space-y-4">
                <SecuritySettings />
              </TabsContent>
              
              <TabsContent value="notifications" className="space-y-4">
                <NotificationSettings />
              </TabsContent>
              
              <TabsContent value="billing" className="space-y-4">
                <BillingSettings />
              </TabsContent>
              
              <TabsContent value="projects" className="space-y-4">
                <ProjectSettings />
              </TabsContent>
              
              <TabsContent value="api-keys" className="space-y-4">
                <ApiKeySettings />
              </TabsContent>
              
              <TabsContent value="data-privacy" className="space-y-4">
                <DataPrivacySettings />
              </TabsContent>
            </Tabs>
          </div>
        </ContentSection>
      </div>
    </div>
  );
};

export default Settings;
