import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  Users, 
  FileText, 
  Settings,
  AlertTriangle,
  CheckCircle,
  Clock,
  Lock,
  Unlock,
  UserCheck,
  Building,
  Scale,
  Eye,
  Download,
  RefreshCw
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth';
import { toast } from '@/hooks/use-toast';

interface GovernanceMetrics {
  totalUsers: number;
  adminUsers: number;
  activeProjects: number;
  complianceScore: number;
  lastAudit: string;
  policiesCompliant: number;
  totalPolicies: number;
}

interface ComplianceCheck {
  id: string;
  name: string;
  status: 'compliant' | 'non-compliant' | 'warning';
  description: string;
  lastChecked: string;
  details?: string;
}

interface UserRole {
  id: string;
  user_id: string;
  role: string;
  profile?: {
    first_name?: string;
    last_name?: string;
  };
  created_at: string;
}

interface PolicyDocument {
  id: string;
  title: string;
  version: string;
  status: 'active' | 'draft' | 'archived';
  created_at: string;
  updated_at: string;
  category: string;
}

const EnterpriseGovernance: React.FC = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<GovernanceMetrics | null>(null);
  const [complianceChecks, setComplianceChecks] = useState<ComplianceCheck[]>([]);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [policies, setPolicies] = useState<PolicyDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAdminStatus();
  }, [user]);

  useEffect(() => {
    if (isAdmin) {
      loadGovernanceData();
    }
  }, [isAdmin]);

  const checkAdminStatus = async () => {
    if (!user) return;
    
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      
      setIsAdmin(profile?.role === 'admin');
    } catch (error) {
      console.error('Error checking admin status:', error);
    }
  };

  const loadGovernanceData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        loadMetrics(),
        loadComplianceChecks(),
        loadUserRoles(),
        loadPolicies()
      ]);
    } catch (error) {
      console.error('Error loading governance data:', error);
      toast({
        title: "Error",
        description: "Failed to load governance data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadMetrics = async () => {
    // Load user counts
    const { data: profiles } = await supabase
      .from('profiles')
      .select('role');

    const totalUsers = profiles?.length || 0;
    const adminUsers = profiles?.filter(p => p.role === 'admin').length || 0;

    // Load project counts
    const { data: projects } = await supabase
      .from('migration_projects')
      .select('status');

    const activeProjects = projects?.filter(p => p.status === 'running' || p.status === 'pending').length || 0;

    setMetrics({
      totalUsers,
      adminUsers,
      activeProjects,
      complianceScore: 87,
      lastAudit: new Date().toISOString(),
      policiesCompliant: 8,
      totalPolicies: 10
    });
  };

  const loadComplianceChecks = async () => {
    // Mock compliance checks - in production, these would be real checks
    const checks: ComplianceCheck[] = [
      {
        id: '1',
        name: 'Data Encryption',
        status: 'compliant',
        description: 'All sensitive data is encrypted at rest and in transit',
        lastChecked: new Date().toISOString(),
        details: 'AES-256 encryption for stored credentials, TLS 1.3 for data in transit'
      },
      {
        id: '2',
        name: 'Access Control',
        status: 'compliant',
        description: 'Role-based access control is properly implemented',
        lastChecked: new Date().toISOString(),
        details: 'RBAC with admin, user, and viewer roles'
      },
      {
        id: '3',
        name: 'Audit Logging',
        status: 'compliant',
        description: 'All user actions are logged and monitored',
        lastChecked: new Date().toISOString(),
        details: 'Comprehensive audit trail with 90-day retention'
      },
      {
        id: '4',
        name: 'Data Retention',
        status: 'warning',
        description: 'Data retention policies need review',
        lastChecked: new Date().toISOString(),
        details: 'Some old migration data may exceed retention limits'
      },
      {
        id: '5',
        name: 'Backup Recovery',
        status: 'compliant',
        description: 'Regular backups and tested recovery procedures',
        lastChecked: new Date().toISOString(),
        details: 'Daily backups with monthly recovery tests'
      },
      {
        id: '6',
        name: 'GDPR Compliance',
        status: 'non-compliant',
        description: 'Privacy policy updates required',
        lastChecked: new Date().toISOString(),
        details: 'Recent GDPR updates not reflected in privacy policy'
      }
    ];

    setComplianceChecks(checks);
  };

  const loadUserRoles = async () => {
    // In a real implementation, this would join with profiles table
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, role, first_name, last_name, created_at');

    if (profiles) {
      const roles: UserRole[] = profiles.map(profile => ({
        id: profile.id,
        user_id: profile.id,
        role: profile.role || 'user',
        profile: {
          first_name: profile.first_name,
          last_name: profile.last_name
        },
        created_at: profile.created_at
      }));
      setUserRoles(roles);
    }
  };

  const loadPolicies = async () => {
    // Mock policy documents - in production, these would be stored in database
    const mockPolicies: PolicyDocument[] = [
      {
        id: '1',
        title: 'Data Privacy Policy',
        version: '2.1',
        status: 'active',
        created_at: '2024-01-15T00:00:00Z',
        updated_at: '2024-03-01T00:00:00Z',
        category: 'Privacy'
      },
      {
        id: '2',
        title: 'Security Standards',
        version: '1.5',
        status: 'active',
        created_at: '2024-01-10T00:00:00Z',
        updated_at: '2024-02-15T00:00:00Z',
        category: 'Security'
      },
      {
        id: '3',
        title: 'Access Control Policy',
        version: '1.3',
        status: 'active',
        created_at: '2024-01-05T00:00:00Z',
        updated_at: '2024-02-01T00:00:00Z',
        category: 'Access'
      },
      {
        id: '4',
        title: 'Data Retention Guidelines',
        version: '1.0',
        status: 'draft',
        created_at: '2024-03-01T00:00:00Z',
        updated_at: '2024-03-01T00:00:00Z',
        category: 'Compliance'
      }
    ];

    setPolicies(mockPolicies);
  };

  const updateUserRole = async (userId: string, newRole: 'user' | 'admin') => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "Role Updated",
        description: "User role has been updated successfully"
      });

      loadUserRoles(); // Refresh the list
    } catch (error) {
      console.error('Error updating user role:', error);
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive"
      });
    }
  };

  const exportComplianceReport = () => {
    const report = {
      generatedAt: new Date().toISOString(),
      metrics,
      complianceChecks,
      userRoles: userRoles.length,
      policies: policies.length,
      summary: {
        overallScore: metrics?.complianceScore || 0,
        criticalIssues: complianceChecks.filter(c => c.status === 'non-compliant').length,
        warnings: complianceChecks.filter(c => c.status === 'warning').length
      }
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `compliance-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Report Exported",
      description: "Compliance report has been exported successfully"
    });
  };

  if (!isAdmin) {
    return (
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          You don't have permission to view enterprise governance. Admin access is required.
        </AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-6 w-6 animate-spin" />
          <span>Loading governance data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Enterprise Governance</h1>
          <p className="text-muted-foreground">
            Manage compliance, policies, and access control across your organization
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={exportComplianceReport}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button variant="outline" size="sm" onClick={loadGovernanceData} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Compliance Score</p>
                <p className="text-2xl font-bold">{metrics?.complianceScore || 0}%</p>
                <Progress value={metrics?.complianceScore || 0} className="mt-2 h-2" />
              </div>
              <Scale className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{metrics?.totalUsers || 0}</p>
                <p className="text-xs text-muted-foreground">{metrics?.adminUsers || 0} admins</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Projects</p>
                <p className="text-2xl font-bold">{metrics?.activeProjects || 0}</p>
                <p className="text-xs text-green-600">Currently managed</p>
              </div>
              <Building className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Policy Compliance</p>
                <p className="text-2xl font-bold">{metrics?.policiesCompliant || 0}/{metrics?.totalPolicies || 0}</p>
                <p className="text-xs text-muted-foreground">Policies up to date</p>
              </div>
              <FileText className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Governance Tabs */}
      <Tabs defaultValue="compliance" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="policies">Policies</TabsTrigger>
          <TabsTrigger value="audit">Audit Trail</TabsTrigger>
        </TabsList>

        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {complianceChecks.map((check) => (
                  <div key={check.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-start space-x-3">
                      {check.status === 'compliant' ? (
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      ) : check.status === 'warning' ? (
                        <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium">{check.name}</h4>
                          <Badge variant={
                            check.status === 'compliant' ? 'default' :
                            check.status === 'warning' ? 'secondary' :
                            'destructive'
                          }>
                            {check.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {check.description}
                        </p>
                        {check.details && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {check.details}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">
                        Last checked: {new Date(check.lastChecked).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Compliance Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {complianceChecks.filter(c => c.status !== 'compliant').map((check) => (
                  <Alert key={check.id}>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>{check.name}:</strong> {check.description}
                      {check.details && (
                        <div className="mt-1 text-sm">
                          Details: {check.details}
                        </div>
                      )}
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Roles & Permissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userRoles.map((userRole) => (
                  <div key={userRole.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <UserCheck className="h-5 w-5 text-blue-500" />
                      <div>
                        <h4 className="font-medium">
                          {userRole.profile?.first_name} {userRole.profile?.last_name} 
                          {!userRole.profile?.first_name && !userRole.profile?.last_name && 'Unnamed User'}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Joined: {new Date(userRole.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={userRole.role === 'admin' ? 'default' : 'outline'}>
                        {userRole.role}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newRole: 'user' | 'admin' = userRole.role === 'admin' ? 'user' : 'admin';
                          updateUserRole(userRole.user_id, newRole);
                        }}
                      >
                        {userRole.role === 'admin' ? (
                          <Unlock className="h-4 w-4" />
                        ) : (
                          <Lock className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="policies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Policy Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {policies.map((policy) => (
                  <div key={policy.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-blue-500" />
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium">{policy.title}</h4>
                          <Badge variant="outline">v{policy.version}</Badge>
                          <Badge variant={
                            policy.status === 'active' ? 'default' :
                            policy.status === 'draft' ? 'secondary' :
                            'outline'
                          }>
                            {policy.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Category: {policy.category} • Updated: {new Date(policy.updated_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Audit Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <Clock className="h-4 w-4" />
                  <AlertDescription>
                    Audit trail shows the last 50 administrative actions. Full audit logs are retained for 90 days.
                  </AlertDescription>
                </Alert>
                
                <div className="space-y-2">
                  {[
                    { action: 'User role updated', user: 'admin@company.com', timestamp: new Date().toISOString(), details: 'Changed user role from user to admin' },
                    { action: 'Policy updated', user: 'admin@company.com', timestamp: new Date(Date.now() - 3600000).toISOString(), details: 'Updated Data Privacy Policy v2.1' },
                    { action: 'Compliance check run', user: 'system', timestamp: new Date(Date.now() - 7200000).toISOString(), details: 'Automated compliance check completed' },
                    { action: 'User created', user: 'admin@company.com', timestamp: new Date(Date.now() - 86400000).toISOString(), details: 'New user account created' }
                  ].map((event, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="h-2 w-2 bg-primary rounded-full"></div>
                        <div>
                          <p className="font-medium text-sm">{event.action}</p>
                          <p className="text-xs text-muted-foreground">{event.details}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">By: {event.user}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(event.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnterpriseGovernance;