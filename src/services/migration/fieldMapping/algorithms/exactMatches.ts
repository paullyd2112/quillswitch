
import { MappingSuggestion } from "../types";
import { commonMappings } from "../commonMappings";

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
