
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SecurityDashboard from '@/components/security/SecurityDashboard';
import SecurityMonitor from '@/components/security/SecurityMonitor';
import ComprehensiveSecurityAudit from '@/components/security/ComprehensiveSecurityAudit';
import CredentialSecurityInfo from '@/components/vault/CredentialSecurityInfo';
import CredentialMigrationHelper from '@/components/security/CredentialMigrationHelper';
import { Shield, Activity, FileSearch, Info, Upload } from 'lucide-react';

const Security = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Security Center</h1>
        <p className="text-muted-foreground">
          Comprehensive security monitoring and management for your QuillSwitch environment
        </p>
      </div>

      <Tabs defaultValue="audit" className="space-y-6">
        <TabsList>
          <TabsTrigger value="audit" className="flex items-center gap-2">
            <FileSearch className="h-4 w-4" />
            Security Audit
          </TabsTrigger>
          <TabsTrigger value="migration" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Credential Migration
          </TabsTrigger>
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

        <TabsContent value="audit" className="space-y-6">
          <ComprehensiveSecurityAudit />
        </TabsContent>

        <TabsContent value="migration" className="space-y-6">
          <CredentialMigrationHelper />
        </TabsContent>

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
