
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BaseLayout from '@/components/layout/BaseLayout';
import SecurityDashboard from '@/components/security/SecurityDashboard';
import SecurityMonitor from '@/components/security/SecurityMonitor';
import CredentialSecurityInfo from '@/components/vault/CredentialSecurityInfo';
import { Shield, Activity, Info } from 'lucide-react';

const Security = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Security Center</h1>
        <p className="text-muted-foreground">
          Comprehensive security monitoring and management for your QuillSwitch environment
        </p>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList>
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="monitor" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Monitor
          </TabsTrigger>
          <TabsTrigger value="info" className="flex items-center gap-2">
            <Info className="h-4 w-4" />
            Security Info
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <SecurityDashboard />
        </TabsContent>

        <TabsContent value="monitor" className="space-y-6">
          <SecurityMonitor />
        </TabsContent>

        <TabsContent value="info" className="space-y-6">
          <CredentialSecurityInfo />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Security;
