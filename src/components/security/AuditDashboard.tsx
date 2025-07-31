import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Calendar, Search, Filter, Download, AlertTriangle, Shield, User, Database } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { securityLog } from '@/utils/logging/consoleReplacer';

interface AuditLogEntry {
  id: string;
  action: string;
  table_name: string;
  record_id: string | null;
  created_at: string;
  ip_address: string | null;
  user_agent: string | null;
  context_json: any;
}

interface SecurityMetrics {
  total_actions: number;
  failed_logins: number;
  credential_accesses: number;
  high_risk_activities: number;
}

const actionIcons: Record<string, any> = {
  INSERT: Database,
  UPDATE: Database,
  DELETE: AlertTriangle,
  SELECT: Shield,
  LOGIN: User,
  LOGOUT: User
};

const actionColors: Record<string, string> = {
  INSERT: 'bg-green-100 text-green-800',
  UPDATE: 'bg-blue-100 text-blue-800',
  DELETE: 'bg-red-100 text-red-800',
  SELECT: 'bg-gray-100 text-gray-800',
  LOGIN: 'bg-purple-100 text-purple-800',
  LOGOUT: 'bg-orange-100 text-orange-800'
};

const AuditDashboard: React.FC = () => {
  const { user } = useAuth();
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [metrics, setMetrics] = useState<SecurityMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [timeFilter, setTimeFilter] = useState<string>('24h');

  useEffect(() => {
    if (user) {
      loadAuditData();
    }
  }, [user, timeFilter]);

  const loadAuditData = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Calculate time range
      const now = new Date();
      let startTime = new Date();
      
      switch (timeFilter) {
        case '1h':
          startTime.setHours(now.getHours() - 1);
          break;
        case '24h':
          startTime.setDate(now.getDate() - 1);
          break;
        case '7d':
          startTime.setDate(now.getDate() - 7);
          break;
        case '30d':
          startTime.setDate(now.getDate() - 30);
          break;
        default:
          startTime.setDate(now.getDate() - 1);
      }

      // Load audit logs
      let query = supabase
        .from('audit_log')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', startTime.toISOString())
        .order('created_at', { ascending: false })
        .limit(100);

      if (actionFilter !== 'all') {
        query = query.eq('action', actionFilter);
      }

      const { data: logs, error: logsError } = await query;

      if (logsError) {
        securityLog.error('Failed to load audit logs', logsError);
        toast.error('Failed to load audit logs');
        return;
      }

      setAuditLogs((logs as any[]) || []);

      // Load security metrics
      const { data: metricsData, error: metricsError } = await supabase
        .from('credential_access_log')
        .select('action')
        .eq('user_id', user.id)
        .gte('accessed_at', startTime.toISOString());

      if (metricsError) {
        securityLog.error('Failed to load security metrics', metricsError);
      } else {
        const totalActions = logs?.length || 0;
        const credentialAccesses = metricsData?.length || 0;
        const failedLogins = logs?.filter(log => 
          log.action === 'LOGIN' && 
          typeof log.context_json === 'object' && 
          log.context_json && 
          'success' in log.context_json && 
          log.context_json.success === false
        ).length || 0;
        const highRiskActivities = logs?.filter(log => 
          log.action === 'DELETE' || 
          (log.ip_address && 
           typeof log.ip_address === 'string' && 
           !log.ip_address.includes('192.168'))
        ).length || 0;

        setMetrics({
          total_actions: totalActions,
          failed_logins: failedLogins,
          credential_accesses: credentialAccesses,
          high_risk_activities: highRiskActivities
        });
      }

      securityLog.info('Audit data loaded', { 
        userId: user.id, 
        logCount: logs?.length || 0,
        timeFilter 
      });

    } catch (error) {
      securityLog.error('Error loading audit data', error);
      toast.error('Failed to load audit data');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredLogs = auditLogs.filter(log => {
    if (!searchTerm) return true;
    return (
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.table_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.record_id?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const exportAuditLogs = () => {
    const csvContent = [
      'Timestamp,Action,Table,Record ID,IP Address,User Agent',
      ...filteredLogs.map(log => [
        log.created_at,
        log.action,
        log.table_name,
        log.record_id || '',
        log.ip_address || '',
        log.user_agent || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-log-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Audit log exported');
    securityLog.info('Audit log exported', { userId: user?.id });
  };

  const formatTimestamp = (timestamp: string) => {
    return format(new Date(timestamp), 'MMM d, yyyy HH:mm:ss');
  };

  const getActionIcon = (action: string) => {
    const Icon = actionIcons[action] || Database;
    return <Icon className="h-4 w-4" />;
  };

  const getActionBadge = (action: string) => {
    const colorClass = actionColors[action] || 'bg-gray-100 text-gray-800';
    return (
      <Badge variant="secondary" className={colorClass}>
        {action}
      </Badge>
    );
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
      {/* Security Metrics */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Actions</p>
                  <p className="text-2xl font-bold">{metrics.total_actions}</p>
                </div>
                <Database className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Failed Logins</p>
                  <p className="text-2xl font-bold text-red-600">{metrics.failed_logins}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Credential Access</p>
                  <p className="text-2xl font-bold">{metrics.credential_accesses}</p>
                </div>
                <Shield className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">High Risk</p>
                  <p className="text-2xl font-bold text-orange-600">{metrics.high_risk_activities}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Audit Log Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Security Audit Log</CardTitle>
              <CardDescription>
                Track all security-related activities on your account
              </CardDescription>
            </div>
            <Button variant="outline" onClick={exportAuditLogs}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
          
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="flex items-center gap-2 flex-1">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search actions, tables, or record IDs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-xs"
              />
            </div>
            
            <div className="flex gap-2">
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger className="w-32">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value="INSERT">Insert</SelectItem>
                  <SelectItem value="UPDATE">Update</SelectItem>
                  <SelectItem value="DELETE">Delete</SelectItem>
                  <SelectItem value="SELECT">Select</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={timeFilter} onValueChange={setTimeFilter}>
                <SelectTrigger className="w-24">
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1h">1 Hour</SelectItem>
                  <SelectItem value="24h">24 Hours</SelectItem>
                  <SelectItem value="7d">7 Days</SelectItem>
                  <SelectItem value="30d">30 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <ScrollArea className="h-96">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Action</TableHead>
                  <TableHead>Table</TableHead>
                  <TableHead>Record ID</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>IP Address</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      No audit log entries found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getActionIcon(log.action)}
                          {getActionBadge(log.action)}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{log.table_name}</TableCell>
                      <TableCell className="font-mono text-sm">{log.record_id || '-'}</TableCell>
                      <TableCell>{formatTimestamp(log.created_at)}</TableCell>
                      <TableCell className="font-mono text-sm">{log.ip_address || '-'}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditDashboard;