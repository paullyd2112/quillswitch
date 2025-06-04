
/**
 * Comprehensive formatting utilities for QuillSwitch
 */

// Date and time formatting
export const formatDate = (date: string | Date | null | undefined): string => {
  if (!date) return 'N/A';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return 'Invalid Date';
  }
};

export const formatDateTime = (date: string | Date | null | undefined): string => {
  if (!date) return 'N/A';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return 'Invalid Date';
  }
};

export const formatTimeAgo = (date: string | Date | null | undefined): string => {
  if (!date) return 'Unknown';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return formatDate(dateObj);
  } catch {
    return 'Unknown';
  }
};

// Status formatting
export const formatStatus = (status: string | null | undefined): string => {
  if (!status) return 'Unknown';
  
  return status
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export const getStatusColor = (status: string | null | undefined): string => {
  if (!status) return 'text-muted-foreground';
  
  const statusLower = status.toLowerCase();
  
  if (statusLower.includes('success') || statusLower.includes('completed') || statusLower.includes('active')) {
    return 'text-green-600 dark:text-green-400';
  }
  if (statusLower.includes('error') || statusLower.includes('failed') || statusLower.includes('rejected')) {
    return 'text-red-600 dark:text-red-400';
  }
  if (statusLower.includes('warning') || statusLower.includes('pending') || statusLower.includes('in_progress')) {
    return 'text-amber-600 dark:text-amber-400';
  }
  if (statusLower.includes('info') || statusLower.includes('processing')) {
    return 'text-blue-600 dark:text-blue-400';
  }
  
  return 'text-muted-foreground';
};

// Number formatting
export const formatNumber = (num: number | null | undefined, options?: Intl.NumberFormatOptions): string => {
  if (num === null || num === undefined || isNaN(num)) return '0';
  
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
    ...options
  }).format(num);
};

export const formatPercentage = (value: number | null | undefined, decimals: number = 1): string => {
  if (value === null || value === undefined || isNaN(value)) return '0%';
  
  return `${value.toFixed(decimals)}%`;
};

export const formatDuration = (seconds: number | null | undefined): string => {
  if (!seconds || seconds < 0) return '0s';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m ${remainingSeconds}s`;
  }
  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  }
  return `${remainingSeconds}s`;
};

// Activity formatting
export const formatActivityType = (type: string | null | undefined): string => {
  if (!type) return 'Unknown Activity';
  
  return type
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export const formatActivityDescription = (description: string | null | undefined, maxLength: number = 100): string => {
  if (!description) return 'No description available';
  
  if (description.length <= maxLength) return description;
  
  return `${description.substring(0, maxLength).trim()}...`;
};

// Data size formatting
export const formatFileSize = (bytes: number | null | undefined): string => {
  if (!bytes || bytes === 0) return '0 B';
  
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const size = bytes / Math.pow(1024, i);
  
  return `${size.toFixed(i === 0 ? 0 : 1)} ${sizes[i]}`;
};

// User formatting
export const formatUserName = (user: { first_name?: string; last_name?: string; email?: string } | null | undefined): string => {
  if (!user) return 'Unknown User';
  
  if (user.first_name || user.last_name) {
    return `${user.first_name || ''} ${user.last_name || ''}`.trim();
  }
  
  if (user.email) {
    return user.email.split('@')[0];
  }
  
  return 'Unknown User';
};

export const formatUserInitials = (user: { first_name?: string; last_name?: string; email?: string } | null | undefined): string => {
  if (!user) return 'U';
  
  if (user.first_name || user.last_name) {
    const first = user.first_name?.charAt(0).toUpperCase() || '';
    const last = user.last_name?.charAt(0).toUpperCase() || '';
    return first + last || 'U';
  }
  
  if (user.email) {
    return user.email.charAt(0).toUpperCase();
  }
  
  return 'U';
};

// Error formatting
export const formatErrorMessage = (error: any): string => {
  if (!error) return 'An unknown error occurred';
  
  if (typeof error === 'string') return error;
  if (error.message) return error.message;
  if (error.error_description) return error.error_description;
  if (error.details) return error.details;
  
  return 'An unknown error occurred';
};

// Migration specific formatting
export const formatMigrationProgress = (current: number | null | undefined, total: number | null | undefined): string => {
  if (!current || !total || total === 0) return '0%';
  
  const percentage = (current / total) * 100;
  return `${Math.min(100, Math.max(0, percentage)).toFixed(1)}%`;
};

export const formatRecordsCount = (count: number | null | undefined): string => {
  if (!count) return '0 records';
  
  if (count === 1) return '1 record';
  
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M records`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K records`;
  }
  
  return `${count} records`;
};
