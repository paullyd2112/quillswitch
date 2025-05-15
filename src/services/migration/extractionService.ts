import { apiClient } from './api/apiClient';
import { handleServiceError } from '../utils/serviceUtils';

/**
 * Types for the extraction service
 */
export interface ExtractedData {
  recordId: string;
  sourceSystem: string;
  objectType: string;
  fields: ExtractedField[];
  metadata?: Record<string, any>;
}

export interface ExtractedField {
  name: string;
  value: any;
  type: 'string' | 'number' | 'boolean' | 'date' | 'object' | 'array' | 'unknown';
  originalFormat?: string;
}

export interface ExtractPreviewOptions {
  sourceSystem: string;
  objectType: string;
  limit?: number;
  filters?: Record<string, any>;
}

/**
 * Extract a preview of standardized data from a CRM source
 */
export const extractDataPreview = async (
  options: ExtractPreviewOptions
): Promise<ExtractedData[]> => {
  try {
    const { sourceSystem, objectType, limit = 5, filters = {} } = options;
    
    // In a real app, we would make API calls to the actual CRM systems
    // For now, we'll create mock data based on the CRM and object type
    
    // This simulates an API request with a delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockData = generateMockData(sourceSystem, objectType, limit, filters);
    return mockData;
  } catch (error: any) {
    handleServiceError(error, `Failed to extract ${options.objectType} preview from ${options.sourceSystem}`);
    return [];
  }
};

/**
 * Generate mock data for preview based on CRM type and object type
 */
const generateMockData = (
  sourceSystem: string,
  objectType: string,
  limit: number,
  filters: Record<string, any>
): ExtractedData[] => {
  const results: ExtractedData[] = [];
  
  // Generate different fields based on object type
  for (let i = 0; i < limit; i++) {
    const recordId = `${sourceSystem.toLowerCase()}-${objectType.toLowerCase()}-${100000 + i}`;
    
    let fields: ExtractedField[] = [];
    
    switch (objectType.toLowerCase()) {
      case 'contact':
      case 'contacts':
        fields = [
          { name: 'firstName', value: ['John', 'Sarah', 'Michael', 'David', 'Emma'][i % 5], type: 'string' },
          { name: 'lastName', value: ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones'][i % 5], type: 'string' },
          { name: 'email', value: `contact${i}@example.com`, type: 'string' },
          { name: 'phone', value: `+1 (555) ${100 + i}-${1000 + i}`, type: 'string' },
          { name: 'createdDate', value: new Date(Date.now() - i * 86400000).toISOString(), type: 'date', originalFormat: sourceSystem === 'salesforce' ? 'SF_DATE_FORMAT' : 'ISO' }
        ];
        break;
        
      case 'account':
      case 'accounts':
      case 'company':
      case 'companies':
        fields = [
          { name: 'companyName', value: ['Acme Corp', 'Globex Inc', 'Initech', 'Massive Dynamic', 'Stark Industries'][i % 5], type: 'string' },
          { name: 'industry', value: ['Technology', 'Manufacturing', 'Healthcare', 'Finance', 'Retail'][i % 5], type: 'string' },
          { name: 'employees', value: (10 + i) * 25, type: 'number' },
          { name: 'website', value: `https://www.company${i}.com`, type: 'string' },
          { name: 'isActive', value: i % 3 !== 0, type: 'boolean' }
        ];
        break;
        
      case 'opportunity':
      case 'opportunities':
      case 'deal':
      case 'deals':
        fields = [
          { name: 'name', value: `Opportunity ${1000 + i}`, type: 'string' },
          { name: 'stage', value: ['Prospecting', 'Qualification', 'Proposal', 'Negotiation', 'Closed Won'][i % 5], type: 'string' },
          { name: 'amount', value: (100000 + i * 10000) / 100, type: 'number' },
          { name: 'closeDate', value: new Date(Date.now() + i * 7 * 86400000).toISOString(), type: 'date' },
          { name: 'probability', value: Math.round((i % 5) * 25), type: 'number' }
        ];
        break;
        
      default:
        fields = [
          { name: 'field1', value: `Value ${i}`, type: 'string' },
          { name: 'field2', value: i * 100, type: 'number' },
          { name: 'field3', value: i % 2 === 0, type: 'boolean' }
        ];
    }
    
    // Add system-specific fields based on source CRM
    if (sourceSystem.toLowerCase() === 'salesforce') {
      fields.push({ name: 'sfId', value: `SF-${recordId}`, type: 'string', originalFormat: '18digit' });
      fields.push({ name: 'lastModifiedDate', value: new Date().toISOString(), type: 'date', originalFormat: 'SF_DATE_FORMAT' });
    } else if (sourceSystem.toLowerCase() === 'hubspot') {
      fields.push({ name: 'hubspotId', value: i * 1000 + 5000, type: 'number' });
      fields.push({ name: 'hs_lastmodifieddate', value: Date.now(), type: 'number', originalFormat: 'timestamp' });
    }
    
    // Apply any filters (simple mock implementation)
    if (Object.keys(filters).length > 0) {
      // In a real implementation, we would filter the records here
      // For this mock, we'll just add a note that filters were applied
      fields.push({ 
        name: '_filtersApplied', 
        value: JSON.stringify(filters), 
        type: 'string' 
      });
    }
    
    results.push({
      recordId,
      sourceSystem,
      objectType,
      fields,
      metadata: {
        originalSource: sourceSystem,
        extractedAt: new Date().toISOString()
      }
    });
  }
  
  return results;
};

/**
 * Extract full data set from a CRM source (for actual migration)
 * This would be used for the actual migration process after preview
 */
export const extractFullDataSet = async (
  options: ExtractPreviewOptions & { batchSize?: number; onProgress?: (progress: number) => void }
): Promise<ExtractedData[]> => {
  // In a real implementation, this would make actual API calls to extract all data
  // with proper pagination and progress reporting
  // For now, we'll just return more mock data
  
  const mockData = generateMockData(
    options.sourceSystem, 
    options.objectType, 
    25, // Simulating larger dataset
    options.filters || {}
  );
  
  // Simulate progress updates
  if (options.onProgress) {
    const totalSteps = 4;
    for (let i = 1; i <= totalSteps; i++) {
      await new Promise(resolve => setTimeout(resolve, 500));
      options.onProgress(i / totalSteps);
    }
  }
  
  return mockData;
};
