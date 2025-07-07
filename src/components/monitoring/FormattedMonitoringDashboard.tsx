
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { monitoring } from '@/services/monitoring/monitoringService';
import { Activity, AlertTriangle, BarChart3, Users, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import DataDisplay from '@/components/common/DataDisplay';
import ActivityList from '@/components/common/ActivityList';
import { useDashboardFormatting } from '@/hooks/useDashboardFormatting';

interface DashboardData {
  metrics: any[];
  activities: any[];
  errors: any[];
}

export const FormattedMonitoringDashboard: React.FC = () => {
  const [timeframe, setTimeframe] = useState('24h');
  const [data, setData] = useState<DashboardData>({ metrics: [], activities: [], errors: [] });
  const [isLoading, setIsLoading] = useState(true);

  const { stats } = useDashboardFormatting({
    user_activities: data.activities,
    migration_errors: data.errors
  });

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

  const responseTimeSummary = getMetricSummary('api_response_time');
  const errorRate = data.metrics.filter(m => m.metric_name === 'api_error_rate').length;
  const uniqueUsers = data.activities.reduce((unique, a) => {
    if (a.user_id && !unique.has(a.user_id)) {
      unique.add(a.user_id);
    }
    return unique;
  }, new Set()).size;

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
        <DataDisplay
          label="Avg Response Time"
          value={responseTimeSummary.avg}
          type="number"
          variant="card"
          size="lg"
          loading={isLoading}
        />
        
        <DataDisplay
          label="Error Rate"
          value={errorRate}
          type="percentage"
          variant="card"
          size="lg"
          loading={isLoading}
        />
        
        <DataDisplay
          label="Total Activities"
          value={data.activities.length}
          type="number"
          variant="card"
          size="lg"
          loading={isLoading}
        />
        
        <DataDisplay
          label="Active Users"
          value={uniqueUsers}
          type="number"
          variant="card"
          size="lg"
          loading={isLoading}
        />
      </div>

      <Tabs defaultValue="metrics" className="w-full">
        <TabsList>
          <TabsTrigger value="metrics">Performance Metrics</TabsTrigger>
          <TabsTrigger value="activities">User Activities</TabsTrigger>
          <TabsTrigger value="errors">Error Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="metrics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <DataDisplay
              label="Max Response Time"
              value={responseTimeSummary.max}
              type="number"
              variant="card"
              loading={isLoading}
            />
            <DataDisplay
              label="Min Response Time"
              value={responseTimeSummary.min}
              type="number"
              variant="card"
              loading={isLoading}
            />
            <DataDisplay
              label="Total Errors"
              value={data.errors.length}
              type="number"
              variant="card"
              loading={isLoading}
            />
          </div>
        </TabsContent>

        <TabsContent value="activities" className="space-y-4">
          <ActivityList
            activities={data.activities}
            title="Recent User Activities"
            limit={50}
            showGrouping={true}
            loading={isLoading}
          />
        </TabsContent>

        <TabsContent value="errors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Error Logs</CardTitle>
              <CardDescription>Recent errors and security events</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div>Loading errors...</div>
              ) : data.errors.length === 0 ? (
                <p className="text-sm text-muted-foreground">No errors in the selected timeframe</p>
              ) : (
                <div className="space-y-3">
                  {data.errors.slice(0, 20).map((error, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <DataDisplay
                            label="Action"
                            value={error.action}
                            type="text"
                            variant="inline"
                            className="mb-2"
                          />
                          <DataDisplay
                            label="Time"
                            value={error.created_at}
                            type="text"
                            variant="inline"
                          />
                          {error.details && (
                            <pre className="text-xs text-muted-foreground mt-2 p-2 bg-muted rounded">
                              {JSON.stringify(error.details, null, 2)}
                            </pre>
                          )}
                        </div>
                        <DataDisplay
                          label=""
                          value="Error"
                          type="badge"
                          status="error"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FormattedMonitoringDashboard;
