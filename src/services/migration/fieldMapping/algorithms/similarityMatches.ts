
import { MappingSuggestion } from "../types";
import { calculateStringSimilarity } from "../utils/stringSimilarity";

/**
 * Find matches based on string similarity when other methods fail
 */
export const findSimilarityMatches = (
  sourceField: string,
  destinationFields: string[]
): MappingSuggestion | null => {
  const sourceNormalized = sourceField.toLowerCase().replace(/[^a-z0-9]/g, "");
  const bestMatches: { field: string; confidence: number; reason: string }[] = [];
  
  destinationFields.forEach(destField => {
    const destNormalized = destField.toLowerCase().replace(/[^a-z0-9]/g, "");
    
    // Direct string similarity
    const similarity = calculateStringSimilarity(sourceNormalized, destNormalized);
    
    // Tokenize fields by splitting camelCase, snake_case, etc.
    const sourceTokens = sourceField.toLowerCase()
      .replace(/_/g, ' ')
      .replace(/([A-Z])/g, ' $1')
      .trim()
      .split(/\s+/);
    
    const destTokens = destField.toLowerCase()
      .replace(/_/g, ' ')
      .replace(/([A-Z])/g, ' $1')
      .trim()
      .split(/\s+/);
    
    // Check for shared tokens
    const sharedTokens = sourceTokens.filter(token => destTokens.includes(token));
    const tokenSimilarity = sharedTokens.length / Math.max(sourceTokens.length, destTokens.length);
    
    // Combine different similarity measures
    let combinedSimilarity = Math.max(similarity, tokenSimilarity);
    let reason = "Field name similarity";
    
    // Calculate final confidence
    let confidence = 0;
    if (combinedSimilarity > 0.85) {
      confidence = 0.75;
      reason = "High field name similarity";
    } else if (combinedSimilarity > 0.7) {
      confidence = 0.65;
      reason = "Good field name similarity";
    } else if (combinedSimilarity > 0.5) {
      confidence = 0.5;
      reason = "Moderate field name similarity";
    } else if (sharedTokens.length > 0) {
      confidence = 0.4;
      reason = `Shares ${sharedTokens.length} word parts`;
    }
    
    if (confidence > 0) {
      bestMatches.push({ field: destField, confidence, reason });
    }
  });
  
  // Take the best match if we have any
  if (bestMatches.length > 0) {
    const bestMatch = bestMatches.sort((a, b) => b.confidence - a.confidence)[0];
    return {
      source_field: sourceField,
      destination_field: bestMatch.field,
      confidence: bestMatch.confidence,
      is_required: false,
      reason: bestMatch.reason
    };
  }
  
  return null;
};
