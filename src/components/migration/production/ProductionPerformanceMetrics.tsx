
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  Zap, 
  Database, 
  Clock, 
  TrendingUp, 
  Shield,
  Cpu,
  MemoryStick
} from 'lucide-react';
import { ProductionPerformanceMetrics, ProductionMigrationResult } from '@/services/migration/optimization/productionMigrationService';

interface ProductionPerformanceMetricsProps {
  metrics: ProductionPerformanceMetrics;
  result?: ProductionMigrationResult;
  isRunning: boolean;
}

const ProductionPerformanceMetricsComponent: React.FC<ProductionPerformanceMetricsProps> = ({
  metrics,
  result,
  isRunning
}) => {
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toFixed(0);
  };

  const formatTime = (ms: number) => {
    if (ms < 1000) return `${ms.toFixed(0)}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    return `${(ms / 60000).toFixed(1)}m`;
  };

  const getPerformanceRating = (recordsPerSecond: number) => {
    if (recordsPerSecond >= 1000) return { rating: 'Excellent', color: 'bg-green-500' };
    if (recordsPerSecond >= 500) return { rating: 'Good', color: 'bg-blue-500' };
    if (recordsPerSecond >= 100) return { rating: 'Average', color: 'bg-yellow-500' };
    return { rating: 'Poor', color: 'bg-red-500' };
  };

  const performance = getPerformanceRating(metrics.recordsPerSecond);

  return (
    <div className="space-y-6">
      {/* Overall Performance Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-500" />
              Performance Overview
            </CardTitle>
            <Badge className={performance.color}>
              {performance.rating}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {formatNumber(metrics.recordsPerSecond)}
              </div>
              <div className="text-sm text-muted-foreground">Records/sec</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {formatNumber(metrics.peakThroughput)}
              </div>
              <div className="text-sm text-muted-foreground">Peak Throughput</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {formatTime(metrics.averageLatency)}
              </div>
              <div className="text-sm text-muted-foreground">Avg Latency</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {result ? formatTime(result.processingTime) : '--'}
              </div>
              <div className="text-sm text-muted-foreground">Total Time</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Optimization Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Database className="h-4 w-4 text-green-500" />
              Data Optimization
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Cache Hit Rate</span>
                <span className="text-sm">{(metrics.cacheHitRate * 100).toFixed(1)}%</span>
              </div>
              <Progress value={metrics.cacheHitRate * 100} className="h-2" />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Compression Ratio</span>
                <span className="text-sm">{(metrics.compressionRatio * 100).toFixed(1)}%</span>
              </div>
              <Progress value={metrics.compressionRatio * 100} className="h-2" />
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="text-center">
                <div className="text-lg font-semibold text-green-600">
                  {result ? formatNumber(result.totalSkipped) : '--'}
                </div>
                <div className="text-xs text-muted-foreground">Records Skipped</div>
              </div>
              
              <div className="text-center">
                <div className="text-lg font-semibold text-blue-600">
                  {result ? formatNumber(result.totalProcessed) : '--'}
                </div>
                <div className="text-xs text-muted-foreground">Records Processed</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Cpu className="h-4 w-4 text-blue-500" />
              System Performance
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Memory Efficiency</span>
                <span className="text-sm">{(metrics.memoryEfficiency * 100).toFixed(1)}%</span>
              </div>
              <Progress value={metrics.memoryEfficiency * 100} className="h-2" />
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="text-center">
                <div className="text-lg font-semibold text-orange-600">
                  {result ? result.totalErrors : '--'}
                </div>
                <div className="text-xs text-muted-foreground">Errors</div>
              </div>
              
              <div className="text-center">
                <div className="text-lg font-semibold text-green-600">
                  {result ? ((result.totalProcessed / (result.totalProcessed + result.totalErrors)) * 100).toFixed(1) : '--'}%
                </div>
                <div className="text-xs text-muted-foreground">Success Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Status */}
      {isRunning && (
        <Card className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-blue-700 dark:text-blue-300">
              <Zap className="h-4 w-4 animate-pulse" />
              Migration In Progress
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-sm">Real-time processing with optimizations active</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Live</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Optimization Details */}
      {result?.optimizationStats && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-4 w-4 text-purple-500" />
              Smart Optimization Details
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="text-lg font-semibold">
                  {formatNumber(result.optimizationStats.totalRecords)}
                </div>
                <div className="text-muted-foreground">Total Records</div>
              </div>
              
              <div className="text-center">
                <div className="text-lg font-semibold text-green-600">
                  {formatNumber(result.optimizationStats.bloomFilterHits)}
                </div>
                <div className="text-muted-foreground">Bloom Hits</div>
              </div>
              
              <div className="text-center">
                <div className="text-lg font-semibold text-blue-600">
                  {formatNumber(result.optimizationStats.bloomFilterMisses)}
                </div>
                <div className="text-muted-foreground">Bloom Misses</div>
              </div>
              
              <div className="text-center">
                <div className="text-lg font-semibold text-orange-600">
                  {formatTime(result.optimizationStats.timeSaved)}
                </div>
                <div className="text-muted-foreground">Time Saved</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProductionPerformanceMetricsComponent;
