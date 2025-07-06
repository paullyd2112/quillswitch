import * as fuzzball from 'fuzzball';
import Fuse from 'fuse.js';
import { ExtractedData, ExtractedField } from '@/services/migration/extractionService';

export interface DuplicationResult {
  isDuplicate: boolean;
  confidence: number;
  matchedRecord?: ExtractedData;
  matchingFields: string[];
  reason: string;
}

export interface DeduplicationConfig {
  fuzzyThreshold: number; // 0-100, higher = more strict
  keyFields: string[]; // Fields to prioritize for matching
  exactMatchFields?: string[]; // Fields that must match exactly
  skipFields?: string[]; // Fields to ignore in comparison
}

/**
 * Advanced deduplication service using fuzzy matching
 */
export class DeduplicationService {
  private config: DeduplicationConfig;

  constructor(config: DeduplicationConfig = {
    fuzzyThreshold: 85,
    keyFields: ['email', 'name', 'companyName', 'firstName', 'lastName'],
    exactMatchFields: ['email'],
    skipFields: ['id', 'created_at', 'updated_at', 'recordId']
  }) {
    this.config = config;
  }

  /**
   * Check if a record is a duplicate of existing records
   */
  detectDuplicates(
    newRecord: ExtractedData, 
    existingRecords: ExtractedData[]
  ): DuplicationResult[] {
    const results: DuplicationResult[] = [];

    for (const existingRecord of existingRecords) {
      const result = this.compareRecords(newRecord, existingRecord);
      if (result.isDuplicate) {
        results.push(result);
      }
    }

    // Sort by confidence (highest first)
    return results.sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * Compare two records for similarity
   */
  private compareRecords(record1: ExtractedData, record2: ExtractedData): DuplicationResult {
    const matches: string[] = [];
    let totalScore = 0;
    let comparedFields = 0;

    // Convert fields to key-value maps
    const fields1 = this.fieldsToMap(record1.fields);
    const fields2 = this.fieldsToMap(record2.fields);

    // Check exact match fields first
    if (this.config.exactMatchFields) {
      for (const fieldName of this.config.exactMatchFields) {
        const value1 = fields1[fieldName];
        const value2 = fields2[fieldName];
        
        if (value1 && value2) {
          if (this.normalizeValue(value1) === this.normalizeValue(value2)) {
            matches.push(fieldName);
            totalScore += 100; // Perfect match
            comparedFields++;
          } else {
            // Exact match field doesn't match - likely not duplicate
            return {
              isDuplicate: false,
              confidence: 0,
              matchingFields: [],
              reason: `Exact match field '${fieldName}' differs: '${value1}' vs '${value2}'`
            };
          }
        }
      }
    }

    // Compare key fields with fuzzy matching
    for (const fieldName of this.config.keyFields) {
      if (this.config.skipFields?.includes(fieldName)) continue;

      const value1 = fields1[fieldName];
      const value2 = fields2[fieldName];

      if (value1 && value2) {
        const similarity = this.calculateSimilarity(value1, value2);
        totalScore += similarity;
        comparedFields++;

        if (similarity >= this.config.fuzzyThreshold) {
          matches.push(fieldName);
        }
      }
    }

    // Compare remaining fields
    const allFields = new Set([...Object.keys(fields1), ...Object.keys(fields2)]);
    for (const fieldName of allFields) {
      if (this.config.keyFields.includes(fieldName) || 
          this.config.skipFields?.includes(fieldName) ||
          this.config.exactMatchFields?.includes(fieldName)) {
        continue;
      }

      const value1 = fields1[fieldName];
      const value2 = fields2[fieldName];

      if (value1 && value2) {
        const similarity = this.calculateSimilarity(value1, value2);
        totalScore += similarity * 0.5; // Lower weight for non-key fields
        comparedFields += 0.5;

        if (similarity >= this.config.fuzzyThreshold) {
          matches.push(fieldName);
        }
      }
    }

    const averageConfidence = comparedFields > 0 ? totalScore / comparedFields : 0;
    const isDuplicate = averageConfidence >= this.config.fuzzyThreshold && matches.length >= 2;

    return {
      isDuplicate,
      confidence: Math.round(averageConfidence),
      matchedRecord: isDuplicate ? record2 : undefined,
      matchingFields: matches,
      reason: isDuplicate 
        ? `${matches.length} matching fields with ${Math.round(averageConfidence)}% confidence`
        : `Only ${matches.length} matching fields with ${Math.round(averageConfidence)}% confidence`
    };
  }

  /**
   * Calculate similarity between two values using multiple algorithms
   */
  private calculateSimilarity(value1: any, value2: any): number {
    const str1 = this.normalizeValue(value1);
    const str2 = this.normalizeValue(value2);

    if (str1 === str2) return 100;
    if (!str1 || !str2) return 0;

    // Use multiple similarity algorithms and take the best score
    const ratioScore = fuzzball.ratio(str1, str2);
    const partialRatioScore = fuzzball.partial_ratio(str1, str2);
    const tokenSortScore = fuzzball.token_sort_ratio(str1, str2);
    const tokenSetScore = fuzzball.token_set_ratio(str1, str2);

    return Math.max(ratioScore, partialRatioScore, tokenSortScore, tokenSetScore);
  }

  /**
   * Normalize values for comparison
   */
  private normalizeValue(value: any): string {
    if (value === null || value === undefined) return '';
    
    return String(value)
      .toLowerCase()
      .trim()
      .replace(/[^\w\s]/g, '') // Remove special characters
      .replace(/\s+/g, ' '); // Normalize whitespace
  }

  /**
   * Convert field array to key-value map
   */
  private fieldsToMap(fields: ExtractedField[]): Record<string, any> {
    const map: Record<string, any> = {};
    for (const field of fields) {
      map[field.name] = field.value;
    }
    return map;
  }

  /**
   * Fast fuzzy search using Fuse.js for large datasets
   */
  async fastDuplicateSearch(
    targetRecord: ExtractedData,
    searchPool: ExtractedData[],
    threshold: number = 0.3
  ): Promise<DuplicationResult[]> {
    if (searchPool.length === 0) return [];

    // Convert records to searchable format
    const searchData = searchPool.map(record => ({
      ...record,
      searchableText: this.createSearchableText(record)
    }));

    // Configure Fuse.js for fuzzy search
    const fuse = new Fuse(searchData, {
      keys: ['searchableText'],
      threshold,
      includeScore: true,
      ignoreLocation: true,
      findAllMatches: true
    });

    const targetText = this.createSearchableText(targetRecord);
    const searchResults = fuse.search(targetText);

    return searchResults
      .filter(result => result.score !== undefined && result.score <= threshold)
      .map(result => ({
        isDuplicate: true,
        confidence: Math.round((1 - result.score!) * 100),
        matchedRecord: result.item,
        matchingFields: this.findMatchingFields(targetRecord, result.item),
        reason: `Fuzzy match with ${Math.round((1 - result.score!) * 100)}% confidence using Fuse.js`
      }))
      .sort((a, b) => b.confidence - a.confidence);
  }

  private createSearchableText(record: ExtractedData): string {
    return record.fields
      .filter(f => !this.config.skipFields?.includes(f.name))
      .map(f => `${f.name}:${this.normalizeValue(f.value)}`)
      .join(' ');
  }

  private findMatchingFields(record1: ExtractedData, record2: ExtractedData): string[] {
    const fields1 = this.fieldsToMap(record1.fields);
    const fields2 = this.fieldsToMap(record2.fields);
    const matches: string[] = [];

    for (const fieldName of Object.keys(fields1)) {
      if (fields2[fieldName]) {
        const similarity = this.calculateSimilarity(fields1[fieldName], fields2[fieldName]);
        if (similarity >= this.config.fuzzyThreshold) {
          matches.push(fieldName);
        }
      }
    }

    return matches;
  }

  /**
   * Batch deduplication for large datasets (enhanced with Fuse.js)
   */
  async batchDeduplicate(
    records: ExtractedData[],
    onProgress?: (processed: number, total: number, duplicatesFound: number) => void
  ): Promise<{
    unique: ExtractedData[];
    duplicates: Array<{ record: ExtractedData; duplicateOf: ExtractedData; confidence: number }>;
  }> {
    const unique: ExtractedData[] = [];
    const duplicates: Array<{ record: ExtractedData; duplicateOf: ExtractedData; confidence: number }> = [];

    for (let i = 0; i < records.length; i++) {
      const record = records[i];
      
      // Use fast fuzzy search for large datasets
      const duplicateResults = unique.length > 100 
        ? await this.fastDuplicateSearch(record, unique)
        : this.detectDuplicates(record, unique);

      if (duplicateResults.length > 0) {
        const bestMatch = duplicateResults[0];
        duplicates.push({
          record,
          duplicateOf: bestMatch.matchedRecord!,
          confidence: bestMatch.confidence
        });
      } else {
        unique.push(record);
      }

      if (onProgress) {
        onProgress(i + 1, records.length, duplicates.length);
      }
    }

    return { unique, duplicates };
  }
}

export const deduplicationService = new DeduplicationService();