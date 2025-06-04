
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Key, 
  Users, 
  Activity,
  RefreshCw,
  TrendingUp,
  Database
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import SystemHealthMetrics from './SystemHealthMetrics';

interface SecurityMetrics {
  total_credentials: number;
  expired_credentials: number;
  expiring_soon: number;
  last_rotation_days: number;
}

interface ExpiringCredential {
  id: string;
  service_name: string;
  credential_name: string;
  expires_at: string;
  days_until_expiry: number;
}

const SecurityDashboard = () => {
  const [metrics, setMetrics] = useState<SecurityMetrics | null>(null);
  const [expiringCredentials, setExpiringCredentials] = useState<ExpiringCredential[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const loadSecurityData = async () => {
    try {
      setIsLoading(true);

      // Load security metrics
      const { data: metricsData, error: metricsError } = await supabase
        .rpc('get_credential_security_metrics');

      if (metricsError) throw metricsError;
      if (metricsData && metricsData.length > 0) {
        setMetrics(metricsData[0]);
      }

      // Load expiring credentials
      const { data: expiringData, error: expiringError } = await supabase
        .rpc('get_expiring_credentials', { days_ahead: 30 });

      if (expiringError) throw expiringError;
      setExpiringCredentials(expiringData || []);

      setLastRefresh(new Date());
    } catch (error) {
      console.error('Error loading security data:', error);
      toast.error('Failed to load security metrics');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSecurityData();
  }, []);

  const getSecurityScore = (): number => {
    if (!metrics) return 0;
    
    let score = 100;
    
    // Deduct points for expired credentials
    if (metrics.expired_credentials > 0) {
      score -= Math.min(30, metrics.expired_credentials * 10);
    }
    
    // Deduct points for credentials expiring soon
    if (metrics.expiring_soon > 0) {
      score -= Math.min(20, metrics.expiring_soon * 5);
    }
    
    // Deduct points for old credentials (not rotated recently)
    if (metrics.last_rotation_days > 90) {
      score -= 15;
    } else if (metrics.last_rotation_days > 60) {
      score -= 10;
    }
    
    return Math.max(0, score);
  };

  const getScoreColor = (score: number): string => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreDescription = (score: number): string => {
    if (score >= 90) return 'Excellent security posture';
    if (score >= 70) return 'Good security with room for improvement';
    if (score >= 50) return 'Moderate security risks detected';
    return 'Critical security issues need attention';
  };

  const securityScore = getSecurityScore();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Security Dashboard</h2>
          <p className="text-muted-foreground">
            Monitor and manage your application's security posture
          </p>
        </div>
        <Button onClick={loadSecurityData} disabled={isLoading} variant="outline">
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Security Overview</TabsTrigger>
          <TabsTrigger value="system">System Health</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Security Score */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Score
              </CardTitle>
              <CardDescription>
                Overall security health based on credential management and policies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className={`text-3xl font-bold ${getScoreColor(securityScore)}`}>
                      {securityScore}/100
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {getScoreDescription(securityScore)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Last updated</p>
                    <p className="text-sm font-medium">
                      {lastRefresh.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <Progress value={securityScore} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Security Metrics Grid */}
          {metrics && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Key className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">Total Credentials</span>
                  </div>
                  <div className="text-2xl font-bold mt-2">{metrics.total_credentials}</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <span className="text-sm font-medium">Expired</span>
                  </div>
                  <div className="text-2xl font-bold mt-2 text-red-600">
                    {metrics.expired_credentials}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm font-medium">Expiring Soon</span>
                  </div>
                  <div className="text-2xl font-bold mt-2 text-yellow-600">
                    {metrics.expiring_soon}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium">Days Since Rotation</span>
                  </div>
                  <div className="text-2xl font-bold mt-2">{metrics.last_rotation_days}</div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Security Alerts */}
          <div className="space-y-4">
            {metrics?.expired_credentials > 0 && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  You have {metrics.expired_credentials} expired credential{metrics.expired_credentials !== 1 ? 's' : ''}. 
                  These should be renewed immediately to maintain security.
                </AlertDescription>
              </Alert>
            )}

            {metrics?.expiring_soon > 0 && (
              <Alert>
                <Clock className="h-4 w-4" />
                <AlertDescription>
                  {metrics.expiring_soon} credential{metrics.expiring_soon !== 1 ? 's' : ''} will expire within 30 days. 
                  Consider renewing them proactively.
                </AlertDescription>
              </Alert>
            )}

            {metrics?.last_rotation_days > 90 && (
              <Alert>
                <RefreshCw className="h-4 w-4" />
                <AlertDescription>
                  Some credentials haven't been rotated in over 90 days. 
                  Regular rotation is recommended for optimal security.
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Expiring Credentials */}
          {expiringCredentials.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-yellow-600" />
                  Credentials Expiring Soon
                </CardTitle>
                <CardDescription>
                  Credentials that will expire within the next 30 days
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {expiringCredentials.map((credential) => (
                    <div key={credential.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">
                          {credential.service_name}: {credential.credential_name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Expires on {new Date(credential.expires_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant={credential.days_until_expiry <= 7 ? "destructive" : "secondary"}>
                        {credential.days_until_expiry} day{credential.days_until_expiry !== 1 ? 's' : ''} left
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Security Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Security Recommendations
              </CardTitle>
              <CardDescription>
                Actions to improve your security posture
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-1" />
                  <div>
                    <p className="font-medium">Enable Two-Factor Authentication</p>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-1" />
                  <div>
                    <p className="font-medium">Regular Credential Rotation</p>
                    <p className="text-sm text-muted-foreground">
                      Rotate API keys and credentials every 30-90 days
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-1" />
                  <div>
                    <p className="font-medium">Monitor Access Logs</p>
                    <p className="text-sm text-muted-foreground">
                      Regularly review credential access patterns for anomalies
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-1" />
                  <div>
                    <p className="font-medium">Use Environment-Specific Credentials</p>
                    <p className="text-sm text-muted-foreground">
                      Separate credentials for development, staging, and production
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system">
          <SystemHealthMetrics />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SecurityDashboard;
