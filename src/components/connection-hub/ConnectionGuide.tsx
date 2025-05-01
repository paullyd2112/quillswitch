
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
              <TabsTrigger value="oauth">OAuth Connections</TabsTrigger>
              <TabsTrigger value="api">API Keys</TabsTrigger>
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
                    QuillSwitch supports two types of connections: OAuth and API Key. OAuth is the recommended 
                    method as it's more secure and doesn't require you to manage API keys.
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
            
            <TabsContent value="oauth" className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">OAuth Connection Process</h3>
                <p className="text-muted-foreground">
                  OAuth connections allow you to connect your systems without sharing your password or API keys 
                  with QuillSwitch. Here's how it works:
                </p>
              </div>
              
              <div className="grid gap-4 mt-4">
                <div className="bg-muted/40 p-4 rounded-md border">
                  <h4 className="font-medium mb-2">Step 1: Initiate the connection</h4>
                  <p className="text-sm text-muted-foreground">
                    Click the "Connect" button on the system you want to connect to. You'll see a modal with 
                    information about what permissions QuillSwitch will request.
                  </p>
                </div>
                
                <div className="bg-muted/40 p-4 rounded-md border">
                  <h4 className="font-medium mb-2">Step 2: Authorize QuillSwitch</h4>
                  <p className="text-sm text-muted-foreground">
                    You'll be redirected to the system's authorization page where you can review and approve 
                    the requested permissions. Make sure you're logged in to your account.
                  </p>
                </div>
                
                <div className="bg-muted/40 p-4 rounded-md border">
                  <h4 className="font-medium mb-2">Step 3: Return to QuillSwitch</h4>
                  <p className="text-sm text-muted-foreground">
                    After authorizing, you'll be redirected back to QuillSwitch and your connection will 
                    be established automatically. You're now ready to start using the system.
                  </p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="api" className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Using API Keys</h3>
                <p className="text-muted-foreground">
                  For systems that don't support OAuth or when you prefer using API keys, follow these steps:
                </p>
              </div>
              
              <div className="grid gap-4 mt-4">
                <div className="bg-muted/40 p-4 rounded-md border">
                  <h4 className="font-medium mb-2">Step 1: Generate an API key</h4>
                  <p className="text-sm text-muted-foreground">
                    Log in to your system's admin panel and navigate to the API or Developer settings. Generate a 
                    new API key with the necessary permissions for QuillSwitch.
                  </p>
                </div>
                
                <div className="bg-muted/40 p-4 rounded-md border">
                  <h4 className="font-medium mb-2">Step 2: Enter your API key</h4>
                  <p className="text-sm text-muted-foreground">
                    Click the "Connect" button on the system you want to connect and enter your API key in the 
                    provided field. QuillSwitch will validate your key before establishing the connection.
                  </p>
                </div>
                
                <div className="bg-muted/40 p-4 rounded-md border">
                  <h4 className="font-medium mb-2">Step 3: Verify permissions</h4>
                  <p className="text-sm text-muted-foreground">
                    If your connection fails due to permission issues, make sure your API key has all the 
                    required permissions. Check the system-specific documentation for details.
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
                    If you receive a permission error, ensure your account has admin access or that your API key 
                    has the necessary permissions. For OAuth connections, make sure you approved all requested 
                    permissions.
                  </p>
                </div>
                
                <div className="bg-muted/40 p-4 rounded-md border">
                  <h4 className="font-medium mb-2">Invalid API Keys</h4>
                  <p className="text-sm text-muted-foreground">
                    Make sure you're using a valid API key and not a personal access token or other credential. 
                    Try generating a new API key if you continue to have issues.
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
