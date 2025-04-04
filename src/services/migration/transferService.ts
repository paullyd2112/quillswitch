
import { toast } from "@/hooks/use-toast";
import { apiClient } from "./apiClient";
import { logUserActivity } from "./activityService";

/**
 * Configuration for batch processing
 */
export interface BatchConfig {
  batchSize: number;
  concurrentBatches: number;
  retryAttempts: number;
  retryDelay: number; // in milliseconds
}

/**
 * Default batch configuration
 */
const DEFAULT_BATCH_CONFIG: BatchConfig = {
  batchSize: 100, // process 100 records per batch
  concurrentBatches: 3, // process 3 batches concurrently
  retryAttempts: 3, // retry failed batches 3 times
  retryDelay: 2000, // wait 2 seconds between retries
};

/**
 * Transfer progress information
 */
export interface TransferProgress {
  totalRecords: number;
  processedRecords: number;
  failedRecords: number;
  percentage: number;
  currentBatch: number;
  totalBatches: number;
  startTime: Date;
  estimatedTimeRemaining?: number; // in seconds
  status: 'initializing' | 'in_progress' | 'paused' | 'completed' | 'failed';
}

/**
 * Initialize a new transfer progress object
 */
const initializeProgress = (totalRecords: number): TransferProgress => {
  const totalBatches = Math.ceil(totalRecords / DEFAULT_BATCH_CONFIG.batchSize);
  
  return {
    totalRecords,
    processedRecords: 0,
    failedRecords: 0,
    percentage: 0,
    currentBatch: 0,
    totalBatches,
    startTime: new Date(),
    status: 'initializing'
  };
};

/**
 * Calculate estimated time remaining based on current progress
 */
const calculateTimeRemaining = (progress: TransferProgress): number | undefined => {
  if (progress.processedRecords === 0) return undefined;
  
  const elapsedMs = new Date().getTime() - progress.startTime.getTime();
  const recordsPerMs = progress.processedRecords / elapsedMs;
  const remainingRecords = progress.totalRecords - progress.processedRecords;
  
  if (recordsPerMs <= 0) return undefined;
  
  const remainingMs = remainingRecords / recordsPerMs;
  return Math.round(remainingMs / 1000); // Convert to seconds
};

/**
 * Update progress with latest information
 */
const updateProgress = (
  progress: TransferProgress, 
  processed: number, 
  failed: number,
  currentBatch: number
): TransferProgress => {
  const updatedProgress = {
    ...progress,
    processedRecords: progress.processedRecords + processed,
    failedRecords: progress.failedRecords + failed,
    currentBatch,
    status: 'in_progress' as const
  };
  
  updatedProgress.percentage = Math.floor(
    (updatedProgress.processedRecords / updatedProgress.totalRecords) * 100
  );
  
  updatedProgress.estimatedTimeRemaining = calculateTimeRemaining(updatedProgress);
  
  // Check if transfer is complete
  if (updatedProgress.processedRecords + updatedProgress.failedRecords >= updatedProgress.totalRecords) {
    updatedProgress.status = 'completed';
  }
  
  return updatedProgress;
};

/**
 * Process a single batch of records
 */
const processBatch = async <T>(
  items: T[],
  processFn: (item: T) => Promise<boolean>,
  batchNumber: number,
  config: BatchConfig
): Promise<{ processed: number; failed: number }> => {
  let processed = 0;
  let failed = 0;
  
  for (const item of items) {
    try {
      let success = false;
      let attempts = 0;
      
      // Retry logic
      while (!success && attempts < config.retryAttempts) {
        try {
          success = await processFn(item);
          if (success) {
            processed++;
          } else {
            failed++;
          }
        } catch (error) {
          attempts++;
          if (attempts < config.retryAttempts) {
            console.log(`Retrying batch ${batchNumber}, attempt ${attempts + 1}...`);
            await new Promise(resolve => setTimeout(resolve, config.retryDelay));
          } else {
            throw error;
          }
        }
      }
    } catch (error) {
      console.error(`Error processing item in batch ${batchNumber}:`, error);
      failed++;
    }
  }
  
  return { processed, failed };
};

/**
 * Execute batched data transfer with progress tracking and error handling
 */
