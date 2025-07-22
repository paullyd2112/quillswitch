
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
  
  // Enhanced optimization properties
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

// Default high-performance configuration
export const HIGH_PERFORMANCE_CONFIG: ProductionMigrationConfig = {
  projectId: '',
  sourceSystem: '',
  destinationSystem: '',
  batchSize: 250,
  concurrentBatches: 20,
  enableCaching: true,
  enableBloomFilter: true,
  enableCompression: true,
  streamingThreshold: 10000,
  maxMemoryUsage: 512,
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
    fallbackThreshold: 0.1
  },
  streaming: {
    chunkSize: 1000,
    maxConcurrentStreams: 5,
    backpressureThreshold: 5000,
    bufferSize: 10000
  },
  concurrency: {
    type: 'adaptive',
    maxWorkers: 20,
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
};
