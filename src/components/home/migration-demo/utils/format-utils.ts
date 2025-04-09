
/**
 * Utility functions for formatting data in the migration components
 */

// Helper function to get random action verb based on step name
export const getActionVerb = (stepName: string): string => {
  const verbsByType: Record<string, string[]> = {
    "Contacts": ["importing", "loading", "fetching", "retrieving", "processing"],
    "Opportunities & Deals": ["syncing", "analyzing", "processing", "transferring", "mapping"],
    "Activities & Tasks": ["transferring", "moving", "syncing", "importing"],
    "Cases & Tickets": ["migrating", "transferring", "importing", "processing"],
    "Accounts & Companies": ["importing", "transferring", "processing", "syncing"],
    "Custom Objects": ["importing", "migrating", "transferring", "processing"]
  };
  
  // Get verbs for this step type or use default verbs
  const verbs = verbsByType[stepName] || ["processing", "migrating", "transferring"];
  
  // Return a random verb from the list
  return verbs[Math.floor(Math.random() * verbs.length)];
};

// Format records per second with appropriate units
export const formatRecordsPerSecond = (rps: number): string => {
  if (rps >= 1000) {
    return `${(rps / 1000).toFixed(1)}k/s`;
  }
  return `${Math.round(rps)}/s`;
};

// Format time remaining in human-readable format
export const formatTimeRemaining = (seconds: number): string => {
  if (seconds < 60) {
    return `${Math.round(seconds)}s`;
  }
  
  if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
  }
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
};

// Format bytes to human-readable values (KB, MB, etc)
export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};