export const executeDataTransfer = async <T>(
  items: T[],
  processFn: (item: T) => Promise<boolean>,
  progressCallback: (progress: TransferProgress) => void,
  config: BatchConfig = DEFAULT_BATCH_CONFIG,
  projectId?: string
): Promise<TransferProgress> => {
  // Initialize progress
  let progress = initializeProgress(items.length);
  progressCallback(progress);
  
  // Split items into batches
  const batches: T[][] = [];
  for (let i = 0; i < items.length; i += config.batchSize) {
    batches.push(items.slice(i, i + config.batchSize));
  }
  
  progress.status = 'in_progress';
  progress.totalBatches = batches.length;
  progressCallback(progress);
  
  // Process batches with concurrency limit
  for (let i = 0; i < batches.length; i += config.concurrentBatches) {
    const batchPromises = batches
      .slice(i, i + config.concurrentBatches)
      .map((batch, index) => 
        processBatch(batch, processFn, i + index + 1, config)
          .then(result => {
            // Update progress after each batch
            progress = updateProgress(
              progress, 
              result.processed, 
              result.failed,
              i + index + 1
            );
            progressCallback(progress);
            return result;
          })
      );
    
    await Promise.all(batchPromises);
    
    // Log activity for project
    if (projectId) {
      try {
        await logUserActivity({
          project_id: projectId,
          activity_type: 'data_transfer_progress',
          activity_description: `Processed ${progress.currentBatch} of ${progress.totalBatches} batches (${progress.percentage}% complete)`,
          activity_details: {
            processed: progress.processedRecords,
            failed: progress.failedRecords,
            total: progress.totalRecords,
            percentage: progress.percentage
          }
        });
      } catch (error) {
        console.error('Error logging transfer activity:', error);
      }
    }
  }
  
  // Final progress update
  progress.status = 'completed';
  progressCallback(progress);
  
  return progress;
};

/**
 * High-level function to migrate contacts with batching and progress tracking
 */
export const migrateContacts = async (
  params: {
    source: string;
    destination: string;
    fieldMapping: Record<string, string>;
    filters?: Record<string, any>;
    projectId?: string;
  },
  progressCallback: (progress: TransferProgress) => void
): Promise<TransferProgress> => {
  try {
    // Fetch all contacts with pagination to get total count first
    let allContacts: any[] = [];
    let page = 1;
    const limit = 250; // Larger page size for initial fetching
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
    
    // Fetch remaining pages
    while (hasMore && page < totalPages) {
      page++;
      try {
        const response = await apiClient.getContacts(params.source, page, limit);
        if (response.success && response.data.length > 0) {
          allContacts = [...allContacts, ...response.data];
        } else {
          hasMore = false;
        }
      } catch (error) {
        console.error(`Error fetching contacts page ${page}:`, error);
        hasMore = false;
      }
    }
    
    // Apply filters if provided
    if (params.filters && Object.keys(params.filters).length > 0) {
      allContacts = allContacts.filter(contact => {
        return Object.entries(params.filters || {}).every(([key, value]) => {
          return contact[key] === value;
        });
      });
    }
    
    // Log activity
    if (params.projectId) {
      await logUserActivity({
        project_id: params.projectId,
        activity_type: 'migration_started',
        activity_description: `Started migrating ${allContacts.length} contacts from ${params.source} to ${params.destination}`,
        activity_details: {
          contactCount: allContacts.length,
          source: params.source,
          destination: params.destination
        }
      });
    }
    
    // Process the contacts in batches
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
      {
        batchSize: 50, // Smaller batch size for actual migration
        concurrentBatches: 2,
        retryAttempts: 3,
        retryDelay: 3000
      },
      params.projectId
    );
  } catch (error) {
    console.error('Error in contact migration process:', error);
    toast({
      title: "Migration error",
      description: "An error occurred during migration. Check logs for details.",
      variant: "destructive",
    });
    throw error;
  }
};

/**
 * Similar method for migrating accounts with batching and progress tracking
 */
export const migrateAccounts = async (
  params: {
    source: string;
    destination: string;
    fieldMapping: Record<string, string>;
    filters?: Record<string, any>;
    projectId?: string;
  },
  progressCallback: (progress: TransferProgress) => void
): Promise<TransferProgress> => {
  // Implementation similar to migrateContacts but for accounts
  try {
    // Fetch all accounts with pagination
    let allAccounts: any[] = [];
    let page = 1;
    const limit = 250;
    let hasMore = true;
    
    const initialResponse = await apiClient.getAccounts(params.source, 1, limit);
    
    if (!initialResponse.success) {
      toast({
        title: "Error fetching accounts",
        description: "Failed to retrieve accounts from source system",
        variant: "destructive",
      });
      throw new Error("Failed to fetch accounts");
    }
    
    allAccounts = initialResponse.data;
    const totalPages = Math.ceil((initialResponse.meta?.total || allAccounts.length) / limit);
    
    while (hasMore && page < totalPages) {
      page++;
      try {
        const response = await apiClient.getAccounts(params.source, page, limit);
        if (response.success && response.data.length > 0) {
          allAccounts = [...allAccounts, ...response.data];
        } else {
          hasMore = false;
        }
      } catch (error) {
        console.error(`Error fetching accounts page ${page}:`, error);
        hasMore = false;
      }
    }
    
    // Apply filters if provided
    if (params.filters && Object.keys(params.filters).length > 0) {
      allAccounts = allAccounts.filter(account => {
        return Object.entries(params.filters || {}).every(([key, value]) => {
          return account[key] === value;
        });
      });
    }
    
    // Log activity
    if (params.projectId) {
      await logUserActivity({
        project_id: params.projectId,
        activity_type: 'migration_started',
        activity_description: `Started migrating ${allAccounts.length} accounts from ${params.source} to ${params.destination}`,
        activity_details: {
          accountCount: allAccounts.length,
          source: params.source,
          destination: params.destination
        }
      });
    }
    
    // Process the accounts in batches
    return executeDataTransfer(
      allAccounts,
      async (account) => {
        try {
          // Transform account data according to field mapping
          const mappedAccount = Object.entries(params.fieldMapping).reduce((mapped, [sourceField, destField]) => {
            mapped[destField] = account[sourceField];
            return mapped;
          }, {} as Record<string, any>);
          
          // Send to destination
          const response = await apiClient.migrateAccounts({
            source: params.source,
            destination: params.destination,
            fieldMapping: params.fieldMapping,
            filters: { id: account.id }
          });
          
          return response.success;
        } catch (error) {
          console.error('Error migrating account:', error);
          return false;
        }
      },
      progressCallback,
      {
        batchSize: 25, // Smaller batch size for actual migration since accounts may have more data
        concurrentBatches: 2,
        retryAttempts: 3,
        retryDelay: 3000
      },
      params.projectId
    );
  } catch (error) {
    console.error('Error in account migration process:', error);
    toast({
      title: "Migration error",
      description: "An error occurred during account migration. Check logs for details.",
      variant: "destructive",
    });
    throw error;
  }
};

/**
 * Function to handle interrupted transfers and resume them
 */
export const resumeTransfer = async (
  projectId: string,
  objectTypeId: string,
  progressCallback: (progress: TransferProgress) => void
): Promise<TransferProgress | null> => {
  try {
    // Get the migration status from the API
    const status = await apiClient.getMigrationStatus(`mig_${projectId}`);
    
    if (!status.success || !status.data) {
      toast({
        title: "Error resuming migration",
        description: "Could not retrieve migration status",
        variant: "destructive",
      });
      return null;
    }
    
    // Find the specific object type in the migration data
    const objectType = status.data.dataTypes?.find((dt: any) => dt.id === objectTypeId);
    if (!objectType) {
      toast({
        title: "Error resuming migration",
        description: "Could not find the specified object type in the migration",
        variant: "destructive",
      });
      return null;
    }
    
    // Create a progress object based on saved state
    const savedProgress: TransferProgress = {
      totalRecords: objectType.total || 0,
      processedRecords: objectType.migrated || 0,
      failedRecords: objectType.failed || 0,
      percentage: Math.floor(((objectType.migrated || 0) / (objectType.total || 1)) * 100),
      currentBatch: objectType.currentBatch || 0,
      totalBatches: objectType.totalBatches || 0,
      startTime: new Date(status.data.startTime || new Date()),
      status: status.data.status === 'in_progress' ? 'in_progress' : 'paused'
    };
    
    progressCallback(savedProgress);
    
    // Implement resumption logic based on object type
    switch (objectType.type) {
      case 'contacts':
        // Resume contact migration with the remaining items
        return migrateContacts({
          source: status.data.source.type,
          destination: status.data.destination.type,
          fieldMapping: objectType.fieldMapping,
          filters: { 
            ...objectType.filters,
            // Add filter to only process remaining records
            not_processed: true 
          },
          projectId
        }, progressCallback);
        
      case 'accounts':
        // Resume account migration with the remaining items
        return migrateAccounts({
          source: status.data.source.type,
          destination: status.data.destination.type,
          fieldMapping: objectType.fieldMapping,
          filters: { 
            ...objectType.filters,
            // Add filter to only process remaining records
            not_processed: true 
          },
          projectId
        }, progressCallback);
        
      default:
        toast({
          title: "Unsupported object type",
          description: `Cannot resume migration for ${objectType.type}`,
          variant: "destructive",
        });
        return null;
    }
  } catch (error) {
    console.error('Error resuming transfer:', error);
    toast({
      title: "Resume error",
      description: "Failed to resume the migration",
      variant: "destructive",
    });
    return null;
  }
};

// Export the default configuration
export { DEFAULT_BATCH_CONFIG };
