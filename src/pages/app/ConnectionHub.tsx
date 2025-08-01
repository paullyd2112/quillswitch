
import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Plus, Shield, Zap, CheckCircle } from "lucide-react";
import EnhancedContentSection from "@/components/layout/enhanced-content-section";
import { EnhancedCard, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/enhanced-card";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/ui/status-badge";
import { supabase } from "@/integrations/supabase/client";
import { useSessionContext } from '@supabase/auth-helpers-react';
import salesforceLogo from "@/assets/salesforce-logo.png";
import hubspotLogo from "@/assets/hubspot-logo.png";
import pipedriveLogo from "@/assets/pipedrive-official-logo.svg";
import microsoftDynamicsLogo from "@/assets/microsoft-dynamics-logo.svg";
import zohoLogo from "@/assets/zoho-official-logo.svg";
import freshsalesLogo from "@/assets/freshsales-logo.svg";

const ConnectionHub = () => {
  const { session } = useSessionContext();
  const [connectedSystems, setConnectedSystems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user) {
      fetchConnectedSystems();
    }
  }, [session]);

  const fetchConnectedSystems = async () => {
    try {
      const { data, error } = await supabase
        .from('service_credentials')
        .select('*')
        .eq('user_id', session?.user?.id);

      if (error) {
        console.error('Error fetching connections:', error);
        return;
      }

      // Transform database data to display format
      const systems = data?.map(credential => ({
        id: credential.id,
        name: credential.service_name,
        type: "CRM",
        status: credential.expires_at && new Date(credential.expires_at) < new Date() ? 'expired' : 'active',
        lastSync: credential.last_used ? `${Math.floor((Date.now() - new Date(credential.last_used).getTime()) / (1000 * 60))} minutes ago` : 'Never',
        recordCount: "Unknown", // We don't store this info yet
        logo: getSystemLogo(credential.service_name),
        credential_name: credential.credential_name
      })) || [];

      setConnectedSystems(systems);
    } catch (error) {
      console.error('Error fetching connections:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSystemLogo = (serviceName: string): string | React.ReactElement => {
    const logoMap: Record<string, string> = {
      'salesforce': salesforceLogo,
      'hubspot': hubspotLogo,
      'pipedrive': pipedriveLogo,
      'microsoft_dynamics': microsoftDynamicsLogo,
      'zoho': zohoLogo,
      'freshsales': freshsalesLogo
    };
    return logoMap[serviceName.toLowerCase()] || '🔗';
  };

  const availableSystems = [
    { name: "Salesforce", type: "CRM", logo: salesforceLogo, popular: true },
    { name: "HubSpot", type: "CRM", logo: hubspotLogo, popular: true },
    { name: "Pipedrive", type: "CRM", logo: pipedriveLogo, popular: true },
    { name: "Microsoft Dynamics", type: "CRM", logo: microsoftDynamicsLogo, popular: true },
    { name: "Zoho CRM", type: "CRM", logo: zohoLogo, popular: false },
    { name: "Freshsales", type: "CRM", logo: freshsalesLogo, popular: false },
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
              {connectedSystems.length > 0 && (
                <StatusBadge status="success">
                  {connectedSystems.filter(s => s.status === 'active').length} Active
                </StatusBadge>
              )}
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-muted-foreground mt-2">Loading connections...</p>
              </div>
            ) : connectedSystems.length === 0 ? (
              <EnhancedCard variant="glass" className="text-center py-12">
                <CardContent>
                  <div className="text-6xl mb-4">🔗</div>
                  <h3 className="text-xl font-semibold mb-2">No Connections Yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Connect your first CRM system to get started with data migration.
                  </p>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Connection
                  </Button>
                </CardContent>
              </EnhancedCard>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {connectedSystems.map((system) => (
                  <EnhancedCard key={system.id} variant="elevated" className="overflow-hidden">
                    <CardContent className="p-6">
                      {/* Status Badge */}
                      <div className="flex justify-end mb-4">
                        <StatusBadge 
                          status={system.status === 'active' ? 'success' : system.status === 'expired' ? 'error' : 'pending'}
                          size="sm"
                        >
                          {system.status}
                        </StatusBadge>
                      </div>
                      
                      {/* Logo Centerpiece */}
                      <div className="flex flex-col items-center text-center mb-6">
                        <div className="w-24 h-24 flex items-center justify-center mb-4 bg-background/50 rounded-2xl p-4">
                          {typeof system.logo === 'string' && system.logo.startsWith('/') ? (
                            <img src={system.logo} alt={system.name} className="w-full h-full object-contain" />
                          ) : typeof system.logo === 'string' && !system.logo.includes('.') ? (
                            <div className="text-4xl">{system.logo}</div>
                          ) : (
                            <img src={system.logo as string} alt={system.name} className="w-full h-full object-contain" />
                          )}
                        </div>
                        <CardTitle className="text-xl mb-1">{system.name}</CardTitle>
                        <CardDescription className="text-sm">{system.credential_name || system.type}</CardDescription>
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-muted/30 rounded-lg">
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground mb-1">Records</p>
                          <p className="font-semibold text-sm">{system.recordCount}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground mb-1">Last Sync</p>
                          <p className="font-semibold text-sm">{system.lastSync}</p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
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
            )}
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
                  className="relative overflow-hidden group cursor-pointer hover:border-primary/30 transition-all duration-300"
                >
                  {system.popular && (
                    <div className="absolute top-4 right-4 z-10">
                      <StatusBadge status="warning" size="sm">Popular</StatusBadge>
                    </div>
                  )}
                  
                  <CardContent className="p-6">
                    {/* Logo Centerpiece */}
                    <div className="flex flex-col items-center text-center mb-6">
                      <div className="w-20 h-20 flex items-center justify-center mb-4 bg-background/30 rounded-xl p-4 group-hover:bg-background/50 transition-colors">
                        {typeof system.logo === 'string' && system.logo.startsWith('/') ? (
                          <img src={system.logo} alt={system.name} className="w-full h-full object-contain" />
                        ) : typeof system.logo === 'string' && !system.logo.includes('.') ? (
                          <div className="text-3xl">{system.logo}</div>
                        ) : (
                          <img src={system.logo as string} alt={system.name} className="w-full h-full object-contain" />
                        )}
                      </div>
                      <CardTitle className="text-lg mb-1 group-hover:text-primary transition-colors">{system.name}</CardTitle>
                      <CardDescription className="text-sm">{system.type}</CardDescription>
                    </div>

                    {/* Connect Button */}
                    <Button 
                      className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"
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
