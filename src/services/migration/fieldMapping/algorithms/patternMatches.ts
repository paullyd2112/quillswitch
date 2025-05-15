
import { MappingSuggestion } from "../types";
import { commonMappings } from "../commonMappings";

/**
 * Find matches based on common patterns and naming conventions
 */
export const findPatternMatches = (
  sourceField: string,
  destinationFields: string[]
): MappingSuggestion | null => {
  // Normalize the field name (lowercase, remove underscores/spaces)
  const normalizeField = (field: string) => field.toLowerCase().replace(/[_\s-]/g, "");
  const normalizedSource = normalizeField(sourceField);
  
  // Check if the source field matches any of our common field variations
  for (const [standardField, info] of Object.entries(commonMappings)) {
    if (info.variations.some(v => normalizeField(v) === normalizedSource)) {
      // This source field is a known field type, look for matching dest fields
      for (const destField of destinationFields) {
        const normalizedDest = normalizeField(destField);
        
        if (info.variations.some(v => normalizeField(v) === normalizedDest)) {
          return {
            source_field: sourceField,
            destination_field: destField,
            confidence: 0.95,
            is_required: info.required,
            reason: `Standard field pattern match (${info.standard_name})`
          };
        }
      }
      
      // If we got here, we know the source is a standard field, but couldn't find a match
      return null;
    }
  }
  
  // Check for common prefixes/suffixes and patterns
  const patterns = [
    { pattern: /^(customer|client|account|company)(.+)$/, type: 'company' },
    { pattern: /^(contact|person|user|lead)(.+)$/, type: 'contact' },
    { pattern: /^(deal|opportunity|sale)(.+)$/, type: 'opportunity' },
    { pattern: /(.+)(email|mail)$/, type: 'email' },
    { pattern: /(.+)(phone|mobile|cell|fax)$/, type: 'phone' },
    { pattern: /(.+)(date|time|on|at)$/, type: 'datetime' },
    { pattern: /(.+)(amount|value|price|cost)$/, type: 'amount' },
    { pattern: /^(is|has|can)(.+)$/, type: 'boolean' }
  ];
  
  const sourcePatternMatch = patterns.find(p => p.pattern.test(normalizedSource));
  if (sourcePatternMatch) {
    for (const destField of destinationFields) {
      const normalizedDest = normalizeField(destField);
      if (patterns.some(p => p.type === sourcePatternMatch.type && p.pattern.test(normalizedDest))) {
        return {
          source_field: sourceField,
          destination_field: destField,
          confidence: 0.8,
          reason: `Pattern match (${sourcePatternMatch.type} pattern)`
        };
      }
    }
  }
  
  return null;
};
