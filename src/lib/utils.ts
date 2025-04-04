
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a number of bytes into a human-readable string
 */
export function formatBytes(bytes: number | undefined, decimals: number = 1): string {
  if (bytes === undefined || bytes === 0) return '0 Bytes';
  
  // Convert KB to bytes if needed
  if (bytes < 1000) { // Assuming this is KB already
    bytes = bytes * 1024;
  }
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Formats a number to include comma separators
 */
export function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
