import { toast } from "@/hooks/use-toast";
import { apiClient } from "./api/apiClient";
import { logUserActivity } from "./activityService";
import { 
  BatchConfig, 
  TransferProgress, 
  ENTERPRISE_BATCH_CONFIG,
  ENTERPRISE_COMPLEX_BATCH_CONFIG,
  ENTERPRISE_SIMPLE_BATCH_CONFIG
} from "./types/transferTypes";
import { executeDataTransfer, executeStreamingDataTransfer } from "./core/batchProcessingService";
import { initializeProgress } from "./utils/progressUtils";

/**
 * Service for handling enterprise-scale migrations
 */

/**
 * Estimates the time and resources required for a migration
 */
export const estimateMigrationResources = (
  dataTypeCounts: Record<string, number>,
  sourceSystem: string,
  destinationSystem: string
): {
  estimatedTime: number; // in minutes
  recommendedBatchConfigs: Record<string, BatchConfig>;
  totalRecords: number;
  estimatedApiCalls: number;
  memoryRequirements: string;
} => {
  // Initialize results
  let totalRecords = 0;
  let estimatedApiCalls = 0;
  let estimatedTimeInMinutes = 0;
  const recommendedBatchConfigs: Record<string, BatchConfig> = {};
  
  // Calculate based on data type
  Object.entries(dataTypeCounts).forEach(([dataType, count]) => {
    totalRecords += count;
    
    // Determine complexity factor based on data type
    let complexityFactor = 1.0;
    let apiCallsPerRecord = 1;
    let batchConfig: BatchConfig;
    
    switch (dataType) {
      case 'contacts':
        complexityFactor = 1.0;
        apiCallsPerRecord = 1;
        batchConfig = {...ENTERPRISE_BATCH_CONFIG};
        break;
      case 'accounts':
        complexityFactor = 1.2;
        apiCallsPerRecord = 1;
        batchConfig = {...ENTERPRISE_BATCH_CONFIG};
        break;
      case 'opportunities':
        complexityFactor = 2.0;
        apiCallsPerRecord = 3; // Related lookups
        batchConfig = {...ENTERPRISE_COMPLEX_BATCH_CONFIG};
        break;
      case 'cases':
        complexityFactor = 1.8;
        apiCallsPerRecord = 2;
        batchConfig = {...ENTERPRISE_COMPLEX_BATCH_CONFIG};
        break;
      case 'activities':
        complexityFactor = 1.5;
        apiCallsPerRecord = 2;
        batchConfig = {...ENTERPRISE_BATCH_CONFIG};
        break;
      case 'custom':
        complexityFactor = 2.5;
        apiCallsPerRecord = 4;
        batchConfig = {...ENTERPRISE_COMPLEX_BATCH_CONFIG};
        break;
      default:
        complexityFactor = 1.0;
        apiCallsPerRecord = 1;
        batchConfig = {...ENTERPRISE_SIMPLE_BATCH_CONFIG};
    }
    
    // Adjust based on source and destination systems
    // Some systems have slower APIs or more complex data structures
    if (sourceSystem === 'salesforce' || destinationSystem === 'salesforce') {
      complexityFactor *= 1.2;
    } else if (sourceSystem === 'dynamics' || destinationSystem === 'dynamics') {
      complexityFactor *= 1.3;
    }
    
    // Calculate metrics for this data type
    const typeApiCalls = count * apiCallsPerRecord;
    estimatedApiCalls += typeApiCalls;
    
    // Time calculation based on realistic API throughput
    // Assume 10 records per second as baseline, adjusted by complexity
    const recordsPerSecond = 10 / complexityFactor;
    const typeTimeInMinutes = (count / recordsPerSecond) / 60;
    
    // Add to total time, factoring in parallel processing
    estimatedTimeInMinutes += typeTimeInMinutes / Math.min(batchConfig.concurrentBatches, 4);
    
    // Store recommended batch config
    recommendedBatchConfigs[dataType] = batchConfig;
  });
  
  // Add overhead for initialization, validation, etc.
  estimatedTimeInMinutes *= 1.2;
  
  // Calculate memory requirements
  // Base memory + per record overhead
  const baseMemoryMB = 256;
  const perRecordKB = 10;
  const totalMemoryMB = baseMemoryMB + (totalRecords * perRecordKB / 1024);
  const memoryRequirements = totalMemoryMB < 1024 
    ? `${Math.ceil(totalMemoryMB)} MB` 
    : `${(totalMemoryMB / 1024).toFixed(2)} GB`;
  
  return {
    estimatedTime: Math.ceil(estimatedTimeInMinutes),
    recommendedBatchConfigs,
    totalRecords,
    estimatedApiCalls,
    memoryRequirements
  };
};

