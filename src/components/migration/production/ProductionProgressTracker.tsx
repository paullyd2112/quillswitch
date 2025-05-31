
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Activity, 
  Clock, 
  TrendingUp, 
  Database,
  Zap,
  CheckCircle
} from 'lucide-react';
import { TransferProgress } from '@/services/migration/types/transferTypes';

interface ProductionProgressTrackerProps {
  progress: TransferProgress;
  startTime: Date;
  optimizationsUsed: string[];
}

const ProductionProgressTracker: React.FC<ProductionProgressTrackerProps> = ({
  progress,
  startTime,
  optimizationsUsed
}) => {
  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  };

  const getElapsedTime = () => {
    return Date.now() - startTime.getTime();
  };

  const getETA = () => {
    if (!progress.processingRate || progress.processingRate === 0) return 'Calculating...';
    
    const remainingRecords = progress.totalRecords - progress.processedRecords;
    const etaSeconds = remainingRecords / progress.processingRate;
    
    return formatDuration(etaSeconds * 1000);
  };

  const getProgressColor = () => {
    if (progress.percentage >= 90) return 'bg-green-500';
    if (progress.percentage >= 50) return 'bg-blue-500';
    return 'bg-orange-500';
  };

  return (
    <div className="space-y-4">
      {/* Main Progress Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-500" />
            Migration Progress
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Overall Progress</span>
              <span className="font-medium">{progress.percentage.toFixed(1)}%</span>
            </div>
            <Progress value={progress.percentage} className="h-3" />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{progress.processedRecords.toLocaleString()} processed</span>
              <span>{progress.totalRecords.toLocaleString()} total</span>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {progress.processingRate?.toFixed(0) || 0}
              </div>
              <div className="text-sm text-muted-foreground">Records/sec</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {formatDuration(getElapsedTime())}
              </div>
              <div className="text-sm text-muted-foreground">Elapsed</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {getETA()}
              </div>
              <div className="text-sm text-muted-foreground">ETA</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {progress.failedRecords}
              </div>
              <div className="text-sm text-muted-foreground">Failed</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Batch Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Database className="h-4 w-4 text-green-500" />
            Batch Processing
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Current Batch</span>
              <Badge variant="outline">
                {progress.currentBatch || 0} / {progress.totalBatches || 0}
              </Badge>
            </div>
            
            {progress.totalBatches && (
              <Progress 
                value={((progress.currentBatch || 0) / progress.totalBatches) * 100} 
                className="h-2" 
              />
            )}
            
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="font-semibold">{progress.currentBatch || 0}</div>
                <div className="text-muted-foreground">Current</div>
              </div>
              <div className="text-center">
                <div className="font-semibold">{progress.totalBatches || 0}</div>
                <div className="text-muted-foreground">Total Batches</div>
              </div>
              <div className="text-center">
                <div className="font-semibold">
                  {progress.totalBatches && progress.currentBatch 
                    ? progress.totalBatches - progress.currentBatch 
                    : 0}
                </div>
                <div className="text-muted-foreground">Remaining</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Optimizations Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Zap className="h-4 w-4 text-yellow-500" />
            Active Optimizations
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-3">
            {optimizationsUsed.map((optimization) => (
              <div key={optimization} className="flex items-center gap-3">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">{optimization}</span>
                <Badge variant="secondary" className="ml-auto">
                  Active
                </Badge>
              </div>
            ))}
            
            {optimizationsUsed.length === 0 && (
              <div className="text-center text-muted-foreground">
                No optimizations active
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Performance Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="h-4 w-4 text-purple-500" />
            Performance Insights
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-3 text-sm">
            {progress.processingRate && progress.processingRate > 500 && (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span>Excellent processing speed detected</span>
              </div>
            )}
            
            {progress.failedRecords === 0 && progress.processedRecords > 100 && (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span>Zero errors - high data quality</span>
              </div>
            )}
            
            {progress.failedRecords > progress.processedRecords * 0.05 && (
              <div className="flex items-center gap-2 text-orange-600">
                <Clock className="h-4 w-4" />
                <span>High error rate detected - review mappings</span>
              </div>
            )}
            
            {progress.processingRate && progress.processingRate < 50 && (
              <div className="flex items-center gap-2 text-orange-600">
                <Clock className="h-4 w-4" />
                <span>Consider enabling more optimizations</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductionProgressTracker;
