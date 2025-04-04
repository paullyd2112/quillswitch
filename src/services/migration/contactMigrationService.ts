
import { toast } from "@/hooks/use-toast";
import { apiClient } from "./apiClient";
import { logUserActivity } from "./activityService";
import { BatchConfig, TransferProgress, DEFAULT_BATCH_CONFIG } from "./types/transferTypes";
import { createInitialProgress } from "./utils/progressUtils";
import { executeDataTransfer } from "./core/batchProcessingService";

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
        activity_details: null
      });
    }
    
    // Initialize progress tracking
    const batchConfig: BatchConfig = {
      batchSize: 50, // Smaller batch size for actual migration
      concurrentBatches: 2,
      retryAttempts: 3,
      retryDelay: 3000
    };
    
    const progress = createInitialProgress(allContacts.length);
    progress.totalBatches = Math.ceil(allContacts.length / batchConfig.batchSize);
    
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
      batchConfig,
      progress,
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
