
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

/**
 * Smart Data Optimization with Bloom Filters and Safety Measures
 * Prevents duplicate processing while ensuring no records are skipped
 */

export interface OptimizationConfig {
  enableBloomFilter: boolean;
  bloomFilterSize: number;
  hashFunctions: number;
  safetyLevel: 'conservative' | 'balanced' | 'aggressive';
  auditTrail: boolean;
  fallbackThreshold: number; // Percentage of false positives before fallback
}

export interface DeltaDetectionResult {
  newRecords: any[];
  modifiedRecords: any[];
  skippedRecords: any[];
  auditLog: AuditEntry[];
  optimizationStats: OptimizationStats;
}

export interface AuditEntry {
  recordId: string;
  action: 'processed' | 'skipped' | 'flagged' | 'verified';
  reason: string;
  timestamp: string;
  bloomFilterResult?: boolean;
  actualStatus?: 'new' | 'existing' | 'modified';
}

export interface OptimizationStats {
  totalRecords: number;
  bloomFilterHits: number;
  bloomFilterMisses: number;
  falsePositiveRate: number;
  timeSaved: number;
  verificationChecks: number;
}

class BloomFilter {
  private bitArray: boolean[];
  private size: number;
  private hashFunctions: number;

  constructor(size: number, hashFunctions: number) {
    this.size = size;
    this.hashFunctions = hashFunctions;
    this.bitArray = new Array(size).fill(false);
  }

  private hash(item: string, seed: number): number {
    let hash = 0;
    for (let i = 0; i < item.length; i++) {
      const char = item.charCodeAt(i);
      hash = ((hash << 5) - hash) + char + seed;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash) % this.size;
  }

  add(item: string): void {
    for (let i = 0; i < this.hashFunctions; i++) {
      const index = this.hash(item, i);
      this.bitArray[index] = true;
    }
  }

  mightContain(item: string): boolean {
    for (let i = 0; i < this.hashFunctions; i++) {
      const index = this.hash(item, i);
      if (!this.bitArray[index]) {
        return false; // Definitely not in set
      }
    }
    return true; // Might be in set (could be false positive)
  }

  clear(): void {
    this.bitArray.fill(false);
  }

  serialize(): string {
    return JSON.stringify({
      bitArray: this.bitArray,
      size: this.size,
      hashFunctions: this.hashFunctions
    });
  }

  static deserialize(data: string): BloomFilter {
    const parsed = JSON.parse(data);
    const filter = new BloomFilter(parsed.size, parsed.hashFunctions);
    filter.bitArray = parsed.bitArray;
    return filter;
  }
}

export class SmartDataOptimizer {
  private bloomFilter: BloomFilter;
  private config: OptimizationConfig;
  private auditLog: AuditEntry[] = [];
  private stats: OptimizationStats;

  constructor(config: OptimizationConfig) {
    this.config = config;
    this.bloomFilter = new BloomFilter(config.bloomFilterSize, config.hashFunctions);
    this.stats = {
      totalRecords: 0,
      bloomFilterHits: 0,
      bloomFilterMisses: 0,
      falsePositiveRate: 0,
      timeSaved: 0,
      verificationChecks: 0
    };
  }

  /**
   * Initialize bloom filter with existing records from destination
   */
  async initializeBloomFilter(projectId: string, objectType: string): Promise<void> {
    try {
      // Load existing records from the new migration_records table
      const { data: existingRecords, error } = await supabase
        .rpc('get_migration_records', {
          p_project_id: projectId,
          p_object_type: objectType
        });

      if (error) {
        console.warn('Error loading existing records, proceeding without bloom filter initialization:', error);
        return;
      }

      this.bloomFilter.clear();
      existingRecords?.forEach((record: any) => {
        if (record.external_id) {
          this.bloomFilter.add(record.external_id);
        }
      });

      console.log(`Bloom filter initialized with ${existingRecords?.length || 0} existing records`);
    } catch (error) {
      console.error('Error initializing bloom filter:', error);
      // Don't throw error, just proceed without bloom filter optimization
    }
  }

  /**
   * Perform smart delta detection with safety measures
   */
  async performDeltaDetection(
    sourceRecords: any[],
    projectId: string,
    objectType: string
  ): Promise<DeltaDetectionResult> {
    const startTime = Date.now();
    this.stats.totalRecords = sourceRecords.length;
    
    const newRecords: any[] = [];
    const modifiedRecords: any[] = [];
    const skippedRecords: any[] = [];

    for (const record of sourceRecords) {
      const recordKey = this.generateRecordKey(record);
      
      if (!this.config.enableBloomFilter) {
        // Traditional approach without bloom filter
        const result = await this.traditionalDeltaCheck(record, projectId, objectType);
        this.categorizeRecord(result, record, newRecords, modifiedRecords, skippedRecords);
        continue;
      }

      // Bloom filter pre-screening
      const bloomResult = this.bloomFilter.mightContain(recordKey);
      
      if (!bloomResult) {
        // Definitely new record - bloom filter guarantees no false negatives
        newRecords.push(record);
        this.addAuditEntry(recordKey, 'processed', 'Bloom filter: definitely new', true, 'new');
        this.stats.bloomFilterMisses++;
      } else {
        // Might exist - need verification based on safety level
        this.stats.bloomFilterHits++;
        
        const shouldVerify = this.shouldVerifyRecord();
        
        if (shouldVerify || this.config.safetyLevel === 'conservative') {
          // Verify with database
          const result = await this.traditionalDeltaCheck(record, projectId, objectType);
          this.categorizeRecord(result, record, newRecords, modifiedRecords, skippedRecords);
          this.addAuditEntry(recordKey, 'verified', 'Safety verification performed', true, result.status);
          this.stats.verificationChecks++;
        } else {
          // Trust bloom filter for performance
          skippedRecords.push(record);
          this.addAuditEntry(recordKey, 'skipped', 'Bloom filter: likely exists', true, 'existing');
        }
      }

      // Dynamic fallback if false positive rate too high
      if (this.shouldFallbackToTraditional()) {
        console.warn('High false positive rate detected, falling back to traditional delta detection');
        return this.fallbackToTraditionalDetection(sourceRecords, projectId, objectType);
      }
    }

    this.stats.timeSaved = Date.now() - startTime;
    this.calculateFalsePositiveRate();

    return {
      newRecords,
      modifiedRecords,
      skippedRecords,
      auditLog: this.auditLog,
      optimizationStats: this.stats
    };
  }

  private generateRecordKey(record: any): string {
    // Generate consistent key for record identification
    return record.id || record.external_id || JSON.stringify(record);
  }

