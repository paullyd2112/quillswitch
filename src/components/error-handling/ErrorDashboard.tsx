import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, TrendingUp, Clock, BarChart3, RefreshCw } from 'lucide-react';
import { errorHandler } from '@/services/errorHandling/globalErrorHandler';

export const ErrorDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [recentErrors, setRecentErrors] = useState<any[]>([]);
  const [criticalAlerts, setCriticalAlerts] = useState<any[]>([]);
  const [performanceData, setPerformanceData] = useState<any[]>([]);

  const refreshData = () => {
    setStats(errorHandler.getErrorStats());
    setRecentErrors(errorHandler.getRecentErrors(20));
    setCriticalAlerts(errorHandler.getCriticalAlerts());
    setPerformanceData(errorHandler.getPerformanceMetrics());
  };

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
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

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  if (!stats) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
            <p>Loading error analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Error & Performance Dashboard</h1>
        <Button onClick={refreshData} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Errors</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalErrors}</div>
            <p className="text-xs text-muted-foreground">
              {stats.groupCount} unique error types
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Alerts</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {stats.bySeverity.critical || 0}
            </div>
            <p className="text-xs text-muted-foreground">Require immediate attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {performanceData.length > 0
                ? formatDuration(
                    performanceData.reduce((acc, p) => acc + p.duration, 0) / performanceData.length
                  )
                : '0ms'}
            </div>
            <p className="text-xs text-muted-foreground">
              Based on {performanceData.length} operations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Error Groups</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.groupCount}</div>
            <p className="text-xs text-muted-foreground">Unique error patterns</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="errors" className="space-y-4">
        <TabsList>
          <TabsTrigger value="errors">Recent Errors</TabsTrigger>
          <TabsTrigger value="groups">Error Groups</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="critical">Critical Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="errors">
          <Card>
            <CardHeader>
              <CardTitle>Recent Errors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentErrors.length === 0 ? (
                  <p className="text-muted-foreground">No recent errors</p>
                ) : (
                  recentErrors.map((error, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 border rounded">
                      <Badge className={getSeverityColor(error.severity)}>
                        {error.severity}
                      </Badge>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium">{error.code}</p>
                        <p className="text-sm text-muted-foreground truncate">
                          {error.message}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(error.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="groups">
          <Card>
            <CardHeader>
              <CardTitle>Top Error Groups</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.topErrors.length === 0 ? (
                  <p className="text-muted-foreground">No error groups</p>
                ) : (
                  stats.topErrors.map((group: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium">{group.key.split('_')[0]}</p>
                        <p className="text-sm text-muted-foreground">
                          Last seen: {new Date(group.lastSeen).toLocaleString()}
                        </p>
                      </div>
                      <Badge variant="secondary">{group.count} occurrences</Badge>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {performanceData.length === 0 ? (
                  <p className="text-muted-foreground">No performance data</p>
                ) : (
                  performanceData.slice(-20).reverse().map((metric, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium">{metric.action}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(metric.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <Badge 
                        variant={metric.duration > 3000 ? "destructive" : metric.duration > 1000 ? "secondary" : "default"}
                      >
                        {formatDuration(metric.duration)}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="critical">
          <Card>
            <CardHeader>
              <CardTitle>Critical Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {criticalAlerts.length === 0 ? (
                  <p className="text-muted-foreground">No critical alerts</p>
                ) : (
                  criticalAlerts.map((alert, index) => (
                    <div key={index} className="p-3 border border-red-200 rounded bg-red-50 dark:bg-red-950/20">
                      <div className="flex items-start space-x-3">
                        <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                        <div className="flex-1">
                          <p className="font-medium text-red-800 dark:text-red-200">
                            {alert.error.code}
                          </p>
                          <p className="text-sm text-red-600 dark:text-red-300">
                            {alert.error.message}
                          </p>
                          <p className="text-xs text-red-500">
                            {new Date(alert.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};