
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { callGeminiApi } from "../gemini/geminiService";
import { MappingSuggestion } from "@/components/migration/automated-mapping/types";

/**
 * Generate mapping suggestions using field name similarity and AI assistance
 */
export const generateMappingSuggestions = async (
  objectTypeId: string,
  fields: string[] // Combined source and destination fields
): Promise<MappingSuggestion[]> => {
  try {
    // Split fields in half for source and destination if needed
    // This is a workaround for the parameter change
    const midpoint = Math.floor(fields.length / 2);
    const sourceFields = fields.slice(0, midpoint);
    const destinationFields = fields.slice(midpoint);

    console.log('Generating mapping suggestions for object type:', objectTypeId);
    
    // Get field metadata
    const { data: objectType, error } = await supabase
      .from('migration_object_types')
      .select('name, source_id, destination_id')
      .eq('id', objectTypeId)
      .single();
    
    if (error) throw error;
    
    // Use AI to suggest mappings
    const aiSuggestions = await generateAiMappingSuggestions(sourceFields, destinationFields);
    
    // Return combined suggestions
    return aiSuggestions;
  } catch (error: any) {
    console.error("Error generating mapping suggestions:", error);
    toast.error("Failed to generate mapping suggestions");
    return [];
  }
};

/**
 * Apply generated mapping suggestions to the database
 */
export const applyMappingSuggestions = async (
  objectTypeId: string,
  suggestions: MappingSuggestion[]
): Promise<boolean> => {
  try {
    console.log(`Applying ${suggestions.length} mapping suggestions for object type: ${objectTypeId}`);
    
    // Prepare mapping objects for database insertion
    const mappingsToInsert = suggestions.map(suggestion => ({
      object_type_id: objectTypeId,
      source_field: suggestion.source_field,
      destination_field: suggestion.destination_field,
      transformation_rule: null,
      confidence_score: suggestion.confidence || 0.5
    }));
    
    // Delete existing mappings first
    const { error: deleteError } = await supabase
      .from('field_mappings')
      .delete()
      .eq('object_type_id', objectTypeId);
    
    if (deleteError) throw deleteError;
    
    // Insert new mappings
    const { error: insertError } = await supabase
      .from('field_mappings')
      .insert(mappingsToInsert);
    
    if (insertError) throw insertError;
    
    console.log(`Successfully applied ${mappingsToInsert.length} mappings`);
    return true;
  } catch (error: any) {
    console.error("Error applying mapping suggestions:", error);
    toast.error("Failed to apply mapping suggestions");
    return false;
  }
};

/**
 * Generate mapping suggestions using Gemini API
 */
const generateAiMappingSuggestions = async (
  sourceFields: string[],
  destinationFields: string[]
): Promise<MappingSuggestion[]> => {
  try {
    const response = await callGeminiApi({
      sourceFields,
      destinationFields
    });
    
    if (!response) {
      throw new Error("Failed to get response from Gemini API");
    }
    
    try {
      // Parse JSON response from AI
      const suggestions = JSON.parse(response);
      
      if (!Array.isArray(suggestions)) {
        throw new Error("Invalid response format from Gemini API");
      }
      
      return suggestions.map(suggestion => ({
        source_field: suggestion.source_field,
        destination_field: suggestion.destination_field,
        confidence: suggestion.confidence || 0.8,
        reason: suggestion.reason || "AI-generated mapping"
      }));
    } catch (parseError) {
      console.error("Failed to parse AI suggestions:", parseError);
      return [];
    }
  } catch (error) {
    console.error("Error generating AI mapping suggestions:", error);
    return [];
  }
};
