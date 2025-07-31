import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, ShieldCheck, Lock, Key, Eye, AlertTriangle, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth';
import { securityLog } from '@/utils/logging/consoleReplacer';

interface EncryptionStatus {
  service_name: string;
  credential_count: number;
  last_encrypted_at: string;
  encryption_algorithm: string;
}

interface SecurityScore {
  total_score: number;
  two_factor_enabled: boolean;
  encrypted_credentials: number;
  recent_activity: boolean;
  session_security: boolean;
}

const SecurityIndicators: React.FC = () => {
  const { user } = useAuth();
  const [encryptionStatus, setEncryptionStatus] = useState<EncryptionStatus[]>([]);
  const [securityScore, setSecurityScore] = useState<SecurityScore | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadSecurityIndicators();
    }
  }, [user]);

  const loadSecurityIndicators = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Load encryption status
      const { data: encryptionData, error: encryptionError } = await supabase
        .from('encryption_status')
        .select('*')
        .eq('user_id', user.id);

      if (encryptionError) {
        securityLog.error('Failed to load encryption status', encryptionError);
      } else {
        setEncryptionStatus(encryptionData || []);
      }

      // Load 2FA status
      const { data: securitySettings, error: securityError } = await supabase
        .from('user_security_settings')
        .select('two_factor_enabled')
        .eq('user_id', user.id)
        .maybeSingle();

      if (securityError) {
        securityLog.error('Failed to load 2FA status', securityError);
      }

      // Calculate security score
      const twoFactorEnabled = securitySettings?.two_factor_enabled || false;
      const encryptedCredentials = encryptionData?.reduce((sum, status) => sum + status.credential_count, 0) || 0;
      
      // Check recent activity (simplified)
      const { data: recentActivity } = await supabase
        .from('audit_log')
        .select('id')
        .eq('user_id', user.id)
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .limit(1);

      const hasRecentActivity = (recentActivity?.length || 0) > 0;

      // Calculate total score (out of 100)
      let totalScore = 0;
      if (twoFactorEnabled) totalScore += 40;
      if (encryptedCredentials > 0) totalScore += 30;
      if (hasRecentActivity) totalScore += 15;
      totalScore += 15; // Base session security (always enabled in our app)

      setSecurityScore({
        total_score: totalScore,
        two_factor_enabled: twoFactorEnabled,
        encrypted_credentials: encryptedCredentials,
        recent_activity: hasRecentActivity,
        session_security: true
      });

      securityLog.info('Security indicators loaded', { 
        userId: user.id, 
        score: totalScore,
        encryptionServices: encryptionData?.length || 0
      });

    } catch (error) {
      securityLog.error('Error loading security indicators', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Poor';
  };

  const getEncryptionIcon = (algorithm: string) => {
    switch (algorithm) {
      case 'AES-256-GCM':
        return <Lock className="h-4 w-4 text-green-500" />;
      default:
        return <Lock className="h-4 w-4 text-blue-500" />;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Security Score Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-primary" />
            <div>
              <CardTitle>Security Score</CardTitle>
              <CardDescription>
                Overall security assessment of your account
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {securityScore && (
            <>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Security Level</span>
                    <span className={`text-lg font-bold ${getScoreColor(securityScore.total_score)}`}>
                      {securityScore.total_score}/100 - {getScoreLabel(securityScore.total_score)}
                    </span>
                  </div>
                  <Progress value={securityScore.total_score} className="h-3" />
                </div>
              </div>

              {/* Security Checklist */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  {securityScore.two_factor_enabled ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                  )}
                  <div>
                    <p className="font-medium">Two-Factor Authentication</p>
                    <p className="text-sm text-muted-foreground">
                      {securityScore.two_factor_enabled ? 'Enabled' : 'Not enabled'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {securityScore.encrypted_credentials > 0 ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  )}
                  <div>
                    <p className="font-medium">Encrypted Credentials</p>
                    <p className="text-sm text-muted-foreground">
                      {securityScore.encrypted_credentials} credentials encrypted
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {securityScore.session_security ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                  )}
                  <div>
                    <p className="font-medium">Session Security</p>
                    <p className="text-sm text-muted-foreground">
                      {securityScore.session_security ? 'Active' : 'Inactive'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {securityScore.recent_activity ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-500" />
                  )}
                  <div>
                    <p className="font-medium">Recent Activity</p>
                    <p className="text-sm text-muted-foreground">
                      {securityScore.recent_activity ? 'Monitored' : 'No recent activity'}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Data Encryption Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Lock className="h-6 w-6 text-primary" />
            <div>
              <CardTitle>Data Encryption</CardTitle>
              <CardDescription>
                Encryption status of your stored credentials and data
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {encryptionStatus.length === 0 ? (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                No encrypted data found. Your credentials will be automatically encrypted when you connect services.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              <Alert>
                <ShieldCheck className="h-4 w-4" />
                <AlertDescription>
                  All your sensitive data is encrypted using industry-standard encryption algorithms.
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                {encryptionStatus.map((status, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getEncryptionIcon(status.encryption_algorithm)}
                      <div>
                        <p className="font-medium capitalize">{status.service_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {status.credential_count} credential{status.credential_count !== 1 ? 's' : ''} encrypted
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary" className="mb-1">
                        {status.encryption_algorithm}
                      </Badge>
                      <p className="text-xs text-muted-foreground">
                        Last updated: {new Date(status.last_encrypted_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security Trust Signals */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-6 w-6 text-green-500" />
            <div>
              <CardTitle>Trust & Compliance</CardTitle>
              <CardDescription>
                Security measures protecting your data
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <Lock className="h-5 w-5 text-green-500" />
              <div>
                <p className="font-medium">End-to-End Encryption</p>
                <p className="text-sm text-muted-foreground">AES-256 encryption at rest</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <Shield className="h-5 w-5 text-blue-500" />
              <div>
                <p className="font-medium">SSL/TLS Transport</p>
                <p className="text-sm text-muted-foreground">Data encrypted in transit</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <Key className="h-5 w-5 text-purple-500" />
              <div>
                <p className="font-medium">Key Management</p>
                <p className="text-sm text-muted-foreground">Secure key rotation</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <Eye className="h-5 w-5 text-orange-500" />
              <div>
                <p className="font-medium">Activity Monitoring</p>
                <p className="text-sm text-muted-foreground">Real-time audit logging</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityIndicators;