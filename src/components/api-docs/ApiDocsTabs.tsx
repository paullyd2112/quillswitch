
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OverviewTab from "./tabs/OverviewTab";
import AuthenticationTab from "./tabs/AuthenticationTab";
import ContactsTab from "./tabs/ContactsTab";
import AccountsTab from "./tabs/AccountsTab";
import OpportunitiesTab from "./tabs/OpportunitiesTab";
import ApiTestSection from "./ApiTestSection";

interface ApiDocsTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const ApiDocsTabs = ({ activeTab, onTabChange }: ApiDocsTabsProps) => {
  const handleValueChange = (value: string) => {
    onTabChange(value);
  };

  return (
    <Tabs value={activeTab} onValueChange={handleValueChange}>
      <TabsList className="hidden">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="authentication">Authentication</TabsTrigger>
        <TabsTrigger value="contacts">Contacts</TabsTrigger>
        <TabsTrigger value="accounts">Accounts</TabsTrigger>
        <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
        <TabsTrigger value="migration">Migration</TabsTrigger>
        <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
        <TabsTrigger value="api-test">Test API</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview" className="p-6">
        <OverviewTab />
      </TabsContent>
      
      <TabsContent value="authentication" className="p-6">
        <AuthenticationTab />
      </TabsContent>
      
      <TabsContent value="contacts" className="p-6">
        <ContactsTab />
      </TabsContent>
      
      <TabsContent value="accounts" className="p-6">
        <AccountsTab />
      </TabsContent>
      
      <TabsContent value="opportunities" className="p-6">
        <OpportunitiesTab />
      </TabsContent>
      
      {/* Placeholders for Migration and Webhooks tabs */}
      <TabsContent value="migration" className="p-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Migration API</h2>
            <p className="text-muted-foreground mb-4">
              The Migration API allows you to manage and monitor data migration processes.
            </p>
            <p className="text-muted-foreground">
              Documentation for this section is coming soon.
            </p>
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="webhooks" className="p-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Webhooks</h2>
            <p className="text-muted-foreground mb-4">
              Use webhooks to receive real-time notifications about events in your migrations.
            </p>
            <p className="text-muted-foreground">
              Documentation for this section is coming soon.
            </p>
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="api-test" className="p-6">
        <ApiTestSection />
      </TabsContent>
    </Tabs>
  );
};

export default ApiDocsTabs;
