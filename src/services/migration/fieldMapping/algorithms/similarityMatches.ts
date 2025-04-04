import { MappingSuggestion } from "../types";
import { calculateStringSimilarity, areFieldsConceptuallySimilar } from "../utils/stringSimilarity";

/**
 * Generates mapping suggestions based on the similarity of field names.
 * @param sourceFields - Array of source field names.
 * @param destinationFields - Array of destination field names.
 * @returns An array of mapping suggestions.
 */
export const generateSimilarityBasedMappings = (
  sourceFields: string[],
  destinationFields: string[]
): MappingSuggestion[] => {
  const suggestions: MappingSuggestion[] = [];

  for (const sourceField of sourceFields) {
    let bestMatch: { field: string; score: number } = { field: "", score: 0 };

    for (const destinationField of destinationFields) {
      const similarityScore = calculateStringSimilarity(sourceField, destinationField);

      if (similarityScore > bestMatch.score) {
        bestMatch = { field: destinationField, score: similarityScore };
      }
    }

    if (bestMatch.score > 0.5) {
      suggestions.push({
        source_field: sourceField,
        destination_field: bestMatch.field,
        confidence: bestMatch.score,
        reason: `Field name similarity score: ${bestMatch.score.toFixed(2)}`,
      });
    }
  }

  return suggestions;
};

/**
 * Generates mapping suggestions based on conceptual similarity of field names.
 * @param sourceFields - Array of source field names.
 * @param destinationFields - Array of destination field names.
 * @returns An array of mapping suggestions.
 */
export const generateConceptualSimilarityMappings = (
  sourceFields: string[],
  destinationFields: string[]
): MappingSuggestion[] => {
  const suggestions: MappingSuggestion[] = [];

  for (const sourceField of sourceFields) {
    let bestMatch: { field: string; score: number } = { field: "", score: 0 };

    for (const destinationField of destinationFields) {
      if (areFieldsConceptuallySimilar(sourceField, destinationField)) {
        const similarityScore = calculateStringSimilarity(sourceField, destinationField);
        if (similarityScore > bestMatch.score) {
          bestMatch = { field: destinationField, score: similarityScore };
        }
      }
    }

    if (bestMatch.score > 0) {
      suggestions.push({
        source_field: sourceField,
        destination_field: bestMatch.field,
        confidence: 0.8, // Conceptual similarity implies a good confidence
        reason: `Conceptually similar field names`,
      });
    }
  }

  return suggestions;
};
