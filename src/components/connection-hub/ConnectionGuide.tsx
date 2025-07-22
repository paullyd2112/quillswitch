
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Info } from "lucide-react";

const ConnectionGuide: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Connection Guide</CardTitle>
          <CardDescription>
            Learn how to connect your systems to QuillSwitch
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview">
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="unified">Unified Integration</TabsTrigger>
              <TabsTrigger value="troubleshooting">Troubleshooting</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Getting Started</h3>
                <p className="text-muted-foreground">
                  The Connection Hub allows you to seamlessly connect your CRM systems and related applications 
                  to QuillSwitch. This guide will help you understand how to connect your systems and 
                  troubleshoot any issues that may arise.
                </p>
              </div>
              
              <div className="grid gap-4 mt-4">
                <div className="bg-muted/40 p-4 rounded-md border">
                  <h4 className="font-medium mb-2 flex items-center">
                    <Info className="h-4 w-4 mr-2 text-blue-500" />
                    Connection Types
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    QuillSwitch uses its native CRM engine to connect to 28+ CRM systems through direct, 
                    secure integrations. All connections use OAuth 2.0 for security and are managed automatically.
                  </p>
                </div>
                
                <div className="bg-muted/40 p-4 rounded-md border">
                  <h4 className="font-medium mb-2 flex items-center">
                    <Info className="h-4 w-4 mr-2 text-blue-500" />
                    Security
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Your connection credentials are encrypted and stored securely. QuillSwitch only requests the 
                    minimum permissions necessary to perform migrations and data synchronization.
                  </p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="unified" className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Native CRM Engine Connection Process</h3>
                <p className="text-muted-foreground">
                  Our native CRM engine provides secure direct connections to all CRM systems through OAuth 2.0 
                  authentication. Here's how it works:
                </p>
              </div>
              
              <div className="grid gap-4 mt-4">
                <div className="bg-muted/40 p-4 rounded-md border">
                  <h4 className="font-medium mb-2">Step 1: Select your CRM</h4>
                  <p className="text-sm text-muted-foreground">
                    Choose from 28+ supported CRM systems including Salesforce, HubSpot, Zoho, Pipedrive, 
                    and Microsoft Dynamics 365.
                  </p>
                </div>
                
                <div className="bg-muted/40 p-4 rounded-md border">
                  <h4 className="font-medium mb-2">Step 2: Secure authorization</h4>
                  <p className="text-sm text-muted-foreground">
                    You'll be redirected to your CRM's secure OAuth authorization page to grant QuillSwitch 
                    the necessary permissions for data access.
                  </p>
                </div>
                
                <div className="bg-muted/40 p-4 rounded-md border">
                  <h4 className="font-medium mb-2">Step 3: Automatic setup</h4>
                  <p className="text-sm text-muted-foreground">
                    Once authorized, the connection is established automatically and your CRM data becomes 
                    available for migration through our unified interface.
                  </p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="troubleshooting" className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Troubleshooting Connection Issues</h3>
                <p className="text-muted-foreground">
                  If you encounter any issues while connecting your systems, try these steps:
                </p>
              </div>
              
              <div className="grid gap-4 mt-4">
                <div className="bg-muted/40 p-4 rounded-md border">
                  <h4 className="font-medium mb-2">Permission Errors</h4>
                  <p className="text-sm text-muted-foreground">
                    If you receive a permission error, ensure your account has admin access in your CRM system. 
                    During the OAuth authorization process, make sure you approve all requested permissions.
                  </p>
                </div>
                
                <div className="bg-muted/40 p-4 rounded-md border">
                  <h4 className="font-medium mb-2">Connection Failures</h4>
                  <p className="text-sm text-muted-foreground">
                    If the connection process fails, try clearing your browser cache and ensure you're logged 
                    into your CRM system before attempting to connect.
                  </p>
                </div>
                
                <div className="bg-muted/40 p-4 rounded-md border">
                  <h4 className="font-medium mb-2">Connection Timeouts</h4>
                  <p className="text-sm text-muted-foreground">
                    If the connection times out, check your internet connection and try again. If the issue 
                    persists, contact our support team for assistance.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConnectionGuide;
