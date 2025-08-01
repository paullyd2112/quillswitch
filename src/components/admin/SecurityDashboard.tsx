import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  AlertTriangle, 
  Clock, 
  Users, 
  Activity,
  RefreshCw,
  TrendingUp,
  TrendingDown 
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth';
import { toast } from '@/hooks/use-toast';

interface LoginAttempt {
  id: string;
  email: string;
  ip_address: string | null;
  attempted_at: string;
  success: boolean;
  user_agent: string | null;
}

interface SecurityMetric {
  total_attempts: number;
  failed_attempts: number;
  unique_users: number;
  locked_accounts: number;
}

export function SecurityDashboard() {
  const { user } = useAuth();
  const [loginAttempts, setLoginAttempts] = useState<LoginAttempt[]>([]);
  const [metrics, setMetrics] = useState<SecurityMetric | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Check if user is admin
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAdminStatus();
  }, [user]);

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
      setIsAdmin(false);
    }
  };

  const fetchSecurityData = async () => {
    if (!isAdmin) return;
    
    setIsLoading(true);
    try {
      // Fetch recent login attempts (last 24 hours)
      const { data: attempts, error: attemptsError } = await supabase
        .from('login_attempts')
        .select('*')
        .gte('attempted_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .order('attempted_at', { ascending: false })
        .limit(50);

      if (attemptsError) throw attemptsError;
      setLoginAttempts((attempts || []) as LoginAttempt[]);

      // Calculate metrics
      const totalAttempts = attempts?.length || 0;
      const failedAttempts = attempts?.filter(a => !a.success).length || 0;
      const uniqueEmails = new Set(attempts?.map(a => a.email)).size;
      
      // Check for locked accounts (5+ failures in 15 minutes)
      const recentFailures = attempts?.filter(a => 
        !a.success && 
        new Date(a.attempted_at) > new Date(Date.now() - 15 * 60 * 1000)
      ) || [];
      
      const failuresByEmail = recentFailures.reduce((acc, attempt) => {
        acc[attempt.email] = (acc[attempt.email] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const lockedAccounts = Object.values(failuresByEmail).filter(count => count >= 5).length;

      setMetrics({
        total_attempts: totalAttempts,
        failed_attempts: failedAttempts,
        unique_users: uniqueEmails,
        locked_accounts: lockedAccounts
      });

      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching security data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch security data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchSecurityData();
      // Set up auto-refresh every 30 seconds
      const interval = setInterval(fetchSecurityData, 30000);
      return () => clearInterval(interval);
    }
  }, [isAdmin]);

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const getFailureRate = () => {
    if (!metrics || metrics.total_attempts === 0) return 0;
    return Math.round((metrics.failed_attempts / metrics.total_attempts) * 100);
  };

  if (!isAdmin) {
    return (
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          You don't have permission to view the security dashboard. Admin access is required.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Security Dashboard</h1>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchSecurityData}
            disabled={isLoading}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Security Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Attempts (24h)</p>
                <p className="text-2xl font-bold">{metrics?.total_attempts || 0}</p>
              </div>
              <Activity className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Failed Attempts</p>
                <p className="text-2xl font-bold text-red-500">{metrics?.failed_attempts || 0}</p>
                <p className="text-xs text-muted-foreground">{getFailureRate()}% failure rate</p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Unique Users</p>
                <p className="text-2xl font-bold">{metrics?.unique_users || 0}</p>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Locked Accounts</p>
                <p className="text-2xl font-bold text-orange-500">{metrics?.locked_accounts || 0}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Views */}
      <Tabs defaultValue="attempts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="attempts">Recent Login Attempts</TabsTrigger>
          <TabsTrigger value="security">Security Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="attempts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Login Attempts (Last 24 Hours)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {isLoading ? (
                  <p className="text-center text-muted-foreground py-4">Loading...</p>
                ) : loginAttempts.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">No login attempts in the last 24 hours</p>
                ) : (
                  loginAttempts.map((attempt) => (
                    <div 
                      key={attempt.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{attempt.email}</span>
                          <Badge variant={attempt.success ? "default" : "destructive"}>
                            {attempt.success ? "Success" : "Failed"}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          IP: {attempt.ip_address || 'Unknown'} • {formatTimestamp(attempt.attempted_at)}
                        </div>
                      </div>
                      <div className="text-right">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {metrics && (
                <>
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-medium mb-2">Security Status</h4>
                    {metrics.locked_accounts > 0 ? (
                      <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          {metrics.locked_accounts} account(s) are currently locked due to failed login attempts.
                        </AlertDescription>
                      </Alert>
                    ) : (
                      <p className="text-green-600">✓ No accounts are currently locked</p>
                    )}
                  </div>

                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-medium mb-2">Recommendations</h4>
                    <ul className="space-y-1 text-sm">
                      {getFailureRate() > 20 && (
                        <li className="text-orange-600">• High failure rate detected - monitor for suspicious activity</li>
                      )}
                      {metrics.locked_accounts > 0 && (
                        <li className="text-red-600">• Review locked accounts and consider additional security measures</li>
                      )}
                      <li>• Regular monitoring of login attempts is recommended</li>
                      <li>• Enable 2FA for enhanced security</li>
                    </ul>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}