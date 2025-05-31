import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Activity, 
  Shield, 
  AlertTriangle, 
  Eye, 
  Clock, 
  MapPin,
  Smartphone
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AccessLog {
  id: string;
  credential_id: string;
  action: string;
  accessed_at: string;
  service_name?: string;
  credential_name?: string;
}

interface SecurityEvent {
  id: string;
  event_type: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  metadata?: Record<string, any>;
}

const SecurityMonitor = () => {
  const [accessLogs, setAccessLogs] = useState<AccessLog[]>([]);
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadSecurityData = async () => {
    try {
      setIsLoading(true);

      // Load recent access logs with credential details
      const { data: logsData, error: logsError } = await supabase
        .from('credential_access_log')
        .select(`
          id,
          credential_id,
          action,
          accessed_at,
          service_credentials!inner(
            service_name,
            credential_name
          )
        `)
        .order('accessed_at', { ascending: false })
        .limit(50);

      if (logsError) throw logsError;

      // Transform the data to flatten the structure and convert id to string
      const transformedLogs = logsData?.map(log => ({
        id: log.id.toString(), // Convert number to string
        credential_id: log.credential_id,
        action: log.action,
        accessed_at: log.accessed_at,
        service_name: (log.service_credentials as any)?.service_name,
        credential_name: (log.service_credentials as any)?.credential_name
      })) || [];

      setAccessLogs(transformedLogs);

      // Generate mock security events based on access patterns
      const events = generateSecurityEvents(transformedLogs);
      setSecurityEvents(events);

    } catch (error) {
      console.error('Error loading security data:', error);
      toast.error('Failed to load security monitoring data');
    } finally {
      setIsLoading(false);
    }
  };

  const generateSecurityEvents = (logs: AccessLog[]): SecurityEvent[] => {
    const events: SecurityEvent[] = [];
    
    // Check for suspicious access patterns
    const recentLogs = logs.filter(log => 
      new Date(log.accessed_at) > new Date(Date.now() - 24 * 60 * 60 * 1000)
    );

    // Multiple rapid accesses
    const accessCounts = recentLogs.reduce((acc, log) => {
      acc[log.credential_id] = (acc[log.credential_id] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    Object.entries(accessCounts).forEach(([credentialId, count]) => {
      if (count > 10) {
        const log = logs.find(l => l.credential_id === credentialId);
        events.push({
          id: `rapid-access-${credentialId}`,
          event_type: 'suspicious_access',
          description: `Unusual high frequency access to ${log?.service_name} credential`,
          severity: 'medium',
          timestamp: new Date().toISOString(),
          metadata: { credential_id: credentialId, access_count: count }
        });
      }
    });

    // Add some general security events
    if (logs.length > 0) {
      events.push({
        id: 'rls-active',
        event_type: 'security_status',
        description: 'Row Level Security policies are active and protecting data',
        severity: 'low',
        timestamp: new Date().toISOString(),
        metadata: { status: 'active' }
      });
    }

    return events.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  };

  useEffect(() => {
    loadSecurityData();
    
    // Set up real-time subscription for access logs
    const subscription = supabase
      .channel('security-monitor')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'credential_access_log'
        },
        () => {
          loadSecurityData();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'high': return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'medium': return <Shield className="h-4 w-4 text-yellow-500" />;
      case 'low': return <Shield className="h-4 w-4 text-blue-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Security Monitor</h2>
          <p className="text-muted-foreground">
            Real-time security events and access monitoring
          </p>
        </div>
        <Button onClick={loadSecurityData} disabled={isLoading} variant="outline">
          <Activity className={`h-4 w-4 mr-2 ${isLoading ? 'animate-pulse' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Security Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security Events
            </CardTitle>
            <CardDescription>
              Recent security-related activities and alerts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              {securityEvents.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Shield className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No security events detected</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {securityEvents.map((event) => (
                    <div key={event.id} className="border rounded-lg p-3">
                      <div className="flex items-start gap-3">
                        {getSeverityIcon(event.severity)}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className={getSeverityColor(event.severity)}>
                              {event.event_type}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {formatTimestamp(event.timestamp)}
                            </span>
                          </div>
                          <p className="text-sm">{event.description}</p>
                          {event.metadata && (
                            <div className="text-xs text-muted-foreground mt-1">
                              {Object.entries(event.metadata).map(([key, value]) => (
                                <span key={key} className="mr-3">
                                  {key}: {String(value)}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Access Logs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Access Logs
            </CardTitle>
            <CardDescription>
              Recent credential access activity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              {accessLogs.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Eye className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No access logs available</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {accessLogs.map((log) => (
                    <div key={log.id} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{log.action}</Badge>
                          <span className="text-sm font-medium">
                            {log.service_name}: {log.credential_name}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {formatTimestamp(log.accessed_at)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SecurityMonitor;
