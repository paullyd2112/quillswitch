import { MappingSuggestion } from "../types";
import { calculateStringSimilarity, areFieldsConceptuallySimilar } from "../utils/stringSimilarity";

/**
 * Find matches based on string similarity
 */
export const findSimilarityMatches = (
  sourceField: string,
  destinationFields: string[]
): MappingSuggestion | null => {
  let bestMatch: { field: string; score: number } = { field: "", score: 0 };
  
  // First check for conceptually similar fields (higher confidence)
  for (const destField of destinationFields) {
    if (areFieldsConceptuallySimilar(sourceField, destField)) {
      const score = calculateStringSimilarity(sourceField, destField);
      if (score > bestMatch.score) {
        bestMatch = { field: destField, score };
      }
    }
  }
  
  // If we found a conceptual match with reasonable score
  if (bestMatch.score >= 0.6) {
    return {
      source_field: sourceField,
      destination_field: bestMatch.field,
      confidence: 0.7, // Conceptual similarity implies good confidence
      reason: "Conceptually similar field names"
    };
  }
  
  // Otherwise fall back to pure string similarity
  bestMatch = { field: "", score: 0 };
  
  for (const destField of destinationFields) {
    const score = calculateStringSimilarity(sourceField, destField);
    if (score > bestMatch.score) {
      bestMatch = { field: destField, score };
    }
  }
  
  // Only return if the score is reasonable
  if (bestMatch.score >= 0.5) {
    return {
      source_field: sourceField,
      destination_field: bestMatch.field,
      confidence: bestMatch.score,
      reason: `Field name similarity (${(bestMatch.score * 100).toFixed(0)}% match)`
    };
  }
  
  return null;
};
