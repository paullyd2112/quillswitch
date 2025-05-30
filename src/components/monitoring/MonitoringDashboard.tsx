
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { monitoring } from '@/services/monitoring/monitoringService';
import { Activity, AlertTriangle, BarChart3, Users, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface DashboardData {
  metrics: any[];
  activities: any[];
  errors: any[];
}

export const MonitoringDashboard: React.FC = () => {
  const [timeframe, setTimeframe] = useState('24h');
  const [data, setData] = useState<DashboardData>({ metrics: [], activities: [], errors: [] });
  const [isLoading, setIsLoading] = useState(true);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const dashboardData = await monitoring.getDashboardData(timeframe);
      setData(dashboardData);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      toast.error('Failed to load monitoring data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [timeframe]);

  const getMetricSummary = (metricName: string) => {
    const metrics = data.metrics.filter(m => m.metric_name === metricName);
    if (metrics.length === 0) return { avg: 0, max: 0, min: 0 };
    
    const values = metrics.map(m => m.value);
    return {
      avg: values.reduce((a, b) => a + b, 0) / values.length,
      max: Math.max(...values),
      min: Math.min(...values)
    };
  };

  const getErrorRate = () => {
    const totalRequests = data.metrics.filter(m => m.metric_name === 'api_response_time').length;
    const errors = data.metrics.filter(m => m.metric_name === 'api_error_rate').length;
    return totalRequests > 0 ? (errors / totalRequests) * 100 : 0;
  };

  const getTopActivities = () => {
    const activityCounts: Record<string, number> = {};
    data.activities.forEach(activity => {
      activityCounts[activity.activity_type] = (activityCounts[activity.activity_type] || 0) + 1;
    });
    
    return Object.entries(activityCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);
  };

  const responseTimeSummary = getMetricSummary('api_response_time');
  const errorRate = getErrorRate();
  const topActivities = getTopActivities();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Monitoring Dashboard</h2>
        <div className="flex gap-2">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">Last Hour</SelectItem>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            onClick={loadDashboardData} 
            variant="outline" 
            size="sm"
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Time</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {responseTimeSummary.avg.toFixed(0)}ms
            </div>
            <p className="text-xs text-muted-foreground">
              Avg • Max: {responseTimeSummary.max.toFixed(0)}ms
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {errorRate.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              {data.errors.length} errors
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activities</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.activities.length}
            </div>
            <p className="text-xs text-muted-foreground">
              User activities
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(data.activities.map(a => a.user_id).filter(Boolean)).size}
            </div>
            <p className="text-xs text-muted-foreground">
              Unique users
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="metrics" className="w-full">
        <TabsList>
          <TabsTrigger value="metrics">Performance Metrics</TabsTrigger>
          <TabsTrigger value="activities">User Activities</TabsTrigger>
          <TabsTrigger value="errors">Error Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="metrics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Activities</CardTitle>
              <CardDescription>Most common user activities in the selected timeframe</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {topActivities.map(([activity, count]) => (
                  <div key={activity} className="flex justify-between items-center">
                    <span className="text-sm">{activity.replace('_', ' ')}</span>
                    <Badge variant="secondary">{count}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
              <CardDescription>Latest user activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {data.activities.slice(0, 50).map((activity, index) => (
                  <div key={index} className="border-b pb-2 last:border-b-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium">{activity.activity_description}</p>
                        <p className="text-xs text-muted-foreground">
                          {activity.activity_type} • {new Date(activity.created_at).toLocaleString()}
                        </p>
                      </div>
                      {activity.user_id && (
                        <Badge variant="outline" className="text-xs">
                          {activity.user_id.slice(0, 8)}...
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="errors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Error Logs</CardTitle>
              <CardDescription>Recent errors and security events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {data.errors.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No errors in the selected timeframe</p>
                ) : (
                  data.errors.map((error, index) => (
                    <div key={index} className="border-b pb-2 last:border-b-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-red-600">{error.action}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(error.created_at).toLocaleString()}
                          </p>
                          {error.details && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {JSON.stringify(error.details, null, 2)}
                            </p>
                          )}
                        </div>
                        <Badge variant="destructive" className="text-xs">
                          Error
                        </Badge>
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

export default MonitoringDashboard;
