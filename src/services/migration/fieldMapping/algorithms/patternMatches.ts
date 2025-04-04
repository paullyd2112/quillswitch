import { MappingSuggestion } from "../types";
import { fieldPatterns } from "../commonMappings";
import { calculateStringSimilarity } from "../utils/stringSimilarity";

/**
 * Generates mapping suggestions based on predefined field patterns.
 * This algorithm checks if source and destination fields match any common patterns
 * defined in the `fieldPatterns` object.
 */
export const generatePatternBasedSuggestions = (
  sourceFields: string[],
  destinationFields: string[],
  objectType: string
): MappingSuggestion[] => {
  const suggestions: MappingSuggestion[] = [];

  // Ensure the objectType is a valid key in fieldPatterns
  if (!(objectType in fieldPatterns)) {
    console.warn(`No field patterns defined for object type: ${objectType}`);
    return suggestions;
  }

  const patterns = fieldPatterns[objectType as keyof typeof fieldPatterns];

  sourceFields.forEach((sourceField) => {
    for (const [patternKey, patternValues] of Object.entries(patterns)) {
      // Check if the source field matches any of the pattern values
      if (patternValues.includes(sourceField.toLowerCase())) {
        // Find the best matching destination field for this pattern
        let bestMatch: string | null = null;
        let bestScore = 0;

        destinationFields.forEach((destinationField) => {
          const similarityScore = calculateStringSimilarity(patternKey, destinationField);
          if (similarityScore > bestScore) {
            bestScore = similarityScore;
            bestMatch = destinationField;
          }
        });

        if (bestMatch) {
          suggestions.push({
            source_field: sourceField,
            destination_field: bestMatch,
            confidence: 0.8, // Confidence level for pattern-based matches
            reason: `Matched pattern for ${patternKey}`,
          });
        }
      }
    }
  });

  return suggestions;
};
