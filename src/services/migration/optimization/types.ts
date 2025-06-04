
/**
 * Types and interfaces for production migration optimization
 */

export interface ProductionMigrationConfig {
  projectId: string;
  sourceSystem: string;
  destinationSystem: string;
  batchSize: number;
  concurrentBatches: number;
  enableCaching: boolean;
  enableBloomFilter: boolean;
  enableCompression: boolean;
  streamingThreshold: number; // Records count threshold for streaming
  maxMemoryUsage: number; // MB
  
  // New properties that components expect
  enableSchemaCache: boolean;
  enableSmartDelta: boolean;
  enableStreaming: boolean;
  enableAdvancedConcurrency: boolean;
  
  optimization: {
    enableBloomFilter: boolean;
    bloomFilterSize: number;
    hashFunctions: number;
    safetyLevel: 'conservative' | 'balanced' | 'aggressive';
    auditTrail: boolean;
    fallbackThreshold: number;
  };
  
  streaming: {
    chunkSize: number;
    maxConcurrentStreams: number;
    backpressureThreshold: number;
    bufferSize: number;
  };
  
  concurrency: {
    type: 'pipeline' | 'fanout' | 'adaptive' | 'circuit-breaker';
    maxWorkers: number;
    queueSize: number;
    timeoutMs: number;
    retryPolicy: {
      maxAttempts: number;
      baseDelayMs: number;
      maxDelayMs: number;
      backoffMultiplier: number;
      jitterMs: number;
    };
  };
}

export interface ProductionPerformanceMetrics {
  recordsPerSecond: number;
  peakThroughput: number;
  averageLatency: number;
  cacheHitRate: number;
  compressionRatio: number;
  memoryEfficiency: number;
}

export interface ProductionMigrationResult {
  sourceConfig: any;
  destinationConfig: any;
  mappingResults: any[];
  migrationStatus: 'success' | 'partial' | 'failed';
  warnings: string[];
  errors: string[];
  unsupportedFeatures: string[];
  processingTime: number;
  totalProcessed: number;
  totalSkipped: number;
  totalErrors: number;
  performanceMetrics: ProductionPerformanceMetrics;
  optimizationStats: {
    totalRecords: number;
    bloomFilterHits: number;
    bloomFilterMisses: number;
    timeSaved: number;
  };
}
