
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SystemHealth, ConnectionHealth } from '@/types/connectionHealth';
import ConnectionHealthIndicator from './ConnectionHealthIndicator';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, XCircle, AlertCircle, Clock, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

interface ConnectionHealthDashboardProps {
  systemHealth: SystemHealth;
  isLoading: boolean;
  onRefresh: () => void;
}

const ConnectionHealthDashboard: React.FC<ConnectionHealthDashboardProps> = ({
  systemHealth,
  isLoading,
  onRefresh
}) => {
  const [activeTab, setActiveTab] = useState<string>('all');
  
  // Filter connections based on active tab
  const filteredConnections = systemHealth.connections.filter(conn => {
    if (activeTab === 'all') return true;
    return conn.status === activeTab;
  });
  
  // Count connections by status
  const healthyCounts = systemHealth.connections.filter(c => c.status === 'healthy').length;
  const degradedCounts = systemHealth.connections.filter(c => c.status === 'degraded').length;
  const failedCounts = systemHealth.connections.filter(c => c.status === 'failed').length;
  
  return (
    <Card>
      <CardHeader className="border-b pb-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <CardTitle className="text-xl">Connection Health Dashboard</CardTitle>
            <ConnectionHealthIndicator 
              status={systemHealth.overall}
              showLabel
              size="sm"
            />
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRefresh}
            disabled={isLoading}
            className="gap-2"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </Button>
        </div>
        <div className="text-sm text-muted-foreground">
          Last updated: {format(systemHealth.lastUpdated, 'MMM d, yyyy HH:mm:ss')}
        </div>
      </CardHeader>
      
      <CardContent className="pt-5">
        {/* System Health Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="bg-muted/50">
            <CardContent className="flex flex-col items-center justify-center py-5">
              <div className="mb-1.5">
                <CheckCircle className="h-7 w-7 text-green-500" />
              </div>
              <div className="text-2xl font-semibold">{healthyCounts}</div>
              <div className="text-sm text-muted-foreground">Healthy Connections</div>
            </CardContent>
          </Card>
          
          <Card className="bg-muted/50">
            <CardContent className="flex flex-col items-center justify-center py-5">
              <div className="mb-1.5">
                <AlertCircle className="h-7 w-7 text-amber-500" />
              </div>
              <div className="text-2xl font-semibold">{degradedCounts}</div>
              <div className="text-sm text-muted-foreground">Degraded Connections</div>
            </CardContent>
          </Card>
          
          <Card className="bg-muted/50">
            <CardContent className="flex flex-col items-center justify-center py-5">
              <div className="mb-1.5">
                <XCircle className="h-7 w-7 text-red-500" />
              </div>
              <div className="text-2xl font-semibold">{failedCounts}</div>
              <div className="text-sm text-muted-foreground">Failed Connections</div>
            </CardContent>
          </Card>
        </div>
        
        {/* Connections List */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="all" className="relative">
                All
                <Badge variant="secondary" className="ml-1.5">{systemHealth.connections.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="healthy" className="relative">
                Healthy
                <Badge variant="secondary" className="ml-1.5">{healthyCounts}</Badge>
              </TabsTrigger>
              <TabsTrigger value="degraded" className="relative">
                Degraded
                <Badge variant="secondary" className="ml-1.5">{degradedCounts}</Badge>
              </TabsTrigger>
              <TabsTrigger value="failed" className="relative">
                Failed
                <Badge variant="secondary" className="ml-1.5">{failedCounts}</Badge>
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value={activeTab} className="mt-0">
            <div className="rounded-md border">
              <div className="grid grid-cols-10 font-medium p-3 border-b bg-muted/50 text-sm">
                <div className="col-span-3">Connector</div>
                <div className="col-span-1">Status</div>
                <div className="col-span-1">Response</div>
                <div className="col-span-2">Uptime</div>
                <div className="col-span-2">Success Rate</div>
                <div className="col-span-1">API Calls</div>
              </div>
              
              {filteredConnections.length > 0 ? (
                <div className="divide-y">
                  {filteredConnections.map((conn) => (
                    <ConnectionRow key={conn.id} connection={conn} />
                  ))}
                </div>
              ) : (
                <div className="p-5 text-center text-muted-foreground">
                  No connections matching the selected filter
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

// Sub-component for each connection row
const ConnectionRow: React.FC<{ connection: ConnectionHealth }> = ({ connection }) => {
  const [expanded, setExpanded] = useState(false);
  
  const getSuccessRateColor = (rate: number) => {
    if (rate > 95) return 'text-green-600';
    if (rate > 80) return 'text-yellow-600';
    return 'text-red-600';
  };
  
  return (
    <div className="text-sm">
      <div 
        className="grid grid-cols-10 p-3 items-center cursor-pointer hover:bg-muted/30"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="col-span-3 font-medium">{connection.connectorId}</div>
        <div className="col-span-1">
          <ConnectionHealthIndicator status={connection.status} size="sm" />
        </div>
        <div className="col-span-1">
          {connection.responseTime ? `${connection.responseTime}ms` : 'N/A'}
        </div>
        <div className="col-span-2">
          {connection.uptime ? (
            <div className="flex flex-col gap-1">
              <div className="text-xs">{connection.uptime.toFixed(1)}%</div>
              <Progress value={connection.uptime} className="h-1.5" />
            </div>
          ) : 'N/A'}
        </div>
        <div className="col-span-2">
          {connection.metrics?.successRate ? (
            <div className="flex flex-col gap-1">
              <div className={`text-xs ${getSuccessRateColor(connection.metrics.successRate)}`}>
                {connection.metrics.successRate.toFixed(1)}%
              </div>
              <Progress 
                value={connection.metrics.successRate} 
                className="h-1.5"
              />
            </div>
          ) : 'N/A'}
        </div>
        <div className="col-span-1">
          {connection.metrics?.apiCalls24h ? 
            connection.metrics.apiCalls24h.toLocaleString() : 
            'N/A'
          }
        </div>
      </div>
      
      {expanded && (
        <div className="bg-muted/20 p-3 border-t">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium mb-2">Connection Details</div>
              <div className="grid grid-cols-3 gap-1 text-xs">
                <div className="text-muted-foreground">Last Checked:</div>
                <div className="col-span-2">
                  {connection.lastChecked ? format(connection.lastChecked, 'MMM d, yyyy HH:mm:ss') : 'N/A'}
                </div>
                
                <div className="text-muted-foreground">Average Response:</div>
                <div className="col-span-2">
                  {connection.metrics?.averageResponseTime ? 
                    `${connection.metrics.averageResponseTime}ms` : 
                    'N/A'
                  }
                </div>
                
                <div className="text-muted-foreground">Error Count:</div>
                <div className="col-span-2">
                  {connection.errorCount !== undefined ? connection.errorCount : 'N/A'}
                </div>
              </div>
            </div>
            
            {connection.lastError && (
              <div>
                <div className="text-sm font-medium mb-2">Last Error</div>
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded p-2 text-xs text-red-800 dark:text-red-300">
                  {connection.lastError}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectionHealthDashboard;
