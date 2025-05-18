
import React from "react";
import BaseLayout from "@/components/layout/BaseLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, Key, Lock, ExternalLink } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const CRM_PROVIDERS = [
  {
    id: "salesforce",
    name: "Salesforce",
    description: "Connect your Salesforce account to import contacts, opportunities and more",
    authUrl: "/app/oauth/authorize/salesforce"
  },
  {
    id: "hubspot",
    name: "HubSpot",
    description: "Connect your HubSpot account to import contacts, deals and more",
    authUrl: "/app/oauth/authorize/hubspot"
  },
  {
    id: "zoho",
    name: "Zoho CRM",
    description: "Connect your Zoho CRM to import contacts, deals and more",
    authUrl: "/app/oauth/authorize/zoho"
  },
  {
    id: "pipedrive", 
    name: "Pipedrive",
    description: "Connect your Pipedrive account to import leads, deals and more",
    authUrl: "/app/oauth/authorize/pipedrive"
  }
];

const CrmConnections: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleConnect = (provider: string, authUrl: string) => {
    // In a real implementation, we would redirect to the authorization URL
    // For now, we'll simulate this with a toast message
    toast({
      title: `Connecting to ${provider}...`,
      description: "This would redirect to OAuth authorization page"
    });
    
    // This would normally be a window.location.href = authUrl
    // For demo purposes, simulate with a timeout and navigation
    setTimeout(() => {
      navigate("/app/oauth/callback", { 
        state: { 
          provider, 
          success: true,
          message: "Successfully connected (simulated)" 
        } 
      });
    }, 2000);
  };
  
  return (
    <BaseLayout>
      <div className="container px-4 py-8 max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">CRM Connections</h1>
          <p className="text-muted-foreground">
            Connect your CRM systems to enable data migration
          </p>
        </div>
        
        <Alert className="mb-6 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
          <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <AlertDescription className="text-blue-700 dark:text-blue-300">
            Connect your CRM platforms to start migrating data between them.
            Your credentials are securely encrypted and stored.
          </AlertDescription>
        </Alert>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {CRM_PROVIDERS.map((provider) => (
            <Card key={provider.id} className="transition-all hover:shadow-md">
              <CardHeader>
                <CardTitle>{provider.name}</CardTitle>
                <CardDescription>{provider.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Lock className="mr-1 h-3 w-3" />
                    <span>Uses OAuth</span>
                  </div>
                  <Button 
                    onClick={() => handleConnect(provider.name, provider.authUrl)}
                    className="gap-2"
                  >
                    <Key className="h-4 w-4" /> Connect
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Connected CRMs</CardTitle>
            <CardDescription>
              Manage your connected CRM accounts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-6 text-muted-foreground">
              No CRMs connected yet. Connect a CRM platform above to get started.
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end mt-4">
          <Button variant="outline" className="gap-2" asChild>
            <a href="https://docs.quillswitch.com/crm-integration" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
              Integration Documentation
            </a>
          </Button>
        </div>
      </div>
    </BaseLayout>
  );
};

export default CrmConnections;
