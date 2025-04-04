
import { calculateStringSimilarity } from "../utils/stringSimilarity";
import { commonMappings } from "./commonMappings";

export interface MappingSuggestion {
  source_field: string;
  destination_field: string;
  confidence: number;
  is_required?: boolean;
  reason?: string;
}

/**
 * Find exact matching fields between source and destination
 */
export const findExactMatches = (
  sourceField: string,
  destinationFields: string[]
): MappingSuggestion | null => {
  const exactMatch = destinationFields.find(
    df => df.toLowerCase() === sourceField.toLowerCase()
  );
  
  if (exactMatch) {
    // Find which category/type this is if possible
    let isRequired = false;
    
    for (const [standard, info] of Object.entries(commonMappings)) {
      if (info.variations.some(v => v.toLowerCase() === sourceField.toLowerCase())) {
        isRequired = info.required;
        break;
      }
    }
    
    return {
      source_field: sourceField,
      destination_field: exactMatch,
      confidence: 1.0,
      is_required: isRequired,
      reason: "Exact field name match"
    };
  }
  
  return null;
};

/**
 * Find matches based on common field patterns
 */
export const findPatternMatches = (
  sourceField: string,
  destinationFields: string[]
): MappingSuggestion | null => {
  const sourceNormalized = sourceField.toLowerCase().replace(/[^a-z0-9]/g, "");
  
  // Try common mappings/patterns
  for (const [standard, info] of Object.entries(commonMappings)) {
    const { variations, required, category } = info;
    
    // Check if source field matches any known pattern
    const matchingPattern = variations.find(v => 
      v.toLowerCase().replace(/[^a-z0-9]/g, "") === sourceNormalized
    );
    
    if (matchingPattern) {
      // Look for a matching destination field
      const matchingDestFields = destinationFields.map(df => {
        const dfNormalized = df.toLowerCase().replace(/[^a-z0-9]/g, "");
        
        // Check for exact pattern matches
        const exactPatternMatch = variations.find(v => 
          v.toLowerCase() === df.toLowerCase()
        );
        
        if (exactPatternMatch) {
          return { 
            field: df, 
            confidence: 0.95, 
            reason: `Standard field pattern match for ${category} data`
          };
        }
        
        // Check for normalized pattern matches
        const normalizedPatternMatch = variations.find(v => 
          v.toLowerCase().replace(/[^a-z0-9]/g, "") === dfNormalized
        );
        
        if (normalizedPatternMatch) {
          return { 
            field: df, 
            confidence: 0.9, 
            reason: `Common field pattern match for ${category} data`
          };
        }
        
        // Check if destination contains the standard name
        if (dfNormalized.includes(standard.replace(/[^a-z0-9]/g, ""))) {
          return { 
            field: df, 
            confidence: 0.85, 
            reason: `Destination field contains the standard ${standard} pattern`
          };
        }
        
        // Check for partial matches in variations
        for (const variant of variations) {
          const variantNorm = variant.replace(/[^a-z0-9]/g, "");
          
          // Calculate string similarity for more accurate matching
          const similarity = calculateStringSimilarity(variantNorm, dfNormalized);
          
          if (similarity > 0.7) {
            return { 
              field: df, 
              confidence: 0.7 + (similarity * 0.15), // Scale between 0.7-0.85
              reason: `Strong similarity to standard ${category} field pattern`
            };
          }
          
          if (dfNormalized.includes(variantNorm) || variantNorm.includes(dfNormalized)) {
            return { 
              field: df, 
              confidence: 0.7, 
              reason: `Partial match with ${category} field pattern`
            };
          }
        }
        
        return null;
      }).filter(Boolean) as { field: string; confidence: number; reason: string }[];
      
      if (matchingDestFields.length > 0) {
        // Sort by confidence and take the best match
        const bestMatch = matchingDestFields.sort((a, b) => b.confidence - a.confidence)[0];
        return {
          source_field: sourceField,
          destination_field: bestMatch.field,
          confidence: bestMatch.confidence,
          is_required: required,
          reason: bestMatch.reason
        };
      }
    }
  }
  
  return null;
};

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
