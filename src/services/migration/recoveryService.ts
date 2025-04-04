
import { TransferProgress } from "./types/transferTypes";

/**
 * Stores a transfer checkpoint for potential recovery
 */
export const storeTransferCheckpoint = async (projectId: string, progress: TransferProgress, metadata: any) => {
  try {
    // Create checkpoint data
    const checkpointData = {
      projectId,
      timestamp: new Date().toISOString(),
      progress: {
        totalRecords: progress.totalRecords,
        processedRecords: progress.processedRecords,
        failedRecords: progress.failedRecords,
        currentBatch: progress.currentBatch,
        totalBatches: progress.totalBatches
      },
      metadata
    };
    
    // Store in localStorage for demo purposes (in a real app, this would go to a database)
    localStorage.setItem(`migration_checkpoint_${projectId}`, JSON.stringify(checkpointData));
    
    return { success: true, checkpointId: Date.now().toString() };
  } catch (error) {
    console.error("Failed to store checkpoint:", error);
    return { success: false, error };
  }
};

/**
 * Resumes a transfer from a stored checkpoint
 */
export const resumeTransfer = async (projectId: string) => {
  try {
    // Get checkpoint from localStorage (in a real app, this would come from a database)
    const checkpointData = localStorage.getItem(`migration_checkpoint_${projectId}`);
    
    if (!checkpointData) {
      throw new Error("No checkpoint found for this migration");
    }
    
    const checkpoint = JSON.parse(checkpointData);
    
    // Create progress object for resuming
    const progress: TransferProgress = {
      totalRecords: checkpoint.progress.totalRecords,
      processedRecords: checkpoint.progress.processedRecords,
      failedRecords: checkpoint.progress.failedRecords,
      percentage: Math.round((checkpoint.progress.processedRecords / checkpoint.progress.totalRecords) * 100),
      currentBatch: checkpoint.progress.currentBatch,
      totalBatches: checkpoint.progress.totalBatches,
      startTime: new Date(),
      estimatedTimeRemaining: null,
      status: "in_progress"
    };
    
    return {
      success: true,
      checkpoint: checkpoint,
      progress
    };
  } catch (error) {
    console.error("Failed to resume transfer:", error);
    return { success: false, error };
  }
};
