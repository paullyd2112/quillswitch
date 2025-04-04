
import { supabase } from "@/integrations/supabase/client";
import { FieldMapping } from "@/integrations/supabase/migrationTypes";
import { handleServiceError } from "../utils/serviceUtils";
import { 
  MappingSuggestion, 
  findExactMatches, 
  findPatternMatches, 
  findSimilarityMatches 
} from "./fieldMapping/mappingAlgorithms";

/**
 * Generate automated field mapping suggestions based on field names, data types,
 * and common mapping patterns.
 */
export const generateMappingSuggestions = async (
  objectTypeId: string,
  sourceFields: string[],
  destinationFields: string[]
): Promise<MappingSuggestion[]> => {
  try {
    const suggestions: MappingSuggestion[] = [];
    
    // Process each source field
    sourceFields.forEach(sourceField => {
      // First try exact matches
      const exactMatch = findExactMatches(sourceField, destinationFields);
      
      if (exactMatch) {
        suggestions.push(exactMatch);
        return;
      }
      
      // Try pattern-based matches
      const patternMatch = findPatternMatches(sourceField, destinationFields);
      
      if (patternMatch) {
        suggestions.push(patternMatch);
        return;
      }
      
      // If still no match, use string similarity
      const similarityMatch = findSimilarityMatches(sourceField, destinationFields);
      
      if (similarityMatch) {
        suggestions.push(similarityMatch);
      }
    });
    
    // Sort suggestions by confidence
    return suggestions.sort((a, b) => b.confidence - a.confidence);
  } catch (error: any) {
    handleServiceError(error, "Error generating mapping suggestions", true);
    return [];
  }
};

/**
 * Apply suggested mappings to create actual field mappings
 */
export const applyMappingSuggestions = async (
  objectTypeId: string,
  projectId: string,
  suggestions: MappingSuggestion[]
): Promise<FieldMapping[]> => {
  try {
    // Filter suggestions to only include those with reasonable confidence
    const validSuggestions = suggestions.filter(s => s.confidence >= 0.5);
    
    if (validSuggestions.length === 0) {
      return [];
    }
    
    // Create field mapping objects
    const mappings = validSuggestions.map(suggestion => ({
      object_type_id: objectTypeId,
      project_id: projectId,
      source_field: suggestion.source_field,
      destination_field: suggestion.destination_field,
      is_required: suggestion.is_required || false,
      transformation_rule: null
    }));
    
    // Insert the mappings
    const { data, error } = await supabase
      .from('field_mappings')
      .insert(mappings)
      .select();
    
    if (error) throw error;
    
    return data || [];
  } catch (error: any) {
    return handleServiceError(error, "Error applying mapping suggestions", true);
  }
};
