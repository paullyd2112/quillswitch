
import { toast } from "@/hooks/use-toast";
import { apiClient } from "./apiClient";
import { logUserActivity } from "./activityService";
import { BatchConfig, TransferProgress } from "./types/transferTypes";
import { initializeProgress } from "./utils/progressUtils";
import { executeDataTransfer } from "./core/batchProcessingService";

/**
 * High-level function to migrate accounts with batching and progress tracking
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
        activity_details: null
      });
    }
    
    // Initialize batch configuration
    const batchConfig: BatchConfig = {
      batchSize: 25, // Smaller batch size for actual migration since accounts may have more data
      concurrentBatches: 2,
      retryAttempts: 3,
      retryDelay: 3000
    };
    
    const progress = initializeProgress(allAccounts.length, batchConfig.batchSize);
    
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
      batchConfig,
      progress,
      params.projectId,
      logUserActivity
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
