
import React from "react";
import Navbar from "@/components/layout/Navbar";
import ContentSection from "@/components/layout/ContentSection";
import { Card, CardContent } from "@/components/ui/card";
import { UserCog, CreditCard, BellRing, Shield, Users } from "lucide-react";

const Settings = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        <ContentSection 
          title="Settings"
          description="Manage your account preferences and configurations."
          centered
        >
          <div className="grid gap-8 mt-10">
            <Card className="border border-border shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <UserCog className="h-5 w-5 text-brand-500" />
                  Account Settings
                </h3>
                <p className="text-muted-foreground">
                  Update your profile information, change your password, and manage 
                  your personal preferences for the QuillSwitch platform.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-border shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Users className="h-5 w-5 text-brand-500" />
                  User Management
                </h3>
                <p className="text-muted-foreground">
                  Add team members, assign roles and permissions, and control who has
                  access to your organization's migration projects.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border border-border shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <BellRing className="h-5 w-5 text-brand-500" />
                  Notification Settings
                </h3>
                <p className="text-muted-foreground">
                  Configure alerts, updates, and notification preferences to stay informed
                  about important events related to your migration projects.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border border-border shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-brand-500" />
                  Billing
                </h3>
                <p className="text-muted-foreground">
                  Manage your subscription, view payment history, update payment methods,
                  and download invoices for your QuillSwitch account.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-border shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-brand-500" />
                  Security Settings
                </h3>
                <p className="text-muted-foreground">
                  Configure security options like two-factor authentication, session management,
                  and API access to protect your account and data.
                </p>
              </CardContent>
            </Card>
          </div>
        </ContentSection>
      </div>
    </div>
  );
};

export default Settings;
