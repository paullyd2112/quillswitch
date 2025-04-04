
import { TransferProgress } from "../../types/transferTypes";

/**
 * Progress history point for tracking rate over time
 */
export interface ProgressHistoryPoint {
  timestamp: number;
  processed: number;
  rate: number;
}

/**
 * Time duration in various formats for display purposes
 */
export interface FormattedTimeSpan {
  seconds: number;
  formatted: string;
  minutes?: number;
  hours?: number;
  days?: number;
}
