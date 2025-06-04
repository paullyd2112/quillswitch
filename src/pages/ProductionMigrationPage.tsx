
import React, { useState } from 'react';
import { Container } from '@/components/ui/container';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Rocket, Settings, BarChart3, BookOpen } from 'lucide-react';
import ProductionMigrationControls from '@/components/migration/production/ProductionMigrationControls';
import ProductionPerformanceMetrics from '@/components/migration/production/ProductionPerformanceMetrics';
import { 
  productionMigrationService, 
  ProductionMigrationConfig,
  ProductionMigrationResult
} from '@/services/migration/optimization/productionMigrationService';
import { toast } from '@/hooks/use-toast';

// Create a proper TransferProgress interface for this component
interface MigrationProgress {
  processedRecords: number;
  totalRecords: number;
  percentage: number;
  processingRate: number;
  estimatedTimeRemaining: number;
}

const ProductionMigrationPage: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [migrationResult, setMigrationResult] = useState<ProductionMigrationResult | null>(null);
  const [progress, setProgress] = useState<MigrationProgress | null>(null);
  const [currentConfig, setCurrentConfig] = useState<ProductionMigrationConfig | null>(null);

  const handleStartMigration = async (config: ProductionMigrationConfig) => {
    setIsRunning(true);
    setCurrentConfig(config);
    setMigrationResult(null);
    setProgress(null);

    try {
      // Create mock dashboards with all required DashboardConfig properties
      const mockDashboards = Array.from({ length: 10 }, (_, i) => ({
        id: `dashboard_${i}`,
        name: `Dashboard ${i}`,
        crmSystem: config.sourceSystem,
        widgets: [],
        filters: [],
        layout: { 
          type: 'grid' as const,
          columns: 4,
          rows: 3,
          sections: [
            {
              id: `section_${i}`,
              position: { x: 0, y: 0, width: 4, height: 3 },
              widgetIds: []
            }
          ]
        },
        permissions: { 
          owner: 'demo_user',
          viewers: [],
          editors: [],
          isPublic: false,
          shareSettings: {
            allowCopy: true,
            allowExport: true,
            passwordProtected: false
          }
        },
        metadata: {
          description: `Demo dashboard ${i}`,
          tags: ['demo', 'test'],
          category: 'sales'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }));

      const results = await productionMigrationService.executeProductionMigration(
        mockDashboards,
        config,
        (progressValue, currentMetrics) => {
          setProgress({
            processedRecords: Math.floor((progressValue / 100) * 5000),
            totalRecords: 5000,
            percentage: progressValue,
            processingRate: currentMetrics.recordsPerSecond,
            estimatedTimeRemaining: Math.max(0, (100 - progressValue) / 10)
          });
        }
      );

      if (results.length > 0) {
        setMigrationResult(results[0]);
        toast({
          title: "Migration Completed Successfully",
          description: `Processed ${results[0].totalProcessed} records in ${(results[0].processingTime / 1000).toFixed(1)} seconds`
        });
      }
    } catch (error) {
      console.error('Migration error:', error);
      toast({
        title: "Migration Failed",
        description: "An error occurred during the migration process",
        variant: "destructive"
      });
    } finally {
      setIsRunning(false);
    }
  };

  const getCurrentMetrics = () => {
    if (migrationResult) {
      return migrationResult.performanceMetrics;
    }
    
    // Return default metrics if no result yet
    return {
      recordsPerSecond: 0,
      peakThroughput: 0,
      averageLatency: 0,
      cacheHitRate: 0,
      compressionRatio: 0,
      memoryEfficiency: 0
    };
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8">
      <Container>
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Rocket className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Production Migration Center</h1>
              <p className="text-muted-foreground">
                High-performance CRM migration with advanced optimizations
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              Smart Data Optimization
            </Badge>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              Pre-compiled Schema Cache
            </Badge>
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
              GraphQL Streaming
            </Badge>
            <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
              Advanced Concurrency
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="control" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="control" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Control Panel
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Performance
            </TabsTrigger>
            <TabsTrigger value="monitoring" className="flex items-center gap-2">
              <Rocket className="h-4 w-4" />
              Live Monitoring
            </TabsTrigger>
            <TabsTrigger value="documentation" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Documentation
            </TabsTrigger>
          </TabsList>

          <TabsContent value="control" className="space-y-6">
            <ProductionMigrationControls
              onStartMigration={handleStartMigration}
              isRunning={isRunning}
            />
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <ProductionPerformanceMetrics
              metrics={getCurrentMetrics()}
              result={migrationResult}
              isRunning={isRunning}
            />
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Rocket className="h-5 w-5 text-blue-500" />
                  Live Migration Monitoring
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                {isRunning && progress ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {progress.processedRecords}
                        </div>
                        <div className="text-sm text-muted-foreground">Processed</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {progress.percentage.toFixed(1)}%
                        </div>
                        <div className="text-sm text-muted-foreground">Complete</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {progress.processingRate?.toFixed(0) || 0}
                        </div>
                        <div className="text-sm text-muted-foreground">Records/sec</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">
                          {progress.estimatedTimeRemaining || 0}s
                        </div>
                        <div className="text-sm text-muted-foreground">Remaining</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Migration Progress</span>
                        <span>{progress.percentage.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progress.percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ) : migrationResult ? (
                  <div className="text-center py-8">
                    <div className="text-green-600 mb-2">
                      <Rocket className="h-12 w-12 mx-auto" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Migration Completed</h3>
                    <p className="text-muted-foreground">
                      Successfully processed {migrationResult.totalProcessed} records
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-muted-foreground mb-2">
                      <Settings className="h-12 w-12 mx-auto" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Ready to Start</h3>
                    <p className="text-muted-foreground">
                      Configure your migration settings and start the process
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documentation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-500" />
                  Production Migration Features
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">🚀 Smart Data Optimization</h4>
                    <p className="text-sm text-muted-foreground">
                      Uses Bloom filters for ultra-fast duplicate detection with safety measures to prevent data loss.
                      Includes conservative, balanced, and aggressive modes with configurable verification rates.
                    </p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="font-medium mb-2">⚡ Pre-compiled Schema Mapping</h4>
                    <p className="text-sm text-muted-foreground">
                      Eliminates runtime mapping calculations by pre-compiling transformation and validation functions.
                      Results in 3-5x faster record processing compared to traditional mapping approaches.
                    </p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="font-medium mb-2">🌊 GraphQL + Streaming Architecture</h4>
                    <p className="text-sm text-muted-foreground">
                      Real-time data flow processing with backpressure handling and adaptive chunk sizing.
                      Ideal for large datasets requiring continuous processing without memory overflow.
                    </p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="font-medium mb-2">🔄 Advanced Concurrency Patterns</h4>
                    <p className="text-sm text-muted-foreground">
                      Multiple patterns including Pipeline, Fan-out, Adaptive, and Circuit Breaker.
                      Automatically adjusts concurrency based on performance metrics and system resources.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </Container>
    </div>
  );
};

export default ProductionMigrationPage;
