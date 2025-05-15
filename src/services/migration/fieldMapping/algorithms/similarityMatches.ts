
import { MappingSuggestion } from "../types";

/**
 * Find similar fields based on similarity scoring
 * Used when exact matches aren't found
 */
export const findSimilarityMatches = (
  sourceField: string,
  destinationFields: string[],
  minimumConfidence: number = 0.6
): MappingSuggestion | null => {
  let bestMatch: MappingSuggestion | null = null;
  let highestConfidence = 0;
  
  // Basic similarity function
  const calculateSimilarity = (s1: string, s2: string): number => {
    // Normalize both strings for comparison
    const normalize = (str: string) => str.toLowerCase().replace(/[_-\s]/g, "");
    const norm1 = normalize(s1);
    const norm2 = normalize(s2);
    
    // Very simple similarity - check if one contains the other
    if (norm1.includes(norm2) || norm2.includes(norm1)) {
      // Calculate a ratio based on length difference
      const lengthRatio = Math.min(norm1.length, norm2.length) / Math.max(norm1.length, norm2.length);
      return 0.7 + (lengthRatio * 0.3); // Base 0.7 score for containment, plus up to 0.3 for length similarity
    }
    
    // Check for common substrings
    let longestCommon = 0;
    for (let i = 0; i < norm1.length; i++) {
      for (let j = 0; j < norm2.length; j++) {
        let k = 0;
        while (
          i + k < norm1.length && 
          j + k < norm2.length && 
          norm1[i + k] === norm2[j + k]
        ) {
          k++;
        }
        
        if (k > longestCommon) {
          longestCommon = k;
        }
      }
    }
    
    // Calculate similarity based on longest common substring
    if (longestCommon > 2) {
      return longestCommon / Math.max(norm1.length, norm2.length);
    }
    
    return 0; // No significant similarity
  };
  
  // Check each destination field
  for (const destField of destinationFields) {
    const confidence = calculateSimilarity(sourceField, destField);
    
    if (confidence > highestConfidence && confidence >= minimumConfidence) {
      highestConfidence = confidence;
      bestMatch = {
        source_field: sourceField,
        destination_field: destField,
        confidence: confidence,
        reason: `Field name similarity (${Math.round(confidence * 100)}% match)`
      };
    }
  }
  
  return bestMatch;
};