/**
 * Performs a high-volume migration of contacts optimized for enterprise scale
 */
export const migrateEnterpriseContacts = async (
  params: {
    source: string;
    destination: string;
    fieldMapping: Record<string, string>;
    filters?: Record<string, any>;
    projectId?: string;
    batchConfig?: BatchConfig;
    useStreaming?: boolean;
  },
  progressCallback: (progress: TransferProgress) => void
): Promise<TransferProgress> => {
  try {
    // Use enterprise configuration by default
    const batchConfig = params.batchConfig || ENTERPRISE_BATCH_CONFIG;
    
    // Log activity
    if (params.projectId) {
      await logUserActivity({
        project_id: params.projectId,
        activity_type: 'enterprise_migration_started',
        activity_description: `Started enterprise-scale contact migration from ${params.source} to ${params.destination}`,
        activity_details: {
          source: params.source,
          destination: params.destination,
          batchConfig,
          useStreaming: params.useStreaming
        }
      });
    }
    
    // If using streaming approach for very large datasets
    if (params.useStreaming) {
      // First get total count without fetching all data
      const countResponse = await apiClient.getContacts(params.source, 1, 1);
      if (!countResponse.success || !countResponse.meta?.total) {
        throw new Error("Failed to get total contact count");
      }
      
      const totalRecords = countResponse.meta.total;
      
      // Create a data fetching function for the streaming transfer
      const fetchDataFn = async (cursor: string | null, limit: number) => {
        const page = cursor ? parseInt(cursor) : 1;
        const response = await apiClient.getContacts(params.source, page, limit);
        
        if (!response.success) {
          throw new Error("Failed to fetch contacts");
        }
        
        const nextPage = page + 1;
        const nextCursor = nextPage <= Math.ceil(totalRecords / limit) ? nextPage.toString() : null;
        
        return {
          data: response.data,
          nextCursor
        };
      };
      
      // Use streaming data transfer
      return executeStreamingDataTransfer(
        fetchDataFn,
        async (contact) => {
          try {
            // Transform contact data according to field mapping
            const mappedContact = Object.entries(params.fieldMapping).reduce((mapped, [sourceField, destField]) => {
              mapped[destField] = contact[sourceField];
              return mapped;
            }, {} as Record<string, any>);
            
            // Apply any data transformations needed for enterprise
            // Example: handle complex field types, standardize formats, etc.
            
            // Send to destination
            const response = await apiClient.migrateContacts({
              source: params.source,
              destination: params.destination,
              fieldMapping: params.fieldMapping,
              filters: { id: contact.id }
            });
            
            return response.success;
          } catch (error) {
            console.error('Error migrating contact:', error);
            return false;
          }
        },
        progressCallback,
        batchConfig,
        totalRecords,
        params.projectId
      );
    }
    // Otherwise use regular batch processing but with enterprise optimization
    else {
      // Fetch all contacts with pagination, optimized for large datasets
      let allContacts: any[] = [];
      let page = 1;
      const limit = 500; // Larger page size for enterprise
      let hasMore = true;
      
      // First fetch to get an idea of total records
      const initialResponse = await apiClient.getContacts(params.source, 1, limit);
      
      if (!initialResponse.success) {
        toast({
          title: "Error fetching contacts",
          description: "Failed to retrieve contacts from source system",
          variant: "destructive",
        });
        throw new Error("Failed to fetch contacts");
      }
      
      allContacts = initialResponse.data;
      const totalPages = Math.ceil((initialResponse.meta?.total || allContacts.length) / limit);
      
      // Log the start of the fetch operation
      if (params.projectId) {
        await logUserActivity({
          project_id: params.projectId,
          activity_type: 'enterprise_data_fetch',
          activity_description: `Starting to fetch ${initialResponse.meta?.total || 'unknown'} contacts from ${params.source}`,
          activity_details: {
            estimatedPages: totalPages,
            pageSize: limit
          }
        });
      }
      
      // Fetch remaining pages with parallelism for enterprise speed
      if (totalPages > 1) {
        // Enterprise optimization: Fetch multiple pages in parallel
        const parallelFetchLimit = 5; // Fetch 5 pages at once
        
        for (let pageGroup = 1; pageGroup < totalPages; pageGroup += parallelFetchLimit) {
          const pageFetchPromises = [];
          
          for (let i = 0; i < parallelFetchLimit && pageGroup + i < totalPages; i++) {
            const pageToFetch = pageGroup + i + 1; // +1 because we already fetched page 1
            pageFetchPromises.push(
              apiClient.getContacts(params.source, pageToFetch, limit)
                .then(response => {
                  if (response.success && response.data.length > 0) {
                    return response.data;
                  }
                  return [];
                })
                .catch(error => {
                  console.error(`Error fetching contacts page ${pageToFetch}:`, error);
                  return [];
                })
            );
          }
          
          // Wait for all pages in this group to fetch
          const pageResults = await Promise.all(pageFetchPromises);
          
          // Add all fetched contacts
          pageResults.forEach(contacts => {
            if (contacts.length > 0) {
              allContacts = [...allContacts, ...contacts];
            }
          });
          
          // Log progress for large datasets
          if (params.projectId && pageGroup % 20 === 0) {
            await logUserActivity({
              project_id: params.projectId,
              activity_type: 'enterprise_data_fetch_progress',
              activity_description: `Fetched ${allContacts.length} of approximately ${initialResponse.meta?.total} contacts`,
              activity_details: {
                fetchedPages: pageGroup + Math.min(parallelFetchLimit, totalPages - pageGroup),
                totalPages,
                percentComplete: Math.round((pageGroup / totalPages) * 100)
              }
            });
          }
        }
      }
      
      // Apply filters if provided - optimized for large datasets
      if (params.filters && Object.keys(params.filters).length > 0) {
        // Enterprise optimization: Use more efficient filtering for large datasets
        const startFilterTime = Date.now();
        
        allContacts = allContacts.filter(contact => {
          return Object.entries(params.filters || {}).every(([key, value]) => {
            // Handle different comparison operators
            if (typeof value === 'object' && value !== null) {
              // Support for operators like $gt, $lt, $contains, etc.
              const operator = Object.keys(value)[0];
              const compareValue = value[operator];
              
              switch (operator) {
                case '$gt': return contact[key] > compareValue;
                case '$lt': return contact[key] < compareValue;
                case '$gte': return contact[key] >= compareValue;
                case '$lte': return contact[key] <= compareValue;
                case '$contains': return String(contact[key]).includes(compareValue);
                case '$startsWith': return String(contact[key]).startsWith(compareValue);
                case '$endsWith': return String(contact[key]).endsWith(compareValue);
                case '$in': return Array.isArray(compareValue) && compareValue.includes(contact[key]);
                default: return contact[key] === compareValue;
              }
            }
            
            return contact[key] === value;
          });
        });
        
        // Log filtering performance for enterprise monitoring
        if (params.projectId) {
          await logUserActivity({
            project_id: params.projectId,
            activity_type: 'enterprise_data_filtering',
            activity_description: `Filtered ${initialResponse.meta?.total || allContacts.length} contacts to ${allContacts.length} matching records`,
            activity_details: {
              filterTime: Date.now() - startFilterTime,
              filters: params.filters,
              resultCount: allContacts.length
            }
          });
        }
      }
      
      // Initialize progress tracking with enterprise metrics
      const progress = initializeProgress(allContacts.length, batchConfig.batchSize);
      progress.metrics = {
        memoryUsage: Math.round((allContacts.length * 2) / 1024), // Rough estimate in MB
        cpuUtilization: 0,
        networkLatency: 0,
        throughput: 0
      };
      
      // Process the contacts in batches with enterprise optimization
      return executeDataTransfer(
        allContacts,
        async (contact) => {
          try {
            // Transform contact data according to field mapping
            const mappedContact = Object.entries(params.fieldMapping).reduce((mapped, [sourceField, destField]) => {
              mapped[destField] = contact[sourceField];
              return mapped;
            }, {} as Record<string, any>);
            
            // Send to destination
            const response = await apiClient.migrateContacts({
              source: params.source,
              destination: params.destination,
              fieldMapping: params.fieldMapping,
              filters: { id: contact.id }
            });
            
            return response.success;
          } catch (error) {
            console.error('Error migrating contact:', error);
            return false;
          }
        },
        progressCallback,
        batchConfig,
        progress,
        params.projectId
      );
    }
  } catch (error) {
    console.error('Error in enterprise contact migration process:', error);
    toast({
      title: "Enterprise migration error",
      description: "An error occurred during contact migration. Check logs for details.",
      variant: "destructive",
    });
    
    // Log critical error for enterprise monitoring
    if (params.projectId) {
      await logUserActivity({
        project_id: params.projectId,
        activity_type: 'enterprise_migration_critical_error',
        activity_description: "Critical error in enterprise contact migration",
        activity_details: {
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
          migrationParams: {
            source: params.source,
            destination: params.destination,
            useStreaming: params.useStreaming
          }
        }
      });
    }
    
    throw error;
  }
};

