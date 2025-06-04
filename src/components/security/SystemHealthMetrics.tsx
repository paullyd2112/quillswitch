
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  RefreshCw,
  Database,
  Clock
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface HealthMetric {
  metric_name: string;
  metric_value: number;
  metric_description: string;
  last_updated: string;
}

interface PerformanceMetric {
  metric_name: string;
  metric_value: number;
  metric_unit: string;
}

const SystemHealthMetrics = () => {
  const [healthMetrics, setHealthMetrics] = useState<HealthMetric[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetric[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const loadMetrics = async () => {
    try {
      setIsLoading(true);

      // Load system health metrics
      const { data: healthData, error: healthError } = await supabase
        .rpc('get_system_health_metrics');

      if (healthError) throw healthError;
      setHealthMetrics(healthData || []);

      // Load performance metrics
      const { data: perfData, error: perfError } = await supabase
        .rpc('get_performance_metrics');

      if (perfError) throw perfError;
      setPerformanceMetrics(perfData || []);

      setLastRefresh(new Date());
    } catch (error) {
      console.error('Error loading system metrics:', error);
      toast.error('Failed to load system health metrics');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMetrics();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadMetrics, 30000);
    return () => clearInterval(interval);
  }, []);

  const getMetricIcon = (metricName: string) => {
    switch (metricName) {
      case 'active_migrations': return <Activity className="h-4 w-4 text-blue-600" />;
      case 'failed_migrations_24h': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'credential_access_24h': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'expired_credentials': return <Clock className="h-4 w-4 text-orange-600" />;
      case 'unresolved_errors': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'database_size': return <Database className="h-4 w-4 text-purple-600" />;
      case 'active_connections': return <TrendingUp className="h-4 w-4 text-blue-600" />;
      case 'total_connections': return <TrendingUp className="h-4 w-4 text-gray-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getMetricColor = (metricName: string, value: number): string => {
    switch (metricName) {
      case 'failed_migrations_24h':
      case 'expired_credentials':
      case 'unresolved_errors':
        return value > 0 ? 'text-red-600' : 'text-green-600';
      case 'active_migrations':
        return value > 10 ? 'text-orange-600' : 'text-blue-600';
      default:
        return 'text-blue-600';
    }
  };

  const formatMetricValue = (metric: HealthMetric | PerformanceMetric): string => {
    const value = metric.metric_value;
    
    if ('metric_unit' in metric) {
      // Performance metric
      if (metric.metric_unit === 'bytes') {
        const gb = value / (1024 * 1024 * 1024);
        return gb > 1 ? `${gb.toFixed(2)} GB` : `${(value / (1024 * 1024)).toFixed(2)} MB`;
      }
      return `${value} ${metric.metric_unit}`;
    }
    
    // Health metric
    return value.toString();
  };

  const getOverallHealthScore = (): number => {
    let score = 100;
    
    healthMetrics.forEach(metric => {
      switch (metric.metric_name) {
        case 'failed_migrations_24h':
          if (metric.metric_value > 0) score -= Math.min(20, metric.metric_value * 5);
          break;
        case 'expired_credentials':
          if (metric.metric_value > 0) score -= Math.min(15, metric.metric_value * 3);
          break;
        case 'unresolved_errors':
          if (metric.metric_value > 0) score -= Math.min(25, metric.metric_value * 2);
          break;
      }
    });
    
    return Math.max(0, score);
  };

  const healthScore = getOverallHealthScore();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">System Health Metrics</h2>
          <p className="text-muted-foreground">
            Real-time monitoring of system performance and health
          </p>
        </div>
        <Button onClick={loadMetrics} disabled={isLoading} variant="outline">
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Overall Health Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Overall System Health
          </CardTitle>
          <CardDescription>
            Composite health score based on key metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className={`text-3xl font-bold ${
                  healthScore >= 90 ? 'text-green-600' : 
                  healthScore >= 70 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {healthScore}/100
                </div>
                <p className="text-sm text-muted-foreground">
                  {healthScore >= 90 ? 'Excellent' : 
                   healthScore >= 70 ? 'Good' : 'Needs Attention'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Last updated</p>
                <p className="text-sm font-medium">
                  {lastRefresh.toLocaleTimeString()}
                </p>
              </div>
            </div>
            <Progress value={healthScore} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Health Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {healthMetrics.map((metric) => (
          <Card key={metric.metric_name}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                {getMetricIcon(metric.metric_name)}
                <span className="text-sm font-medium capitalize">
                  {metric.metric_name.replace(/_/g, ' ')}
                </span>
              </div>
              <div className={`text-2xl font-bold ${getMetricColor(metric.metric_name, metric.metric_value)}`}>
                {formatMetricValue(metric)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {metric.metric_description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Performance Metrics
          </CardTitle>
          <CardDescription>
            Database and system performance indicators
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {performanceMetrics.map((metric) => (
              <div key={metric.metric_name} className="flex items-center gap-3 p-3 border rounded-lg">
                {getMetricIcon(metric.metric_name)}
                <div>
                  <p className="font-medium capitalize">
                    {metric.metric_name.replace(/_/g, ' ')}
                  </p>
                  <p className="text-lg font-bold text-blue-600">
                    {formatMetricValue(metric)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemHealthMetrics;
