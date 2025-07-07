// Deduplication Worker using Fuse.js for fuzzy matching
importScripts('https://cdn.jsdelivr.net/npm/fuse.js@7.0.0/dist/fuse.min.js');

class DeduplicationWorker {
  constructor() {
    this.config = {
      fuzzyThreshold: 85,
      keyFields: ['email', 'name', 'companyName', 'firstName', 'lastName'],
      exactMatchFields: ['email'],
      skipFields: ['id', 'created_at', 'updated_at', 'recordId']
    };
  }

  normalizeValue(value) {
    if (value === null || value === undefined) return '';
    
    return String(value)
      .toLowerCase()
      .trim()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, ' ');
  }

  fieldsToMap(fields) {
    const map = {};
    for (const field of fields) {
      map[field.name] = field.value;
    }
    return map;
  }

  calculateSimilarity(value1, value2) {
    const str1 = this.normalizeValue(value1);
    const str2 = this.normalizeValue(value2);

    if (str1 === str2) return 100;
    if (!str1 || !str2) return 0;

    // Simple Levenshtein distance calculation
    const matrix = [];
    const len1 = str1.length;
    const len2 = str2.length;

    for (let i = 0; i <= len2; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= len1; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= len2; i++) {
      for (let j = 1; j <= len1; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    const distance = matrix[len2][len1];
    const maxLen = Math.max(len1, len2);
    return maxLen === 0 ? 100 : ((maxLen - distance) / maxLen) * 100;
  }

  compareRecords(record1, record2) {
    const matches = [];
    let totalScore = 0;
    let comparedFields = 0;

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
            totalScore += 100;
            comparedFields++;
          } else {
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

  detectDuplicates(newRecord, existingRecords) {
    const results = [];

    for (const existingRecord of existingRecords) {
      const result = this.compareRecords(newRecord, existingRecord);
      if (result.isDuplicate) {
        results.push(result);
      }
    }

    return results.sort((a, b) => b.confidence - a.confidence);
  }

  createSearchableText(record) {
    return record.fields
      .filter(f => !this.config.skipFields?.includes(f.name))
      .map(f => `${f.name}:${this.normalizeValue(f.value)}`)
      .join(' ');
  }

  findMatchingFields(record1, record2) {
    const fields1 = this.fieldsToMap(record1.fields);
    const fields2 = this.fieldsToMap(record2.fields);
    const matches = [];

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

  fastDuplicateSearch(targetRecord, searchPool, threshold = 0.3) {
    if (searchPool.length === 0) return [];

    const searchData = searchPool.map(record => ({
      ...record,
      searchableText: this.createSearchableText(record)
    }));

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
        confidence: Math.round((1 - result.score) * 100),
        matchedRecord: result.item,
        matchingFields: this.findMatchingFields(targetRecord, result.item),
        reason: `Fuzzy match with ${Math.round((1 - result.score) * 100)}% confidence using Fuse.js`
      }))
      .sort((a, b) => b.confidence - a.confidence);
  }

  async batchDeduplicate(records, onProgress) {
    const unique = [];
    const duplicates = [];

    for (let i = 0; i < records.length; i++) {
      const record = records[i];
      
      const duplicateResults = unique.length > 100 
        ? this.fastDuplicateSearch(record, unique)
        : this.detectDuplicates(record, unique);

      if (duplicateResults.length > 0) {
        const bestMatch = duplicateResults[0];
        duplicates.push({
          record,
          duplicateOf: bestMatch.matchedRecord,
          confidence: bestMatch.confidence
        });
      } else {
        unique.push(record);
      }

      // Send progress update every 50 records
      if (i % 50 === 0) {
        self.postMessage({
          type: 'PROGRESS',
          processed: i + 1,
          total: records.length,
          duplicatesFound: duplicates.length
        });
      }
    }

    return { unique, duplicates };
  }
}

const worker = new DeduplicationWorker();

self.onmessage = async (event) => {
  const { type, data, id } = event.data;

  try {
    switch (type) {
      case 'DETECT_DUPLICATES':
        const duplicateResults = worker.detectDuplicates(data.newRecord, data.existingRecords);
        self.postMessage({ 
          id, 
          type: 'DUPLICATES_DETECTED', 
          results: duplicateResults 
        });
        break;

      case 'BATCH_DEDUPLICATE':
        const batchResults = await worker.batchDeduplicate(data.records);
        self.postMessage({ 
          id, 
          type: 'BATCH_COMPLETE', 
          results: batchResults 
        });
        break;

      case 'FAST_DUPLICATE_SEARCH':
        const fastResults = worker.fastDuplicateSearch(
          data.targetRecord, 
          data.searchPool, 
          data.threshold
        );
        self.postMessage({ 
          id, 
          type: 'FAST_SEARCH_COMPLETE', 
          results: fastResults 
        });
        break;

      default:
        self.postMessage({ 
          id, 
          type: 'ERROR', 
          error: 'Unknown message type' 
        });
    }
  } catch (error) {
    self.postMessage({ 
      id, 
      type: 'ERROR', 
      error: error.message 
    });
  }
};