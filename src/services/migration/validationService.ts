
import { supabase } from "@/integrations/supabase/client";
import { apiClient } from "./apiClient";
import { toast } from "@/hooks/use-toast";

/**
 * Types for data validation
 */
export interface ValidationRule {
  field: string;
  rule: 'required' | 'format' | 'length' | 'range' | 'unique' | 'custom';
  params?: any;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  invalidRecords: number;
  validRecords: number;
  errors: Array<{
    recordId: string;
    field: string;
    message: string;
  }>;
}

/**
 * Validates a data set against defined rules
 */
export const validateData = async (
  source: string,
  dataType: string,
  rules: ValidationRule[]
): Promise<ValidationResult> => {
  try {
    // Get sample data to validate
    let data: any[] = [];
    
    switch (dataType) {
      case 'contacts':
        const contactsResponse = await apiClient.contacts.getContacts(source, 1, 100);
        data = contactsResponse.data?.data || [];
        break;
      case 'accounts':
        const accountsResponse = await apiClient.accounts.getAccounts(source, 1, 100);
        data = accountsResponse.data?.data || [];
        break;
      case 'opportunities':
        const opportunitiesResponse = await apiClient.opportunities.getOpportunities(source, 1, 100);
        data = opportunitiesResponse.data?.data || [];
        break;
      default:
        throw new Error(`Unsupported data type: ${dataType}`);
    }
    
    // Apply validation rules
    const errors: Array<{recordId: string; field: string; message: string}> = [];
    
    data.forEach(record => {
      rules.forEach(rule => {
        const fieldValue = record[rule.field];
        let isValid = true;
        
        switch (rule.rule) {
          case 'required':
            isValid = fieldValue !== undefined && fieldValue !== null && fieldValue !== '';
            break;
          case 'format':
            isValid = new RegExp(rule.params.pattern).test(String(fieldValue || ''));
            break;
          case 'length':
            isValid = String(fieldValue || '').length >= (rule.params.min || 0) && 
                     String(fieldValue || '').length <= (rule.params.max || Infinity);
            break;
          case 'range':
            isValid = Number(fieldValue || 0) >= (rule.params.min || -Infinity) && 
                     Number(fieldValue || 0) <= (rule.params.max || Infinity);
            break;
          case 'unique':
            // For unique validation, we need to check across all records
            isValid = data.filter(r => r[rule.field] === fieldValue).length === 1;
            break;
          case 'custom':
            isValid = rule.params.validationFn(fieldValue, record);
            break;
        }
        
        if (!isValid) {
          errors.push({
            recordId: record.id || 'unknown',
            field: rule.field,
            message: rule.message
          });
        }
      });
    });
    
    // Create validation result
    const result: ValidationResult = {
      valid: errors.length === 0,
      invalidRecords: new Set(errors.map(e => e.recordId)).size,
      validRecords: data.length - new Set(errors.map(e => e.recordId)).size,
      errors: errors
    };
    
    // Store validation report in the database
    if (data.length > 0) {
      await storeValidationReport(dataType, result);
    }
    
    return result;
  } catch (error: any) {
    console.error("Validation error:", error);
    toast({
      title: "Validation Error",
      description: error.message || "Failed to validate data",
      variant: "destructive",
    });
    
    return {
      valid: false,
      invalidRecords: 0,
      validRecords: 0,
      errors: [{
        recordId: 'system',
        field: 'system',
        message: error.message || "Validation system error"
      }]
    };
  }
};

/**
 * Store validation report in the database
 */
const storeValidationReport = async (objectType: string, result: ValidationResult) => {
  try {
    const { data: objectTypeData } = await supabase
      .from('migration_object_types')
      .select('id, project_id')
      .eq('name', objectType)
      .single();
    
    if (!objectTypeData) {
      throw new Error(`Object type ${objectType} not found`);
    }
    
    const { error } = await supabase
      .from('validation_reports')
      .insert({
        report_type: 'pre_migration',
        object_type_id: objectTypeData.id,
        project_id: objectTypeData.project_id,
        valid_records: result.validRecords,
        invalid_records: result.invalidRecords,
        report_data: {
          errors: result.errors,
          timestamp: new Date().toISOString()
        }
      });
    
    if (error) throw error;
  } catch (error: any) {
    console.error("Failed to store validation report:", error);
  }
};

/**
 * Get validation reports for an object type
 */
export const getValidationReports = async (objectTypeId: string) => {
  try {
    const { data, error } = await supabase
      .from('validation_reports')
      .select('*')
      .eq('object_type_id', objectTypeId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data || [];
  } catch (error: any) {
    console.error("Failed to get validation reports:", error);
    return [];
  }
};

/**
 * Common validation rule sets for different data types
 */
export const commonValidationRules: Record<string, ValidationRule[]> = {
  contacts: [
    { field: 'email', rule: 'format', params: { pattern: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$' }, message: 'Invalid email format' },
    { field: 'firstName', rule: 'required', message: 'First name is required' },
    { field: 'phone', rule: 'format', params: { pattern: '^[\\d\\+\\-\\(\\) ]+$' }, message: 'Invalid phone format' }
  ],
  accounts: [
    { field: 'name', rule: 'required', message: 'Account name is required' },
    { field: 'industry', rule: 'required', message: 'Industry is required' }
  ],
  opportunities: [
    { field: 'name', rule: 'required', message: 'Opportunity name is required' },
    { field: 'amount', rule: 'range', params: { min: 0 }, message: 'Amount must be positive' },
    { field: 'closeDate', rule: 'required', message: 'Close date is required' }
  ]
};
