import { BatchConfig, TransferProgress } from "./types/transferTypes";
import { executeDataTransfer } from "./core/batchProcessingService";
import { storeTransferCheckpoint } from "./recoveryService";
import { createInitialProgress } from "./utils/progressUtils";

/**
 * Transfer enterprise-grade contact data with advanced features
 */
export const migrateEnterpriseContacts = async (
  projectId: string,
  sourceSystem: string,
  targetSystem: string,
  config: BatchConfig,
  options?: {
    fieldMapping?: Record<string, string>;
    filters?: Record<string, any>;
    transformations?: Array<Function>;
    validations?: Array<Function>;
  }
) => {
  console.log(`Starting enterprise contact migration for project ${projectId}`);
  console.log(`Source: ${sourceSystem}, Target: ${targetSystem}`);
  console.log("Using configuration:", config);

  try {
    // Fetch contacts from source system (mocked)
    const contacts = await fetchEnterpriseContactsFromSource(sourceSystem, options?.filters);
    
    // Process the contact records
    const progressCallback = (progress: TransferProgress) => {
      console.log(`Processing progress: ${progress.percentage}%`);
    };
    
    const initialProgress = createInitialProgress(contacts.length);
    initialProgress.totalBatches = Math.ceil(contacts.length / config.batchSize);
    initialProgress.status = "in_progress";
    
    const transferHandlers = async (record: any) => {
      // Transform record
      let transformedRecord = { ...record };
      
      // Apply field mapping
      if (options?.fieldMapping) {
        Object.entries(options.fieldMapping).forEach(([sourceField, targetField]) => {
          if (record[sourceField] !== undefined) {
            transformedRecord[targetField] = record[sourceField];
            if (sourceField !== targetField) {
              delete transformedRecord[sourceField];
            }
          }
        });
      }
      
      // Apply custom transformations
      if (options?.transformations) {
        for (const transform of options.transformations) {
          transformedRecord = transform(transformedRecord);
        }
      }
      
      // Validate record
      if (options?.validations) {
        for (const validate of options.validations) {
          const validationResult = validate(transformedRecord);
          if (validationResult !== true) {
            console.error(`Validation failed for record: ${transformedRecord.id}`);
            return false;
          }
        }
      }
      
      // In a real implementation, would make API call to target system
      // Simulate network latency and occasional failures
      await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 100));
      
      if (Math.random() < 0.05) { // 5% failure rate for testing
        throw new Error(`Failed to process contact: ${record.email || record.id}`);
      }
      
      return true;
    };
    
    // Execute the data transfer with enterprise features
    const result = await executeDataTransfer(
      contacts,
      transferHandlers,
      progressCallback,
      config,
      initialProgress
    );
    
    // Store checkpoint for recovery when completed
    await storeTransferCheckpoint(projectId, result, {
      sourceSystem,
      targetSystem,
      lastBatchCompleted: result.currentBatch
    });
    
    console.log("Enterprise contact migration completed");
    return {
      success: true,
      totalRecords: contacts.length,
      processedRecords: result.processedRecords,
      failedRecords: result.failedRecords,
      percentage: result.percentage
    };
  } catch (error) {
    console.error("Enterprise contact migration failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
};

/**
 * Mocked function to fetch contacts from a source system
 */
const fetchEnterpriseContactsFromSource = async (sourceSystem: string, filters?: Record<string, any>) => {
  // In a real implementation, this would call APIs to get data
  console.log(`Fetching contacts from ${sourceSystem} with filters:`, filters);
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
  
  // Generate mock data
  const count = filters?.limit || 1000;
  const mockContacts = Array.from({ length: count }, (_, i) => ({
    id: `SRC-${i + 1000}`,
    firstName: `Contact${i}`,
    lastName: `Surname${i}`,
    email: `contact${i}@example.com`,
    phone: `+1555${(1000000 + i).toString().substring(1)}`,
    title: i % 5 === 0 ? 'CEO' : 'Employee',
    company: `Company ${Math.floor(i / 10)}`,
    createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString()
  }));
  
  return mockContacts;
};

/**
 * Tests the system's enterprise migration capabilities
 * Returns metrics on performance and throughput
 */
export const testEnterpriseCapabilities = async (options: {
  dataSize: number;
  objectComplexity: 'simple' | 'medium' | 'complex';
  concurrentBatches: number;
  batchSize: number;
}) => {
  console.log("Testing enterprise capabilities with options:", options);
  
  try {
    // Generate test data
    const testData = generateTestData(options.dataSize, options.objectComplexity);
    
    // Configure test parameters
    const config: BatchConfig = {
      batchSize: options.batchSize,
      concurrentBatches: options.concurrentBatches,
      retryAttempts: 2,
      retryDelay: 500,
      validationLevel: 'basic'
    };
    
    // Setup callback for progress updates
    const progressCallback = (progress: TransferProgress) => {
      console.log(`Test progress: ${progress.percentage}%`);
    };
    
    // Initialize progress tracking
    const initialProgress = createInitialProgress(testData.length);
    initialProgress.totalBatches = Math.ceil(testData.length / config.batchSize);
    initialProgress.status = "in_progress";
    
    // Setup test handler
    const testHandler = async (record: any) => {
      // Simulate minimal processing time
      await new Promise(resolve => setTimeout(resolve, 10));
      return true;
    };
    
    // Capture start metrics
    const startMemory = typeof process !== 'undefined' && process.memoryUsage ? process.memoryUsage().heapUsed / 1024 / 1024 : 0;
    const startTime = Date.now();
    
    // Run the test
    const result = await executeDataTransfer(
      testData,
      testHandler,
      progressCallback,
      config,
      initialProgress
    );
    
    // Capture end metrics
    const endTime = Date.now();
    const endMemory = typeof process !== 'undefined' && process.memoryUsage ? process.memoryUsage().heapUsed / 1024 / 1024 : 0;
    
    // Calculate metrics
    const durationSeconds = (endTime - startTime) / 1000;
    const recordsPerSecond = result.processedRecords / durationSeconds;
    const memoryUsed = endMemory - startMemory;
    
    return {
      success: true,
      testName: `Enterprise capability test (${options.objectComplexity} complexity)`,
      metrics: {
        totalRecords: options.dataSize,
        successfulRecords: result.processedRecords,
        failedRecords: result.failedRecords,
        durationSeconds,
        recordsPerSecond,
        batchesPerSecond: result.totalBatches / durationSeconds,
        averageBatchDuration: durationSeconds / result.totalBatches,
        memoryUsedMB: memoryUsed.toFixed(2),
        concurrency: options.concurrentBatches
      },
      maxCapacity: {
        contacts: Math.round(recordsPerSecond * 28800), // 8-hour window
        accounts: Math.round(recordsPerSecond * 28800 * 0.4), // 40% of contacts
        opportunities: Math.round(recordsPerSecond * 28800 * 0.2) // 20% of contacts
      },
      performanceMetrics: {
        peakThroughput: recordsPerSecond * 1.2, // Estimated peak throughput 20% higher than average
        averageThroughput: recordsPerSecond,
        successRate: ((result.processedRecords - result.failedRecords) / result.processedRecords) * 100,
        totalDuration: durationSeconds,
        memoryUsage: memoryUsed
      },
      recommendation: generateRecommendation(options, recordsPerSecond, memoryUsed)
    };
  } catch (error) {
    console.error("Enterprise capability test failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
};

/**
 * Generate test data of varying complexity for performance testing
 */
const generateTestData = (size: number, complexity: 'simple' | 'medium' | 'complex') => {
  const data = [];
  
  // Number of fields based on complexity
  const fieldCount = complexity === 'simple' ? 10 : 
                      complexity === 'medium' ? 30 : 
                      100;
  
  for (let i = 0; i < size; i++) {
    const record: Record<string, any> = {
      id: `TST-${i}`,
      name: `Test Record ${i}`
    };
    
    // Add fields based on complexity
    for (let j = 0; j < fieldCount; j++) {
      record[`field_${j}`] = `Value ${j} for record ${i}`;
    }
    
    // Add nested objects for complex data
    if (complexity === 'complex') {
      record.nested = {
        level1: {
          level2: {
            level3: { value: `Deep nested value for ${i}` }
          }
        }
      };
      
      // Add arrays
      record.items = Array.from({ length: 20 }, (_, k) => ({
        itemId: k,
        itemName: `Item ${k} for record ${i}`
      }));
    } else if (complexity === 'medium') {
      record.nested = {
        level1: { value: `Nested value for ${i}` }
      };
      
      record.items = Array.from({ length: 5 }, (_, k) => ({
        itemId: k,
        itemName: `Item ${k} for record ${i}`
      }));
    }
    
    data.push(record);
  }
  
  return data;
};

/**
 * Generate recommendation text based on test results
 */
const generateRecommendation = (
  options: any,
  recordsPerSecond: number,
  memoryUsed: number
): string => {
  const hourlyCapacity = Math.round(recordsPerSecond * 3600);
  const dailyCapacity = hourlyCapacity * 24;
  
  let recommendation = `Based on the test results, this system can process approximately ${hourlyCapacity.toLocaleString()} records per hour with ${options.concurrentBatches} concurrent batches.\n\n`;
  
  if (memoryUsed > 100) {
    recommendation += `- High memory usage detected (${memoryUsed.toFixed(2)} MB). Consider reducing batch size or implementing streaming processing for production workloads.\n`;
  }
  
  if (options.objectComplexity === 'complex' && recordsPerSecond < 10) {
    recommendation += `- Performance with complex objects is limited. Consider simplifying data model or increasing server resources.\n`;
  }
  
  recommendation += `- Recommended configuration for large migrations:\n`;
  recommendation += `  * Batch size: ${options.objectComplexity === 'complex' ? options.batchSize / 2 : options.batchSize * 1.5}\n`;
  recommendation += `  * Concurrent batches: ${Math.min(options.concurrentBatches + 2, 8)}\n`;
  recommendation += `  * Memory allocation: ${Math.max(512, Math.round(memoryUsed * 4))} MB\n\n`;
  
  recommendation += `- For an enterprise migration of 100,000 records, estimated completion time would be ${Math.round(100000 / recordsPerSecond / 3600)} hours.\n`;
  
  return recommendation;
};

/**
 * Estimates the resources required for a large migration
 */
export const estimateMigrationResources = (
  recordCount: number,
  objectType: 'contact' | 'account' | 'opportunity' | 'custom',
  options?: {
    complexity?: 'simple' | 'medium' | 'complex';
    desiredDuration?: number; // in minutes
  }
) => {
  // Base processing rates (records per second) based on object type and complexity
  const baseRates = {
    contact: { simple: 50, medium: 30, complex: 15 },
    account: { simple: 40, medium: 20, complex: 10 },
    opportunity: { simple: 30, medium: 15, complex: 7 },
    custom: { simple: 35, medium: 18, complex: 8 }
  };
  
  const complexity = options?.complexity || 'medium';
  const baseRate = baseRates[objectType][complexity];
  
  // Estimate total duration at baseline configuration
  const baselineDurationSeconds = recordCount / baseRate;
  const baselineDurationMinutes = baselineDurationSeconds / 60;
  
  // Calculate recommended concurrency based on desired duration
  let recommendedConcurrency = 3; // default
  let recommendedBatchSize = 100; // default
  
  if (options?.desiredDuration) {
    const requiredRate = recordCount / (options.desiredDuration * 60);
    recommendedConcurrency = Math.ceil(requiredRate / baseRate);
    
    // Cap at reasonable limits
    recommendedConcurrency = Math.min(Math.max(recommendedConcurrency, 1), 20);
    
    // Adjust batch size based on complexity
    if (complexity === 'simple') {
      recommendedBatchSize = 200;
    } else if (complexity === 'complex') {
      recommendedBatchSize = 50;
    }
  }
  
  // Estimate memory usage
  const bytesPerRecord = complexity === 'simple' ? 2000 : 
                          complexity === 'medium' ? 5000 : 
                          15000;
  
  const totalDataSizeMB = (recordCount * bytesPerRecord) / (1024 * 1024);
  const estimatedMemoryMB = totalDataSizeMB * 2.5; // Account for overhead
  
  // Estimated cost - simplified for demo
  const costPerThousandRecords = objectType === 'contact' ? 0.05 : 
                                 objectType === 'account' ? 0.10 : 
                                 objectType === 'opportunity' ? 0.15 : 
                                 0.12;
  const estimatedCost = (recordCount / 1000) * costPerThousandRecords;
  
  return {
    recordCount,
    objectType,
    complexity,
    estimatedDuration: {
      minutes: baselineDurationMinutes.toFixed(1),
      hours: (baselineDurationMinutes / 60).toFixed(2)
    },
    recommendedConfiguration: {
      batchSize: recommendedBatchSize,
      concurrentBatches: recommendedConcurrency,
      estimatedDuration: {
        minutes: (baselineDurationMinutes / recommendedConcurrency).toFixed(1),
        hours: (baselineDurationMinutes / recommendedConcurrency / 60).toFixed(2)
      }
    },
    resourceRequirements: {
      estimatedMemoryMB: Math.ceil(estimatedMemoryMB),
      estimatedCpuCores: Math.ceil(recommendedConcurrency / 2),
      networkBandwidth: `${Math.ceil(totalDataSizeMB / baselineDurationMinutes)} MB/min`
    },
    estimatedCost: `$${estimatedCost.toFixed(2)}`
  };
};
