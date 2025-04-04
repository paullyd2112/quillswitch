
import { supabase } from "@/integrations/supabase/client";
import { FieldMapping } from "@/integrations/supabase/migrationTypes";
import { handleServiceError } from "../utils/serviceUtils";

interface MappingSuggestion {
  source_field: string;
  destination_field: string;
  confidence: number;
  is_required?: boolean;
  reason?: string;
}

// Levenshtein distance calculation for string similarity
const levenshteinDistance = (a: string, b: string): number => {
  const matrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));

  for (let i = 0; i <= a.length; i++) {
    matrix[0][i] = i;
  }

  for (let j = 0; j <= b.length; j++) {
    matrix[j][0] = j;
  }

  for (let j = 1; j <= b.length; j++) {
    for (let i = 1; i <= a.length; i++) {
      const indicator = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] + indicator
      );
    }
  }

  return matrix[b.length][a.length];
};

// Calculate similarity score between two strings (0-1)
const calculateStringSimilarity = (a: string, b: string): number => {
  if (!a || !b) return 0;
  if (a === b) return 1;
  
  const maxLength = Math.max(a.length, b.length);
  if (maxLength === 0) return 1;
  
  const distance = levenshteinDistance(a.toLowerCase(), b.toLowerCase());
  return (maxLength - distance) / maxLength;
};

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
    // Enhanced common field name patterns with more variations and categories
    const commonMappings: Record<string, { variations: string[], required: boolean, category: string }> = {
      // Contact fields
      "email": { 
        variations: ["email", "email_address", "emailaddress", "contact_email", "primary_email", "work_email", "business_email", "personal_email", "e_mail", "mail"],
        required: true,
        category: "contact"
      },
      "name": { 
        variations: ["name", "full_name", "fullname", "contact_name", "complete_name", "display_name"],
        required: true,
        category: "contact"
      },
      "first_name": { 
        variations: ["first_name", "firstname", "given_name", "givenname", "forename", "first", "contact_firstname"],
        required: false,
        category: "contact"
      },
      "last_name": { 
        variations: ["last_name", "lastname", "surname", "family_name", "familyname", "contact_lastname"],
        required: false,
        category: "contact"
      },
      "phone": { 
        variations: ["phone", "phone_number", "phonenumber", "telephone", "mobile", "cell", "contact_phone", "work_phone", "business_phone", "mobile_phone", "primary_phone", "phone_work", "phone_mobile"],
        required: false,
        category: "contact"
      },
      "company": { 
        variations: ["company", "company_name", "companyname", "organization", "organisation", "business", "employer", "firm", "company_id"],
        required: false,
        category: "contact"
      },
      "title": { 
        variations: ["title", "job_title", "jobtitle", "position", "role", "job_role", "job_position", "designation", "job_function"],
        required: false,
        category: "contact"
      },
      
      // Account/Company mappings
      "account_name": { 
        variations: ["account_name", "accountname", "company_name", "companyname", "business_name", "organization_name", "org_name", "account", "account_id", "client_name"],
        required: true,
        category: "account"
      },
      "industry": { 
        variations: ["industry", "sector", "business_type", "company_industry", "account_industry", "business_sector", "industry_type", "market_segment"],
        required: false,
        category: "account"
      },
      "website": { 
        variations: ["website", "web_site", "site", "url", "web", "company_website", "web_address", "homepage", "domain", "web_url"],
        required: false,
        category: "account"
      },
      "employees": { 
        variations: ["employees", "employee_count", "num_employees", "number_of_employees", "company_size", "company_employees", "staff_count", "headcount", "size", "total_employees"],
        required: false,
        category: "account"
      },
      "revenue": { 
        variations: ["revenue", "annual_revenue", "yearly_revenue", "company_revenue", "account_revenue", "total_revenue", "turnover", "sales_revenue", "income"],
        required: false,
        category: "account"
      },
      
      // Address fields
      "address": { 
        variations: ["address", "street_address", "streetaddress", "mailing_address", "primary_address", "billing_address", "shipping_address", "street", "address_line_1", "address1"],
        required: false,
        category: "address"
      },
      "city": { 
        variations: ["city", "town", "municipality", "locality", "city_name", "billing_city", "shipping_city", "address_city"],
        required: false,
        category: "address"
      },
      "state": { 
        variations: ["state", "province", "region", "county", "territory", "billing_state", "shipping_state", "address_state", "state_province"],
        required: false,
        category: "address"
      },
      "postal_code": { 
        variations: ["postal_code", "postalcode", "zip", "zip_code", "zipcode", "billing_zip", "shipping_zip", "address_zip", "pincode", "postcode"],
        required: false,
        category: "address"
      },
      "country": { 
        variations: ["country", "nation", "billing_country", "shipping_country", "address_country", "country_code", "country_name"],
        required: false,
        category: "address"
      },
      
      // Opportunity/Deal fields
      "amount": { 
        variations: ["amount", "deal_amount", "opportunity_amount", "value", "deal_value", "opportunity_value", "price", "contract_value", "total_amount"],
        required: false,
        category: "opportunity"
      },
      "stage": { 
        variations: ["stage", "deal_stage", "opportunity_stage", "sales_stage", "pipeline_stage", "status", "deal_status", "phase", "step"],
        required: false,
        category: "opportunity"
      },
      "close_date": { 
        variations: ["close_date", "closedate", "expected_close_date", "close", "closing_date", "completion_date", "end_date", "finish_date", "deal_close_date"],
        required: false,
        category: "opportunity"
      },
      "probability": { 
        variations: ["probability", "win_probability", "likelihood", "confidence", "chance", "win_rate", "success_probability", "forecast", "win_likelihood"],
        required: false,
        category: "opportunity"
      },
      
      // Additional common fields
      "description": {
        variations: ["description", "notes", "details", "comments", "info", "summary", "overview", "about", "remarks", "text"],
        required: false,
        category: "general"
      },
      "owner": {
        variations: ["owner", "owner_id", "owner_name", "assigned_to", "assignee", "responsible", "sales_rep", "rep", "agent", "account_manager"],
        required: false,
        category: "general"
      },
      "date_created": {
        variations: ["date_created", "created_date", "creation_date", "date_added", "created_on", "created_at", "create_date", "entry_date"],
        required: false,
        category: "general"
      },
      "date_modified": {
        variations: ["date_modified", "modified_date", "last_modified", "updated_date", "updated_on", "updated_at", "last_update", "edit_date"],
        required: false,
        category: "general"
      }
    };
    
    const suggestions: MappingSuggestion[] = [];
    
    // Process each source field
    sourceFields.forEach(sourceField => {
      const sourceNormalized = sourceField.toLowerCase().replace(/[^a-z0-9]/g, "");
      const bestMatches: { field: string; confidence: number; reason: string }[] = [];
      
      // First try exact matches
      const exactMatch = destinationFields.find(
        df => df.toLowerCase() === sourceField.toLowerCase()
      );
      
      if (exactMatch) {
        // Find which category/type this is if possible
        let fieldCategory = "general";
        let isRequired = false;
        
        for (const [standard, info] of Object.entries(commonMappings)) {
          if (info.variations.some(v => v.toLowerCase() === sourceField.toLowerCase())) {
            fieldCategory = info.category;
            isRequired = info.required;
            break;
          }
        }
        
        suggestions.push({
          source_field: sourceField,
          destination_field: exactMatch,
          confidence: 1.0,
          is_required: isRequired,
          reason: "Exact field name match"
        });
        return;
      }
      
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
            suggestions.push({
              source_field: sourceField,
              destination_field: bestMatch.field,
              confidence: bestMatch.confidence,
              is_required: required,
              reason: bestMatch.reason
            });
            return;
          }
        }
      }
      
      // If still no match, use advanced string similarity for all fields
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
        suggestions.push({
          source_field: sourceField,
          destination_field: bestMatch.field,
          confidence: bestMatch.confidence,
          is_required: false,
          reason: bestMatch.reason
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
