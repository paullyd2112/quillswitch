
import { supabase } from "@/integrations/supabase/client";
import { handleServiceError } from "../utils/serviceUtils";

/**
 * Types for the automated mapping service
 */
export interface MappingSuggestion {
  sourceField: string;
  destinationField: string;
  confidence: number; // 0-1 score of confidence in the mapping
  reason?: string; // Explanation of why this mapping was suggested
}

export interface MappingRequest {
  sourceSystem: string;
  destinationSystem: string;
  objectType: string;
  sourceFields: string[];
  destinationFields: string[];
  projectId: string;
}

/**
 * Generate automated mapping suggestions
 */
export const generateMappingSuggestions = async (request: MappingRequest): Promise<MappingSuggestion[]> => {
  try {
    const { sourceSystem, destinationSystem, objectType, sourceFields, destinationFields } = request;
    
    // In a real app, we would call an AI service or use predefined rules
    // For now, we'll create mock suggestions
    
    // Simple exact or partial name match algorithm
    const suggestions: MappingSuggestion[] = [];
    
    // First try exact matches (case insensitive)
    sourceFields.forEach(sourceField => {
      const normalizedSourceField = sourceField.toLowerCase();
      
      // Try to find exact matches first
      const exactMatch = destinationFields.find(
        destField => destField.toLowerCase() === normalizedSourceField
      );
      
      if (exactMatch) {
        suggestions.push({
          sourceField,
          destinationField: exactMatch,
          confidence: 0.9,
          reason: "Exact field name match"
        });
      }
    });
    
    // Add near matches for fields that didn't have exact matches
    sourceFields.forEach(sourceField => {
      // Skip if this source field already has a high confidence match
      if (suggestions.some(s => s.sourceField === sourceField && s.confidence > 0.7)) {
        return;
      }
      
      const normalizedSourceField = sourceField.toLowerCase();
      
      // Find destination fields containing this source field or vice versa
      destinationFields.forEach(destField => {
        const normalizedDestField = destField.toLowerCase();
        
        if (normalizedSourceField.includes(normalizedDestField) || 
            normalizedDestField.includes(normalizedSourceField)) {
          suggestions.push({
            sourceField,
            destinationField: destField,
            confidence: 0.6,
            reason: "Partial field name match"
          });
        }
      });
    });
    
    return suggestions;
  } catch (error: any) {
    handleServiceError(error, "Error generating mapping suggestions");
    return [];
  }
};

/**
 * Apply and save mapping suggestions
 */
export const applyMappingSuggestions = async (
  projectId: string,
  objectTypeId: string,
  suggestions: MappingSuggestion[]
): Promise<boolean> => {
  try {
    // Convert suggestions to field mappings
    const mappings = suggestions.map(suggestion => ({
      project_id: projectId,
      object_type_id: objectTypeId,
      source_field: suggestion.sourceField,
      destination_field: suggestion.destinationField,
      transformation_rule: null,
      is_required: false,
      status: 'active',
      created_by: supabase.auth.getUser().then(({ data }) => data.user?.id) || null,
      confidence_score: suggestion.confidence
    }));
    
    // In a real app, we would save these to the database
    console.log("Would save mappings:", mappings);
    
    return true;
  } catch (error: any) {
    handleServiceError(error, "Error applying mapping suggestions");
    return false;
  }
};
