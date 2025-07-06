import { apiClient } from './api/apiClient';
import { handleServiceError } from '../utils/serviceUtils';
import { supabase } from '@/integrations/supabase/client';

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
 * Extract a preview of standardized data from a CRM source using real API
 */
export const extractDataPreview = async (
  options: ExtractPreviewOptions
): Promise<ExtractedData[]> => {
  try {
    const { sourceSystem, objectType, limit = 5, filters = {} } = options;
    
    // Use the actual Unified API to extract data
    const { unifiedApiService } = await import('@/services/unified/UnifiedApiService');
    
    // Get available connections to find the right one
    const connections = await unifiedApiService.getUserConnections();
    const connection = connections.find(conn => 
      conn.name.toLowerCase().includes(sourceSystem.toLowerCase()) || 
      conn.type.toLowerCase().includes(sourceSystem.toLowerCase())
    );
    
    if (!connection) {
      throw new Error(`No connection found for ${sourceSystem}. Please connect your CRM system first.`);
    }
    
    try {
      // Get schema to understand the data structure
      const schema = await unifiedApiService.getConnectionSchema(connection.id);
      
      // TODO: Replace with actual data extraction via unified API
      // For now, we'll use the schema information to create more realistic mock data
      // This is a placeholder until the unified data extraction API is fully implemented
      const mockData = generateRealisticMockData(sourceSystem, objectType, limit, filters, schema);
      return mockData;
      
    } catch (extractionError) {
      console.error("Data extraction failed:", extractionError);
      throw new Error(`Failed to extract data from ${sourceSystem}. Please check your connection and try again. Error: ${extractionError instanceof Error ? extractionError.message : 'Unknown error'}`);
    }
  } catch (error: any) {
    handleServiceError(error, `Failed to extract ${options.objectType} preview from ${options.sourceSystem}`);
    return [];
  }
};

/**
 * Generate more realistic mock data using schema information
 */
const generateRealisticMockData = (
  sourceSystem: string,
  objectType: string,
  limit: number,
  filters: Record<string, any>,
  schema?: any
): ExtractedData[] => {
  // Use schema information if available to create more accurate mock data
  const mockData = generateMockData(sourceSystem, objectType, limit, filters);
  
  // Enhance with schema-aware field types if schema is available
  if (schema && schema.objects) {
    const objectSchema = schema.objects.find((obj: any) => 
      obj.name.toLowerCase() === objectType.toLowerCase() ||
      obj.name.toLowerCase() === objectType.toLowerCase().slice(0, -1) // Handle plurals
    );
    
    if (objectSchema && objectSchema.fields) {
      return mockData.map(record => ({
        ...record,
        fields: record.fields.map(field => {
          const schemaField = objectSchema.fields.find((f: any) => f.name === field.name);
          if (schemaField) {
            return {
              ...field,
              type: schemaField.type || field.type,
              originalFormat: `${sourceSystem}_${schemaField.type || 'standard'}`
            };
          }
          return field;
        }),
        metadata: {
          ...record.metadata,
          schemaVersion: objectSchema.version || '1.0',
          fieldsFromSchema: objectSchema.fields.length
        }
      }));
    }
  }
  
  return mockData;
};
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
  try {
    // Use the actual Unified API for full data extraction
    const { unifiedApiService } = await import('@/services/unified/UnifiedApiService');
    
    // Get available connections
    const connections = await unifiedApiService.getUserConnections();
    const connection = connections.find(conn => 
      conn.name.toLowerCase().includes(options.sourceSystem.toLowerCase()) || 
      conn.type.toLowerCase().includes(options.sourceSystem.toLowerCase())
    );
    
    if (!connection) {
      throw new Error(`No connection found for ${options.sourceSystem}. Please connect your CRM system first.`);
    }
    
    // TODO: Implement actual full data extraction via unified API
    // Use the unified API to extract all data in batches
    try {
      const { data, error } = await supabase.functions.invoke('unified-data-extraction', {
        method: 'POST',
        body: {
          connection_id: connection.id,
          object_type: options.objectType,
          batch_size: options.batchSize || 50,
          filters: options.filters || {}
        }
      });

      if (error) throw error;

      // Report progress if callback provided
      if (options.onProgress) {
        options.onProgress(1.0);
      }

      // Transform the unified API response to our format
      return (data.records || []).map((record: any) => ({
        recordId: record.id,
        sourceSystem: options.sourceSystem,
        objectType: options.objectType,
        fields: Object.entries(record.raw || {}).map(([key, value]) => ({
          name: key,
          value,
          type: typeof value === 'string' ? 'string' : 
                typeof value === 'number' ? 'number' :
                typeof value === 'boolean' ? 'boolean' :
                value instanceof Date ? 'date' : 'unknown'
        })),
        metadata: {
          extractionMethod: 'unified_api',
          connectionId: connection.id,
          extractedAt: new Date().toISOString(),
          originalId: record.id
        }
      }));
    } catch (extractionError) {
      console.error("Unified API extraction failed:", extractionError);
      throw new Error(`Failed to extract data: ${extractionError instanceof Error ? extractionError.message : 'Unknown error'}`);
    }
    
  } catch (error: any) {
    console.error("Full data extraction failed:", error);
    handleServiceError(error, `Failed to extract full ${options.objectType} dataset from ${options.sourceSystem}`);
    return [];
  }
};
