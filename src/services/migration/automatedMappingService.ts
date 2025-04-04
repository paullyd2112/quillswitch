
import { supabase } from "@/integrations/supabase/client";
import { FieldMapping } from "@/integrations/supabase/migrationTypes";
import { handleServiceError } from "../utils/serviceUtils";

interface MappingSuggestion {
  source_field: string;
  destination_field: string;
  confidence: number;
  is_required?: boolean;
}

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
    // Common field name patterns and their variations
    const commonMappings: Record<string, string[]> = {
      // Contact mappings
      "email": ["email", "email_address", "emailaddress", "contact_email"],
      "name": ["name", "full_name", "fullname", "contact_name"],
      "first_name": ["first_name", "firstname", "given_name", "givenname"],
      "last_name": ["last_name", "lastname", "surname", "family_name"],
      "phone": ["phone", "phone_number", "phonenumber", "telephone", "mobile", "cell"],
      "company": ["company", "company_name", "companyname", "organization", "organisation"],
      "title": ["title", "job_title", "jobtitle", "position"],
      
      // Account/Company mappings
      "account_name": ["account_name", "accountname", "company_name", "companyname"],
      "industry": ["industry", "sector", "business_type"],
      "website": ["website", "web_site", "site", "url", "web"],
      "employees": ["employees", "employee_count", "num_employees", "number_of_employees"],
      "revenue": ["revenue", "annual_revenue", "yearly_revenue"],
      
      // Address fields
      "address": ["address", "street_address", "streetaddress", "mailing_address"],
      "city": ["city", "town"],
      "state": ["state", "province", "region"],
      "postal_code": ["postal_code", "postalcode", "zip", "zip_code", "zipcode"],
      "country": ["country", "nation"],
      
      // Opportunity/Deal fields
      "amount": ["amount", "deal_amount", "opportunity_amount", "value"],
      "stage": ["stage", "deal_stage", "opportunity_stage", "sales_stage"],
      "close_date": ["close_date", "closedate", "expected_close_date", "close", "closing_date"],
      "probability": ["probability", "win_probability", "likelihood", "confidence"]
    };
    
    // Required fields in most CRMs
    const requiredFields = ["email", "name", "account_name"];
    
    const suggestions: MappingSuggestion[] = [];
    
    // For each source field, find the best match in destination fields
    sourceFields.forEach(sourceField => {
      const sourceNormalized = sourceField.toLowerCase().replace(/[^a-z0-9]/g, "");
      let bestMatch: { field: string; confidence: number } = { field: "", confidence: 0 };
      
      // First try exact matches
      const exactMatch = destinationFields.find(
        df => df.toLowerCase() === sourceField.toLowerCase()
      );
      
      if (exactMatch) {
        suggestions.push({
          source_field: sourceField,
          destination_field: exactMatch,
          confidence: 1.0,
          is_required: requiredFields.some(rf => 
            commonMappings[rf]?.some(variant => 
              variant.toLowerCase() === sourceNormalized
            )
          )
        });
        return;
      }
      
      // Then try common mappings
      for (const [standard, variations] of Object.entries(commonMappings)) {
        if (variations.some(v => v.toLowerCase().replace(/[^a-z0-9]/g, "") === sourceNormalized)) {
          // Found a standard mapping, look for matching destination field
          const matchingDestField = destinationFields.find(df => 
            variations.some(v => v.toLowerCase() === df.toLowerCase())
          );
          
          if (matchingDestField) {
            suggestions.push({
              source_field: sourceField,
              destination_field: matchingDestField,
              confidence: 0.9,
              is_required: requiredFields.includes(standard)
            });
            return;
          }
          
          // If no exact match in destination, find the best partial match
          const destMatches = destinationFields.map(df => {
            const dfNormalized = df.toLowerCase().replace(/[^a-z0-9]/g, "");
            // Check if destination field contains the standard pattern
            if (dfNormalized.includes(standard.replace(/[^a-z0-9]/g, ""))) {
              return { field: df, confidence: 0.8 };
            }
            // Check for partial matches in variations
            for (const variant of variations) {
              const variantNorm = variant.replace(/[^a-z0-9]/g, "");
              if (dfNormalized.includes(variantNorm) || variantNorm.includes(dfNormalized)) {
                return { field: df, confidence: 0.7 };
              }
            }
            return { field: df, confidence: 0 };
          });
          
          const bestDestMatch = destMatches.reduce((best, current) => 
            current.confidence > best.confidence ? current : best, 
            { field: "", confidence: 0 }
          );
          
          if (bestDestMatch.confidence > 0) {
            suggestions.push({
              source_field: sourceField,
              destination_field: bestDestMatch.field,
              confidence: bestDestMatch.confidence,
              is_required: requiredFields.includes(standard)
            });
            return;
          }
        }
      }
      
      // If still no match, try fuzzy matching on field names
      destinationFields.forEach(destField => {
        const destNormalized = destField.toLowerCase().replace(/[^a-z0-9]/g, "");
        
        // Simple similarity calculation based on shared characters
        let similarity = 0;
        
        // Check for substrings
        if (sourceNormalized.includes(destNormalized) || destNormalized.includes(sourceNormalized)) {
          similarity = 0.6;
        } 
        // Check for partial matches (at least 3 characters)
        else if (sourceNormalized.length >= 3 && destNormalized.length >= 3) {
          for (let i = 0; i < sourceNormalized.length - 2; i++) {
            const chunk = sourceNormalized.substring(i, i + 3);
            if (destNormalized.includes(chunk)) {
              similarity = 0.5;
              break;
            }
          }
        }
        
        if (similarity > bestMatch.confidence) {
          bestMatch = { field: destField, confidence: similarity };
        }
      });
      
      if (bestMatch.confidence > 0) {
        suggestions.push({
          source_field: sourceField,
          destination_field: bestMatch.field,
          confidence: bestMatch.confidence,
          is_required: false
        });
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
