
import React from "react";
import { Helmet } from "react-helmet";
import { Plus, Shield, Zap, CheckCircle } from "lucide-react";
import EnhancedContentSection from "@/components/layout/enhanced-content-section";
import { EnhancedCard, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/enhanced-card";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/ui/status-badge";

const ConnectionHub = () => {
  const connectedSystems = [
    {
      id: "1",
      name: "Salesforce",
      type: "CRM",
      status: "active",
      lastSync: "2 minutes ago",
      recordCount: "15,432",
      logo: "🌟"
    },
    {
      id: "2", 
      name: "HubSpot",
      type: "CRM",
      status: "active",
      lastSync: "5 minutes ago", 
      recordCount: "8,291",
      logo: "🧡"
    },
    {
      id: "3",
      name: "Pipedrive",
      type: "CRM", 
      status: "pending",
      lastSync: "Never",
      recordCount: "0",
      logo: "💚"
    }
  ];

  const availableSystems = [
    { name: "Microsoft Dynamics", type: "CRM", logo: "🔷", popular: true },
    { name: "Zoho CRM", type: "CRM", logo: "🟠", popular: false },
    { name: "Freshsales", type: "CRM", logo: "🌿", popular: false },
    { name: "Monday.com", type: "Project Management", logo: "🎨", popular: true },
    { name: "Airtable", type: "Database", logo: "📊", popular: false },
    { name: "Notion", type: "Workspace", logo: "🗂️", popular: true }
  ];

  return (
    <>
      <Helmet>
        <title>Connection Hub | QuillSwitch</title>
        <meta name="description" content="Manage your CRM and business tool connections" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <EnhancedContentSection
          title="Connection Hub"
          description="Connect and manage your CRM systems and business tools in one secure location"
          maxWidth="full"
          headerAction={
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Connection
            </Button>
          }
        >
          {/* Security Info Banner */}
          <div className="mb-8">
            <EnhancedCard variant="glass" className="border-l-4 border-l-primary">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Shield className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold mb-2">Enterprise-Grade Security</h3>
                    <p className="text-muted-foreground text-sm mb-3">
                      All connections use OAuth 2.0 authentication and are encrypted at rest. 
                      Your credentials are never stored in plain text.
                    </p>
                    <div className="flex gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        SOC 2 Compliant
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        GDPR Ready
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        256-bit Encryption
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </EnhancedCard>
          </div>

          {/* Connected Systems */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Connected Systems</h2>
              <StatusBadge status="success">
                {connectedSystems.filter(s => s.status === 'active').length} Active
              </StatusBadge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {connectedSystems.map((system) => (
                <EnhancedCard key={system.id} variant="elevated" className="overflow-hidden">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{system.logo}</div>
                        <div>
                          <CardTitle className="text-lg">{system.name}</CardTitle>
                          <CardDescription>{system.type}</CardDescription>
                        </div>
                      </div>
                      <StatusBadge 
                        status={system.status === 'active' ? 'success' : 'pending'}
                        size="sm"
                      >
                        {system.status}
                      </StatusBadge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Records</p>
                        <p className="font-semibold">{system.recordCount}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Last Sync</p>
                        <p className="font-semibold">{system.lastSync}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        Configure
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Zap className="h-3 w-3 mr-1" />
                        Test
                      </Button>
                    </div>
                  </CardContent>
                </EnhancedCard>
              ))}
            </div>
          </div>

          {/* Available Connections */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Available Connections</h2>
              <Button variant="outline">View All Integrations</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableSystems.map((system, index) => (
                <EnhancedCard 
                  key={index} 
                  variant="glass" 
                  className="relative overflow-hidden group cursor-pointer"
                >
                  {system.popular && (
                    <div className="absolute top-3 right-3">
                      <StatusBadge status="warning" size="sm">Popular</StatusBadge>
                    </div>
                  )}
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{system.logo}</div>
                      <div>
                        <CardTitle className="text-lg">{system.name}</CardTitle>
                        <CardDescription>{system.type}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                      variant="outline"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Connect
                    </Button>
                  </CardContent>
                </EnhancedCard>
              ))}
            </div>
          </div>
        </EnhancedContentSection>
      </div>
    </>
  );
};

export default ConnectionHub;