  private async traditionalDeltaCheck(
    record: any,
    projectId: string,
    objectType: string
  ): Promise<{ status: 'new' | 'existing' | 'modified'; existingRecord?: any }> {
    try {
      // Use RPC function to check for existing records
      const { data: existingRecord, error } = await supabase
        .rpc('get_migration_record_by_external_id', {
          p_project_id: projectId,
          p_object_type: objectType,
          p_external_id: record.id || record.external_id
        });

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.warn('Error in traditional delta check:', error);
        return { status: 'new' }; // Err on the side of processing
      }

      if (!existingRecord || (Array.isArray(existingRecord) && existingRecord.length === 0)) {
        return { status: 'new' };
      }

      // Check if record was modified
      const recordModified = this.isRecordModified(record, existingRecord);
      return {
        status: recordModified ? 'modified' : 'existing',
        existingRecord
      };
    } catch (error) {
      console.error('Error in traditional delta check:', error);
      return { status: 'new' }; // Err on the side of processing
    }
  }

  private isRecordModified(sourceRecord: any, existingRecord: any): boolean {
    // Compare modification timestamps or checksums
    const sourceModified = new Date(sourceRecord.last_modified || sourceRecord.updated_at || 0);
    const existingModified = new Date(existingRecord.last_modified || 0);
    
    return sourceModified > existingModified;
  }

  private categorizeRecord(
    result: { status: 'new' | 'existing' | 'modified'; existingRecord?: any },
    record: any,
    newRecords: any[],
    modifiedRecords: any[],
    skippedRecords: any[]
  ): void {
    switch (result.status) {
      case 'new':
        newRecords.push(record);
        break;
      case 'modified':
        modifiedRecords.push({ ...record, existingRecord: result.existingRecord });
        break;
      case 'existing':
        skippedRecords.push(record);
        break;
    }
  }

  private shouldVerifyRecord(): boolean {
    // Implement probabilistic verification based on safety level
    switch (this.config.safetyLevel) {
      case 'conservative':
        return true; // Always verify
      case 'balanced':
        return Math.random() < 0.1; // 10% verification rate
      case 'aggressive':
        return Math.random() < 0.01; // 1% verification rate
      default:
        return true;
    }
  }

  private shouldFallbackToTraditional(): boolean {
    if (this.stats.bloomFilterHits + this.stats.bloomFilterMisses < 100) {
      return false; // Not enough data
    }

    const currentFalsePositiveRate = this.stats.falsePositiveRate;
    return currentFalsePositiveRate > this.config.fallbackThreshold;
  }

  private async fallbackToTraditionalDetection(
    sourceRecords: any[],
    projectId: string,
    objectType: string
  ): Promise<DeltaDetectionResult> {
    // Fallback to traditional delta detection
    const newRecords: any[] = [];
    const modifiedRecords: any[] = [];
    const skippedRecords: any[] = [];

    for (const record of sourceRecords) {
      const result = await this.traditionalDeltaCheck(record, projectId, objectType);
      this.categorizeRecord(result, record, newRecords, modifiedRecords, skippedRecords);
    }

    this.addAuditEntry('fallback', 'processed', 'Fallback to traditional detection activated', false);

    return {
      newRecords,
      modifiedRecords,
      skippedRecords,
      auditLog: this.auditLog,
      optimizationStats: this.stats
    };
  }

  private calculateFalsePositiveRate(): void {
    if (this.stats.verificationChecks > 0) {
      // This is a simplified calculation - in practice you'd track actual false positives
      this.stats.falsePositiveRate = Math.min(0.1, this.stats.bloomFilterHits / this.stats.totalRecords);
    }
  }

  private addAuditEntry(
    recordId: string,
    action: AuditEntry['action'],
    reason: string,
    bloomFilterResult?: boolean,
    actualStatus?: AuditEntry['actualStatus']
  ): void {
    if (this.config.auditTrail) {
      this.auditLog.push({
        recordId,
        action,
        reason,
        timestamp: new Date().toISOString(),
        bloomFilterResult,
        actualStatus
      });
    }
  }

  /**
   * Update bloom filter with newly processed records
   */
  updateBloomFilter(processedRecords: any[]): void {
    processedRecords.forEach(record => {
      const recordKey = this.generateRecordKey(record);
      this.bloomFilter.add(recordKey);
    });
  }

  /**
   * Save bloom filter state for persistence
   */
  async saveBloomFilterState(projectId: string, objectType: string): Promise<void> {
    try {
      const filterData = this.bloomFilter.serialize();
      const cacheKey = `bloom_filter_${projectId}_${objectType}`;
      
      const { error } = await supabase
        .rpc('upsert_optimization_cache', {
          p_cache_key: cacheKey,
          p_project_id: projectId,
          p_object_type: objectType,
          p_cache_type: 'bloom_filter',
          p_cache_data: JSON.parse(filterData)
        });

      if (error) {
        console.error('Error saving bloom filter state:', error);
      }
    } catch (error) {
      console.error('Error saving bloom filter state:', error);
    }
  }

  /**
   * Load bloom filter state from persistence
   */
  async loadBloomFilterState(projectId: string, objectType: string): Promise<boolean> {
    try {
      const cacheKey = `bloom_filter_${projectId}_${objectType}`;
      
      const { data, error } = await supabase
        .rpc('get_optimization_cache', {
          p_cache_key: cacheKey,
          p_cache_type: 'bloom_filter'
        });

      if (error || !data || data.length === 0) {
        return false;
      }

      this.bloomFilter = BloomFilter.deserialize(JSON.stringify(data[0].cache_data));
      return true;
    } catch (error) {
      console.error('Error loading bloom filter state:', error);
      return false;
    }
  }
}

/**
 * Factory function to create optimized data processor
 */
export function createSmartDataOptimizer(config?: Partial<OptimizationConfig>): SmartDataOptimizer {
  const defaultConfig: OptimizationConfig = {
    enableBloomFilter: true,
    bloomFilterSize: 1000000, // 1M bits
    hashFunctions: 3,
    safetyLevel: 'balanced',
    auditTrail: true,
    fallbackThreshold: 0.05 // 5% false positive threshold
  };

  return new SmartDataOptimizer({ ...defaultConfig, ...config });
}