/**
 * Test the system's capabilities by simulating a large-scale migration
 */
export const testEnterpriseCapabilities = async (
  params: {
    recordCounts: Record<string, number>;
    projectId?: string;
  },
  progressCallback?: (progress: TransferProgress) => void
): Promise<{
  maxCapacity: Record<string, number>;
  performanceMetrics: {
    peakThroughput: number; // records per second
    averageThroughput: number;
    memoryUsage: number; // MB
    totalDuration: number; // seconds
    successRate: number; // percentage
  };
  recommendation: string;
}> => {
  try {
    const startTime = Date.now();
    const results: Record<string, any> = {};
    let totalRecords = 0;
    let totalProcessed = 0;
    let totalSuccess = 0;
    let peakThroughput = 0;
    
    // Log test start
    if (params.projectId) {
      await logUserActivity({
        project_id: params.projectId,
        activity_type: 'enterprise_capability_test',
        activity_description: "Started enterprise capability test",
        activity_details: {
          recordCounts: params.recordCounts,
          timestamp: new Date().toISOString()
        }
      });
    }
    
    // Process each data type
    for (const [dataType, count] of Object.entries(params.recordCounts)) {
      totalRecords += count;
      
      // Determine appropriate batch config based on data type
      let batchConfig: BatchConfig;
      switch (dataType) {
        case 'contacts':
        case 'leads':
          batchConfig = ENTERPRISE_BATCH_CONFIG;
          break;
        case 'opportunities':
        case 'cases':
          batchConfig = ENTERPRISE_COMPLEX_BATCH_CONFIG;
          break;
        default:
          batchConfig = ENTERPRISE_SIMPLE_BATCH_CONFIG;
      }
      
      // Generate mock data for testing
      const mockData = Array.from({ length: count }, (_, i) => ({
        id: `test-${dataType}-${i}`,
        name: `Test ${dataType} ${i}`,
        email: `test${i}@example.com`,
        created_at: new Date().toISOString(),
        // Add more fields based on data type
        ...generateMockFields(dataType, i)
      }));
      
      // Create a progress callback for this data type
      const typeProgressCallback = (progress: TransferProgress) => {
        results[dataType] = progress;
        
        // Calculate current throughput
        const elapsedSec = (Date.now() - startTime) / 1000;
        const currentThroughput = progress.processedRecords / elapsedSec;
        
        // Update peak throughput
        if (currentThroughput > peakThroughput) {
          peakThroughput = currentThroughput;
        }
        
        // Call the parent callback if provided
        if (progressCallback) {
          progressCallback(progress);
        }
      };
      
      // Initialize progress for this type
      const typeProgress = initializeProgress(count, batchConfig.batchSize);
      
      // Use executeDataTransfer with a mock processor function
      const result = await executeDataTransfer(
        mockData,
        async (item) => {
          // Simulate processing time
          await simulateProcessingTime(dataType);
          
          // Simulate success rate (98% success)
          const success = Math.random() > 0.02;
          if (success) totalSuccess++;
          
          return success;
        },
        typeProgressCallback,
        batchConfig,
        typeProgress,
        params.projectId
      );
      
      totalProcessed += result.processedRecords;
      
      // Log results for each data type
      if (params.projectId) {
        await logUserActivity({
          project_id: params.projectId,
          activity_type: 'enterprise_capability_type_result',
          activity_description: `Completed capability test for ${dataType}`,
          activity_details: {
            dataType,
            count,
            processedRecords: result.processedRecords,
            failedRecords: result.failedRecords,
            throughput: result.processingRate,
            duration: (Date.now() - startTime) / 1000
          }
        });
      }
    }
    
    // Calculate performance metrics
    const totalDuration = (Date.now() - startTime) / 1000;
    const averageThroughput = totalProcessed / totalDuration;
    const successRate = (totalSuccess / totalProcessed) * 100;
    
    // Estimate max capacity based on test results
    const maxCapacity = estimateMaxCapacity(params.recordCounts, peakThroughput);
    
    // Create recommendation
    const recommendation = generateRecommendation(maxCapacity, peakThroughput, successRate);
    
    // Log final results
    if (params.projectId) {
      await logUserActivity({
        project_id: params.projectId,
        activity_type: 'enterprise_capability_test_completed',
        activity_description: "Completed enterprise capability test",
        activity_details: {
          totalRecords,
          totalProcessed,
          totalSuccess,
          peakThroughput,
          averageThroughput,
          totalDuration,
          successRate,
          maxCapacity,
          recommendation
        }
      });
    }
    
    return {
      maxCapacity,
      performanceMetrics: {
        peakThroughput,
        averageThroughput,
        memoryUsage: estimateMemoryUsage(totalRecords),
        totalDuration,
        successRate
      },
      recommendation
    };
  } catch (error) {
    console.error('Error in enterprise capability test:', error);
    
    if (params.projectId) {
      await logUserActivity({
        project_id: params.projectId,
        activity_type: 'enterprise_capability_test_error',
        activity_description: "Error during enterprise capability test",
        activity_details: {
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined
        }
      });
    }
    
    throw error;
  }
};

