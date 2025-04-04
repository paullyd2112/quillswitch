
import { BatchConfig, TransferProgress } from "../../types/transferTypes";

/**
 * Common types used across batch processing services
 */

/**
 * Function signature for processing individual items in a batch
 */
export type ProcessItemFunction<T> = (item: T) => Promise<boolean>;

/**
 * Function signature for progress callback
 */
export type ProgressCallback = (progress: TransferProgress) => void;

/**
 * Function signature for fetching data in streams
 */
export type FetchDataFunction<T> = (
  cursor: string | null, 
  limit: number
) => Promise<{ 
  data: T[], 
  nextCursor: string | null 
}>;

/**
 * Result of a batch processing operation
 */
export interface BatchResult {
  successCount: number;
  failureCount: number;
  duration: number;
}
