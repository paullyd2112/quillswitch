
import { MappingSuggestion } from "./types";

/**
 * Filters mapping suggestions based on the active tab
 */
export const filterSuggestionsByTab = (suggestions: MappingSuggestion[], activeTab: string): MappingSuggestion[] => {
  switch (activeTab) {
    case "high":
      return suggestions.filter(s => s.confidence >= 0.9);
    case "medium":
      return suggestions.filter(s => s.confidence >= 0.7 && s.confidence < 0.9);
    case "low":
      return suggestions.filter(s => s.confidence < 0.7);
    default:
      return suggestions;
  }
};

/**
 * Gets the confidence level color class based on confidence score
 */
export const getConfidenceColor = (confidence: number): string => {
  if (confidence >= 0.9) return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
  if (confidence >= 0.7) return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
  if (confidence >= 0.5) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
  return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
};

/**
 * Gets the confidence level label based on confidence score
 */
export const getConfidenceLabel = (confidence: number): string => {
  if (confidence >= 0.9) return "High";
  if (confidence >= 0.7) return "Medium";
  if (confidence >= 0.5) return "Low";
  return "Very Low";
};
