
import { MappingSuggestion } from "../types";
import { commonMappings } from "../commonMappings";
import { calculateStringSimilarity } from "../utils/stringSimilarity";

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
