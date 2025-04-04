
/**
 * Utility functions for formatting data in the migration components
 */

// Helper function to get random action verb based on step name
export const getActionVerb = (stepName: string): string => {
  const verbsByType: Record<string, string[]> = {
    "Contacts": ["importing", "loading", "fetching", "retrieving", "processing"],
    "Opportunities & Deals": ["syncing", "analyzing", "processing", "transferring", "mapping"],
    "Activities & Tasks": ["transferring", "moving", "syncing", "processing", "organizing"],
    "Cases & Tickets": ["processing", "handling", "migrating", "transferring", "analyzing"],
    "Accounts & Companies": ["connecting", "linking", "integrating", "mapping", "processing"],
    "Custom Objects": ["configuring", "setting up", "integrating", "customizing", "processing"],
  };
  
  // Get the array of verbs for the given step name or use default
  const verbs = verbsByType[stepName] || ["migrating", "processing", "transferring"];
  
  // Pick a random verb from the array
  const randomIndex = Math.floor(Math.random() * verbs.length);
  return verbs[randomIndex];
};

// Helper function to format time remaining
export const formatTimeRemaining = (seconds?: number): string => {
  if (!seconds) return "Calculating...";
  
  if (seconds < 60) {
    return `${seconds} seconds`;
  }
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  return `${hours} hour${hours !== 1 ? 's' : ''} ${remainingMinutes > 0 ? `${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}` : ''}`;
};

// Helper function to format records per second
export const formatRecordsPerSecond = (rps?: number): string => {
  if (!rps) return "Calculating...";
  
  if (rps < 1) {
    return `${(rps * 60).toFixed(1)} records/minute`;
  }
  
  return `${rps.toFixed(1)} records/second`;
};

// Helper function to format bytes into human-readable format
export const formatBytes = (bytes?: number): string => {
  if (bytes === undefined || bytes === 0) return "0 KB";
  
  // For this context, we're assuming bytes is actually KB
  if (bytes < 1024) {
    return `${bytes.toFixed(1)} KB`;
  }
  
  const mb = bytes / 1024;
  if (mb < 1024) {
    return `${mb.toFixed(1)} MB`;
  }
  
  const gb = mb / 1024;
  return `${gb.toFixed(1)} GB`;
};

// Format memory in MB with appropriate unit
export const formatMemory = (memoryMB?: number): string => {
  if (memoryMB === undefined) return "N/A";
  
  if (memoryMB < 1000) {
    return `${memoryMB.toFixed(1)} MB`;
  }
  
  return `${(memoryMB / 1024).toFixed(2)} GB`;
};

// Format network speed with appropriate unit
export const formatNetworkSpeed = (kbps?: number): string => {
  if (kbps === undefined) return "N/A";
  
  if (kbps < 1000) {
    return `${kbps.toFixed(1)} KB/s`;
  }
  
  return `${(kbps / 1024).toFixed(2)} MB/s`;
};
