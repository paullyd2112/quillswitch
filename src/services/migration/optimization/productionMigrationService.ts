
import { DashboardConfig } from "../dashboard";
import { ProductionMigrationConfig, ProductionMigrationResult, ProductionPerformanceMetrics } from './types';
import { MigrationExecutor } from './migrationExecutor';

/**
 * Production Migration Service with Advanced Performance Optimizations
 * Main service class that orchestrates enterprise-grade migration optimizations
 */
export class ProductionMigrationService {
  private static instance: ProductionMigrationService;
  private migrationExecutor: MigrationExecutor;

  public static getInstance(): ProductionMigrationService {
    if (!ProductionMigrationService.instance) {
      ProductionMigrationService.instance = new ProductionMigrationService();
    }
    return ProductionMigrationService.instance;
  }

  constructor() {
    this.migrationExecutor = new MigrationExecutor();
  }

  /**
   * Execute production-optimized dashboard migration
   */
  async executeProductionMigration(
    dashboards: DashboardConfig[],
    config: ProductionMigrationConfig,
    onProgress?: (progress: number, metrics: ProductionPerformanceMetrics) => void
  ): Promise<ProductionMigrationResult[]> {
    return this.migrationExecutor.executeMigration(dashboards, config, onProgress);
  }

  /**
   * Get current performance metrics
   */
  getPerformanceMetrics(): ProductionPerformanceMetrics {
    return this.migrationExecutor.getPerformanceMetrics();
  }

  /**
   * Reset performance metrics
   */
  resetMetrics(): void {
    this.migrationExecutor.resetMetrics();
  }
}

// Factory function for creating production migration service
export const createProductionMigrationService = (config: ProductionMigrationConfig): ProductionMigrationService => {
  return ProductionMigrationService.getInstance();
};

// Singleton instance export
export const productionMigrationService = ProductionMigrationService.getInstance();
