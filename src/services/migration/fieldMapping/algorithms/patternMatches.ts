
import { MappingSuggestion } from "../types";
import { fieldPatterns } from "../commonMappings";
import { calculateStringSimilarity } from "../utils/stringSimilarity";

/**
 * Find matches based on predefined field patterns
 */
export const findPatternMatches = (
  sourceField: string,
  destinationFields: string[]
): MappingSuggestion | null => {
  // For each object type (contact, account, opportunity)
  for (const [objectType, patterns] of Object.entries(fieldPatterns)) {
    // For each pattern category (email, phone, etc)
    for (const [patternName, patternValues] of Object.entries(patterns)) {
      // If sourceField matches any pattern value
      if (patternValues.includes(sourceField.toLowerCase())) {
        // Find best matching destination field
        let bestMatch: { field: string; score: number } = { field: "", score: 0 };
        
        for (const destField of destinationFields) {
          const score = calculateStringSimilarity(patternName, destField);
          if (score > bestMatch.score) {
            bestMatch = { field: destField, score };
          }
        }
        
        if (bestMatch.score > 0.6) {
          return {
            source_field: sourceField,
            destination_field: bestMatch.field,
            confidence: 0.8, // Pattern matches are considered fairly confident
            reason: `Matched pattern for ${patternName} in ${objectType} fields`
          };
        }
      }
    }
  }
  
  return null;
};
