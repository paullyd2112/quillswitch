
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, Zap, Shield, Activity, Database } from 'lucide-react';
import { ProductionMigrationConfig } from '@/services/migration/optimization/productionMigrationService';

interface ProductionMigrationControlsProps {
  onStartMigration: (config: ProductionMigrationConfig) => void;
  isRunning: boolean;
}

const ProductionMigrationControls: React.FC<ProductionMigrationControlsProps> = ({
  onStartMigration,
  isRunning
}) => {
  const [config, setConfig] = useState<ProductionMigrationConfig>({
    // Required base properties
    projectId: 'demo_project',
    sourceSystem: 'salesforce',
    destinationSystem: 'hubspot',
    batchSize: 100,
    concurrentBatches: 4,
    enableCaching: true,
    enableBloomFilter: true,
    enableCompression: true,
    streamingThreshold: 1000,
    maxMemoryUsage: 512,
    
    // Feature flags
    enableSchemaCache: true,
    enableSmartDelta: true,
    enableStreaming: true,
    enableAdvancedConcurrency: true,
    
    optimization: {
      enableBloomFilter: true,
      bloomFilterSize: 1000000,
      hashFunctions: 3,
      safetyLevel: 'balanced',
      auditTrail: true,
      fallbackThreshold: 0.05
    },
    streaming: {
      chunkSize: 100,
      maxConcurrentStreams: 8,
      backpressureThreshold: 1000,
      bufferSize: 5000
    },
    concurrency: {
      type: 'adaptive',
      maxWorkers: 8,
      queueSize: 1000,
      timeoutMs: 30000,
      retryPolicy: {
        maxAttempts: 3,
        baseDelayMs: 1000,
        maxDelayMs: 10000,
        backoffMultiplier: 2,
        jitterMs: 500
      }
    }
  });

  const updateConfig = (updates: Partial<ProductionMigrationConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const getOptimizationCount = () => {
    let count = 0;
    if (config.enableSchemaCache) count++;
    if (config.enableSmartDelta) count++;
    if (config.enableStreaming) count++;
    if (config.enableAdvancedConcurrency) count++;
    return count;
  };

  const getPerformanceLevel = () => {
    const optimizations = getOptimizationCount();
    if (optimizations === 4) return { level: 'Maximum', color: 'bg-green-500' };
    if (optimizations === 3) return { level: 'High', color: 'bg-blue-500' };
    if (optimizations === 2) return { level: 'Medium', color: 'bg-yellow-500' };
    return { level: 'Basic', color: 'bg-gray-500' };
  };

  const performance = getPerformanceLevel();

  return (
    <Card className="shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-500" />
            Production Migration Controls
          </CardTitle>
          <Badge className={performance.color}>
            {performance.level} Performance
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Core Optimizations */}
        <div className="space-y-4">
          <h4 className="font-medium flex items-center gap-2">
            <Database className="h-4 w-4" />
            Core Optimizations
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="schema-cache">Pre-compiled Schema Cache</Label>
                <p className="text-sm text-muted-foreground">Eliminates runtime mapping calculations</p>
              </div>
              <Switch
                id="schema-cache"
                checked={config.enableSchemaCache}
                onCheckedChange={(checked) => updateConfig({ enableSchemaCache: checked })}
                disabled={isRunning}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="smart-delta">Smart Data Optimization</Label>
                <p className="text-sm text-muted-foreground">Bloom filters for duplicate detection</p>
              </div>
              <Switch
                id="smart-delta"
                checked={config.enableSmartDelta}
                onCheckedChange={(checked) => updateConfig({ enableSmartDelta: checked })}
                disabled={isRunning}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="streaming">GraphQL Streaming</Label>
                <p className="text-sm text-muted-foreground">Real-time data flow processing</p>
              </div>
              <Switch
                id="streaming"
                checked={config.enableStreaming}
                onCheckedChange={(checked) => updateConfig({ enableStreaming: checked })}
                disabled={isRunning}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="concurrency">Advanced Concurrency</Label>
                <p className="text-sm text-muted-foreground">Adaptive parallel processing</p>
              </div>
              <Switch
                id="concurrency"
                checked={config.enableAdvancedConcurrency}
                onCheckedChange={(checked) => updateConfig({ enableAdvancedConcurrency: checked })}
                disabled={isRunning}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Safety Configuration */}
        <div className="space-y-4">
          <h4 className="font-medium flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Safety Configuration
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="safety-level">Safety Level</Label>
              <Select
                value={config.optimization.safetyLevel}
                onValueChange={(value: 'conservative' | 'balanced' | 'aggressive') => 
                  updateConfig({
                    optimization: { ...config.optimization, safetyLevel: value }
                  })
                }
                disabled={isRunning}
              >
                <SelectTrigger id="safety-level">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="conservative">Conservative (100% verification)</SelectItem>
                  <SelectItem value="balanced">Balanced (10% verification)</SelectItem>
                  <SelectItem value="aggressive">Aggressive (1% verification)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="concurrency-type">Concurrency Pattern</Label>
              <Select
                value={config.concurrency.type}
                onValueChange={(value: 'pipeline' | 'fanout' | 'adaptive' | 'circuit-breaker') => 
                  updateConfig({
                    concurrency: { ...config.concurrency, type: value }
                  })
                }
                disabled={isRunning}
              >
                <SelectTrigger id="concurrency-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="adaptive">Adaptive (Recommended)</SelectItem>
                  <SelectItem value="pipeline">Pipeline</SelectItem>
                  <SelectItem value="fanout">Fan-out</SelectItem>
                  <SelectItem value="circuit-breaker">Circuit Breaker</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Separator />

        {/* Performance Tuning */}
        <div className="space-y-4">
          <h4 className="font-medium flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Performance Tuning
          </h4>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <Label>Chunk Size</Label>
              <div className="text-muted-foreground">{config.streaming.chunkSize}</div>
            </div>
            <div>
              <Label>Max Workers</Label>
              <div className="text-muted-foreground">{config.concurrency.maxWorkers}</div>
            </div>
            <div>
              <Label>Bloom Filter Size</Label>
              <div className="text-muted-foreground">{(config.optimization.bloomFilterSize / 1000000).toFixed(1)}M</div>
            </div>
            <div>
              <Label>Retry Attempts</Label>
              <div className="text-muted-foreground">{config.concurrency.retryPolicy.maxAttempts}</div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Warning and Action */}
        <div className="space-y-4">
          <div className="flex items-start gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-md">
            <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-yellow-800 dark:text-yellow-200">Production Mode Active</p>
              <p className="text-yellow-700 dark:text-yellow-300">
                This configuration uses advanced optimizations for maximum performance. 
                Monitor system resources during migration.
              </p>
            </div>
          </div>
          
          <Button 
            onClick={() => onStartMigration(config)}
            disabled={isRunning}
            className="w-full"
            size="lg"
          >
            {isRunning ? 'Migration Running...' : 'Start Production Migration'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductionMigrationControls;