// Helper functions for the test capabilities method

/**
 * Generate mock fields based on data type
 */
const generateMockFields = (dataType: string, index: number): Record<string, any> => {
  switch (dataType) {
    case 'contacts':
      return {
        firstName: `First${index}`,
        lastName: `Last${index}`,
        company: `Company ${Math.floor(index / 10)}`,
        phone: `555-${Math.floor(1000 + Math.random() * 9000)}`,
        address: `${index} Main St`,
        status: ['Active', 'Inactive', 'Lead', 'Customer'][index % 4]
      };
    case 'opportunities':
      return {
        amount: Math.floor(1000 + Math.random() * 100000),
        stage: ['Prospect', 'Qualification', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'][index % 6],
        probability: Math.floor(Math.random() * 100),
        expectedCloseDate: new Date(Date.now() + (Math.random() * 30 * 86400000)).toISOString(),
        contactId: `contact-${Math.floor(index / 3)}`
      };
    case 'accounts':
      return {
        industry: ['Technology', 'Finance', 'Healthcare', 'Manufacturing', 'Retail'][index % 5],
        size: ['Small', 'Medium', 'Large', 'Enterprise'][index % 4],
        revenue: Math.floor(1000000 + Math.random() * 10000000),
        location: ['US', 'EU', 'APAC', 'LATAM'][index % 4],
        employees: Math.floor(10 + Math.random() * 1000)
      };
    default:
      return {
        field1: `Value${index}`,
        field2: Math.random() * 100,
        field3: index % 2 === 0
      };
  }
};

/**
 * Simulate variable processing time based on data type complexity
 */
const simulateProcessingTime = async (dataType: string): Promise<void> => {
  let processingTime: number;
  
  switch (dataType) {
    case 'contacts':
    case 'leads':
      processingTime = 5 + Math.random() * 10; // 5-15ms
      break;
    case 'opportunities':
    case 'cases':
      processingTime = 15 + Math.random() * 25; // 15-40ms
      break;
    case 'accounts':
      processingTime = 10 + Math.random() * 20; // 10-30ms
      break;
    default:
      processingTime = 3 + Math.random() * 7; // 3-10ms
  }
  
  return new Promise(resolve => setTimeout(resolve, processingTime));
};

/**
 * Estimate memory usage based on record count
 */
const estimateMemoryUsage = (recordCount: number): number => {
  // Rough estimate: base memory + per-record overhead
  const baseMemoryMB = 250;
  const perRecordKB = 5;
  
  return baseMemoryMB + (recordCount * perRecordKB / 1024);
};

/**
 * Estimate maximum capacity based on test results
 */
const estimateMaxCapacity = (
  testCounts: Record<string, number>,
  peakThroughput: number
): Record<string, number> => {
  // With optimal conditions, estimate max capacity
  // Using 8 hour window (28800 seconds) at 70% of peak throughput
  const safetyFactor = 0.7;
  const migrationWindowSeconds = 8 * 60 * 60; // 8 hours
  const totalCapacity = Math.floor(peakThroughput * safetyFactor * migrationWindowSeconds);
  
  // Distribute capacity proportionally across data types
  const result: Record<string, number> = {};
  let totalTestRecords = 0;
  
  Object.values(testCounts).forEach(count => {
    totalTestRecords += count;
  });
  
  Object.entries(testCounts).forEach(([dataType, count]) => {
    const proportion = count / totalTestRecords;
    result[dataType] = Math.floor(totalCapacity * proportion);
  });
  
  return result;
};

/**
 * Generate recommendation based on test results
 */
const generateRecommendation = (
  maxCapacity: Record<string, number>,
  peakThroughput: number,
  successRate: number
): string => {
  let recommendation = "Based on the capability test results:\n\n";
  
  // Add capacity numbers
  recommendation += "Maximum recommended capacity per 8-hour migration window:\n";
  Object.entries(maxCapacity).forEach(([dataType, count]) => {
    recommendation += `- ${dataType}: ${count.toLocaleString()} records\n`;
  });
  
  // Performance recommendations
  recommendation += "\nPerformance recommendations:\n";
  
  if (peakThroughput < 10) {
    recommendation += "- Consider increasing batch sizes and concurrency for better throughput\n";
  } else if (peakThroughput > 100) {
    recommendation += "- Current throughput is excellent. The system is well-optimized.\n";
  } else {
    recommendation += "- Current throughput is good. Consider fine-tuning batch configurations for specific data types\n";
  }
  
  if (successRate < 95) {
    recommendation += "- Success rate below target (95%). Implement more robust error handling and validation\n";
  } else {
    recommendation += "- Success rate is good. Continue with current error handling approach\n";
  }
  
  // Scaling recommendations
  const totalCapacity = Object.values(maxCapacity).reduce((sum, count) => sum + count, 0);
  
  if (totalCapacity > 500000) {
    recommendation += "\nFor extremely large migrations (>500,000 records), consider:\n";
    recommendation += "- Using the streaming API approach rather than batch loading\n";
    recommendation += "- Splitting migration into multiple phases or segments\n";
    recommendation += "- Scheduling migration during off-peak hours\n";
  }
  
  return recommendation;
};
