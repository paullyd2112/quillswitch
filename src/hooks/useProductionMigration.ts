import { useState, useCallback } from 'react';
import { 
  productionMigrationService
} from '@/services/migration/optimization';
import { 
  ProductionMigrationConfig,
  ProductionMigrationResult,
  ProductionPerformanceMetrics
} from '@/services/migration/optimization';
import { DashboardConfig } from '@/services/migration/dashboard';
import { toast } from 'sonner';

export const useProductionMigration = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<ProductionMigrationResult[]>([]);
  const [metrics, setMetrics] = useState<ProductionPerformanceMetrics>({
    recordsPerSecond: 0,
    peakThroughput: 0,
    averageLatency: 0,
    cacheHitRate: 0,
    compressionRatio: 0,
    memoryEfficiency: 0
  });

  const executeMigration = useCallback(async (
    dashboards: DashboardConfig[],
    config: ProductionMigrationConfig
  ) => {
    if (isRunning) {
      toast.error('Migration already in progress');
      return;
    }

    setIsRunning(true);
    setProgress(0);
    setResults([]);
    
    try {
      console.log('🚀 Starting production migration...');
      toast.success('Production migration started');
      
      const migrationResults = await productionMigrationService.executeProductionMigration(
        dashboards,
        config,
        (progressValue, currentMetrics) => {
          setProgress(progressValue);
          setMetrics(currentMetrics);
        }
      );
      
      setResults(migrationResults);
      setProgress(100);
      
      const summary = migrationResults[0]; // First result is summary
      toast.success(
        `Migration completed! Processed: ${summary.totalProcessed}, ` +
        `Skipped: ${summary.totalSkipped}, Errors: ${summary.totalErrors}`
      );
      
      return migrationResults;
    } catch (error) {
      console.error('Production migration failed:', error);
      toast.error('Production migration failed');
      throw error;
    } finally {
      setIsRunning(false);
    }
  }, [isRunning]);

  const resetMigration = useCallback(() => {
    setIsRunning(false);
    setProgress(0);
    setResults([]);
    productionMigrationService.resetMetrics();
    setMetrics({
      recordsPerSecond: 0,
      peakThroughput: 0,
      averageLatency: 0,
      cacheHitRate: 0,
      compressionRatio: 0,
      memoryEfficiency: 0
    });
  }, []);

  return {
    isRunning,
    progress,
    results,
    metrics,
    executeMigration,
    resetMigration
  };
};
