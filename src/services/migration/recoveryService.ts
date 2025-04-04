
import { toast } from "@/hooks/use-toast";
import { apiClient } from "./apiClient";
import { TransferProgress } from "./types/transferTypes";
import { migrateContacts } from "./contactMigrationService";
import { migrateAccounts } from "./accountMigrationService";

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
