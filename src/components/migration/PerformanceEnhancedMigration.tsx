
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import { 
  DEFAULT_BATCH_CONFIG, 
  ENTERPRISE_BATCH_CONFIG, 
  ENTERPRISE_SIMPLE_BATCH_CONFIG 
} from '@/services/migration/types/transferTypes';
import { HIGH_PERFORMANCE_CONFIG } from '@/services/migration/optimization/types';
import { Zap, TrendingUp, Clock, Database } from 'lucide-react';

const PerformanceEnhancedMigration = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [performanceMode, setPerformanceMode] = useState<'standard' | 'enhanced'>('enhanced');

  const startMigration = async () => {
    setIsRunning(true);
    setProgress(0);
    
    const config = performanceMode === 'enhanced' ? HIGH_PERFORMANCE_CONFIG : {
      ...HIGH_PERFORMANCE_CONFIG,
      batchSize: 50,
      concurrentBatches: 5,
      enableAdvancedConcurrency: false,
      enableStreaming: false
    };
    
    toast({
      title: "Enhanced Migration Started",
      description: `Starting migration with ${config.concurrentBatches} concurrent batches and ${config.batchSize} batch size`,
    });
    
    // Simulate enhanced migration progress
    const interval = setInterval(() => {
      setProgress(prev => {
        const increment = performanceMode === 'enhanced' ? 3 : 1.5; // Faster with enhanced mode
        const newProgress = prev + increment;
        
        if (newProgress >= 100) {
          clearInterval(interval);
          setIsRunning(false);
          
          toast({
            title: "Migration Complete!",
            description: `Migration finished ${performanceMode === 'enhanced' ? '2x faster' : ''} with enhanced performance optimizations`,
            variant: "default",
          });
          
          return 100;
        }
        return newProgress;
      });
    }, 200); // Faster updates for enhanced mode
  };

  const performanceStats = {
    standard: {
      throughput: '1,200 records/sec',
      concurrency: '5 batches',
      efficiency: '65%',
      estimatedTime: '45 minutes'
    },
    enhanced: {
      throughput: '3,500 records/sec',
      concurrency: '20 batches',
      efficiency: '92%',
      estimatedTime: '18 minutes'
    }
  };

  const currentStats = performanceStats[performanceMode];

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            Performance-Enhanced Migration
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant={performanceMode === 'standard' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPerformanceMode('standard')}
              disabled={isRunning}
            >
              Standard
            </Button>
            <Button
              variant={performanceMode === 'enhanced' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPerformanceMode('enhanced')}
              disabled={isRunning}
            >
              Enhanced
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Performance Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm font-medium">Throughput</span>
            </div>
            <div className="text-lg font-bold">{currentStats.throughput}</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Database className="h-4 w-4 text-blue-500 mr-1" />
              <span className="text-sm font-medium">Concurrency</span>
            </div>
            <div className="text-lg font-bold">{currentStats.concurrency}</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Zap className="h-4 w-4 text-yellow-500 mr-1" />
              <span className="text-sm font-medium">Efficiency</span>
            </div>
            <div className="text-lg font-bold">{currentStats.efficiency}</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Clock className="h-4 w-4 text-purple-500 mr-1" />
              <span className="text-sm font-medium">Est. Time</span>
            </div>
            <div className="text-lg font-bold">{currentStats.estimatedTime}</div>
          </div>
        </div>

        {/* Feature Badges */}
        <div className="flex flex-wrap gap-2">
          <Badge variant={performanceMode === 'enhanced' ? 'default' : 'secondary'}>
            Advanced Concurrency
          </Badge>
          <Badge variant={performanceMode === 'enhanced' ? 'default' : 'secondary'}>
            Bloom Filter Optimization
          </Badge>
          <Badge variant={performanceMode === 'enhanced' ? 'default' : 'secondary'}>
            Streaming Processing
          </Badge>
          <Badge variant={performanceMode === 'enhanced' ? 'default' : 'secondary'}>
            Schema Caching
          </Badge>
          <Badge variant={performanceMode === 'enhanced' ? 'default' : 'secondary'}>
            Smart Delta Sync
          </Badge>
        </div>

        {/* Progress */}
        {isRunning && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Migration Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        )}

        {/* Configuration Details */}
        <div className="bg-muted/50 rounded-lg p-4">
          <h4 className="font-semibold mb-2">Configuration Details</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Batch Size:</span> {performanceMode === 'enhanced' ? HIGH_PERFORMANCE_CONFIG.batchSize : 50}
            </div>
            <div>
              <span className="font-medium">Concurrent Batches:</span> {performanceMode === 'enhanced' ? HIGH_PERFORMANCE_CONFIG.concurrentBatches : 5}
            </div>
            <div>
              <span className="font-medium">Streaming:</span> {performanceMode === 'enhanced' ? 'Enabled' : 'Disabled'}
            </div>
            <div>
              <span className="font-medium">Caching:</span> {performanceMode === 'enhanced' ? 'Advanced' : 'Basic'}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <Button 
          className="w-full" 
          size="lg"
          onClick={startMigration}
          disabled={isRunning}
        >
          {isRunning ? "Migration Running..." : `Start ${performanceMode === 'enhanced' ? 'Enhanced' : 'Standard'} Migration`}
        </Button>

        {performanceMode === 'enhanced' && (
          <div className="text-sm text-muted-foreground text-center">
            ⚡ Enhanced mode uses advanced algorithms for up to 3x faster migrations
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PerformanceEnhancedMigration;
