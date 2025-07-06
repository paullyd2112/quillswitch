import { supabase } from '@/integrations/supabase/client';

export interface ValidationRule {
  field: string;
  type: 'required' | 'email' | 'phone' | 'url' | 'date' | 'numeric' | 'length' | 'regex' | 'custom';
  params?: Record<string, any>;
  message?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  field: string;
  value: any;
  rule: string;
  message: string;
  severity: 'error' | 'warning';
}

export interface ValidationWarning {
  field: string;
  value: any;
  message: string;
  suggestion?: string;
}

export interface DuplicateCheckResult {
  isDuplicate: boolean;
  existingRecordId?: string;
  matchingFields: string[];
  confidence: number;
}

export class DataValidator {
  private static emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  private static phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  private static urlRegex = /^https?:\/\/[^\s$.?#].[^\s]*$/;

  static async validateRecord(
    record: Record<string, any>,
    rules: ValidationRule[],
    objectType: string
  ): Promise<ValidationResult> {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    for (const rule of rules) {
      const value = record[rule.field];
      const validation = await this.validateField(value, rule, record);

      if (!validation.isValid) {
        if (validation.severity === 'error') {
          errors.push({
            field: rule.field,
            value,
            rule: rule.type,
            message: validation.message,
            severity: 'error'
          });
        } else {
          warnings.push({
            field: rule.field,
            value,
            message: validation.message,
            suggestion: validation.suggestion
          });
        }
      }
    }

    // Additional context-aware validations
    const contextValidation = await this.performContextValidation(record, objectType);
    errors.push(...contextValidation.errors);
    warnings.push(...contextValidation.warnings);

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  static async checkForDuplicates(
    record: Record<string, any>,
    objectType: string,
    projectId: string,
    duplicateFields: string[] = ['email', 'external_id', 'name']
  ): Promise<DuplicateCheckResult> {
    try {
      // Get existing records of the same type
      const { data: existingRecords, error } = await supabase
        .from('migration_records')
        .select('external_id, data')
        .eq('project_id', projectId)
        .eq('object_type', objectType)
        .in('status', ['migrated', 'extracted']);

      if (error) throw error;

      if (!existingRecords || existingRecords.length === 0) {
        return { isDuplicate: false, matchingFields: [], confidence: 0 };
      }

      let bestMatch: { record: any; matchingFields: string[]; confidence: number } = {
        record: null,
        matchingFields: [],
        confidence: 0
      };

      for (const existing of existingRecords) {
        const existingData = existing.data as Record<string, any>;
        const matchingFields: string[] = [];
        let totalWeight = 0;
        let matchWeight = 0;

        // Check each duplicate detection field
        for (const field of duplicateFields) {
          const currentValue = this.normalizeValue(record[field]);
          const existingValue = this.normalizeValue(existingData[field]);

          if (currentValue && existingValue) {
            totalWeight += this.getFieldWeight(field);
            
            if (this.valuesMatch(currentValue, existingValue, field)) {
              matchingFields.push(field);
              matchWeight += this.getFieldWeight(field);
            }
          }
        }

        const confidence = totalWeight > 0 ? (matchWeight / totalWeight) : 0;

        if (confidence > bestMatch.confidence) {
          bestMatch = {
            record: existing,
            matchingFields,
            confidence
          };
        }
      }

      // Consider it a duplicate if confidence is above threshold
      const isDuplicate = bestMatch.confidence >= 0.8;

      return {
        isDuplicate,
        existingRecordId: isDuplicate ? bestMatch.record?.external_id : undefined,
        matchingFields: bestMatch.matchingFields,
        confidence: bestMatch.confidence
      };
    } catch (error) {
      console.error('Error checking for duplicates:', error);
      return { isDuplicate: false, matchingFields: [], confidence: 0 };
    }
  }

  static async validateBatch(
    records: Record<string, any>[],
    rules: ValidationRule[],
    objectType: string,
    projectId: string
  ): Promise<{
    validRecords: Record<string, any>[];
    invalidRecords: { record: Record<string, any>; errors: ValidationError[] }[];
    duplicates: { record: Record<string, any>; duplicate: DuplicateCheckResult }[];
    totalProcessed: number;
  }> {
    const validRecords: Record<string, any>[] = [];
    const invalidRecords: { record: Record<string, any>; errors: ValidationError[] }[] = [];
    const duplicates: { record: Record<string, any>; duplicate: DuplicateCheckResult }[] = [];

    for (const record of records) {
      // Validate the record
      const validation = await this.validateRecord(record, rules, objectType);
      
      if (!validation.isValid) {
        invalidRecords.push({
          record,
          errors: validation.errors
        });
        continue;
      }

      // Check for duplicates
      const duplicateCheck = await this.checkForDuplicates(record, objectType, projectId);
      
      if (duplicateCheck.isDuplicate) {
        duplicates.push({
          record,
          duplicate: duplicateCheck
        });
        continue;
      }

      validRecords.push(record);
    }

    return {
      validRecords,
      invalidRecords,
      duplicates,
      totalProcessed: records.length
    };
  }

  private static async validateField(
    value: any,
    rule: ValidationRule,
    fullRecord: Record<string, any>
  ): Promise<{ isValid: boolean; message: string; severity: 'error' | 'warning'; suggestion?: string }> {
    const fieldName = rule.field;

    switch (rule.type) {
      case 'required':
        if (value === null || value === undefined || value === '') {
          return {
            isValid: false,
            message: rule.message || `${fieldName} is required`,
            severity: 'error'
          };
        }
        break;

      case 'email':
        if (value && !this.emailRegex.test(value)) {
          return {
            isValid: false,
            message: rule.message || `${fieldName} must be a valid email address`,
            severity: 'error',
            suggestion: 'Check for typos in the email format (e.g., missing @ or domain)'
          };
        }
        break;

      case 'phone':
        if (value && !this.phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
          return {
            isValid: false,
            message: rule.message || `${fieldName} must be a valid phone number`,
            severity: 'warning',
            suggestion: 'Remove special characters and ensure the number format is correct'
          };
        }
        break;

      case 'url':
        if (value && !this.urlRegex.test(value)) {
          return {
            isValid: false,
            message: rule.message || `${fieldName} must be a valid URL`,
            severity: 'warning',
            suggestion: 'Ensure the URL starts with http:// or https://'
          };
        }
        break;

      case 'date':
        if (value && isNaN(Date.parse(value))) {
          return {
            isValid: false,
            message: rule.message || `${fieldName} must be a valid date`,
            severity: 'error',
            suggestion: 'Use ISO format (YYYY-MM-DD) or ensure the date is parseable'
          };
        }
        break;

      case 'numeric':
        if (value && isNaN(Number(value))) {
          return {
            isValid: false,
            message: rule.message || `${fieldName} must be a number`,
            severity: 'error'
          };
        }
        break;

      case 'length':
        const length = String(value || '').length;
        const minLength = rule.params?.min || 0;
        const maxLength = rule.params?.max || Infinity;
        
        if (length < minLength || length > maxLength) {
          return {
            isValid: false,
            message: rule.message || `${fieldName} length must be between ${minLength} and ${maxLength} characters`,
            severity: 'error'
          };
        }
        break;

      case 'regex':
        if (value && rule.params?.pattern && !new RegExp(rule.params.pattern).test(value)) {
          return {
            isValid: false,
            message: rule.message || `${fieldName} format is invalid`,
            severity: 'error'
          };
        }
        break;

      case 'custom':
        if (rule.params?.validator && typeof rule.params.validator === 'function') {
          const customResult = await rule.params.validator(value, fullRecord);
          if (!customResult.isValid) {
            return customResult;
          }
        }
        break;
    }

    return { isValid: true, message: '', severity: 'error' };
  }

  private static async performContextValidation(
    record: Record<string, any>,
    objectType: string
  ): Promise<{ errors: ValidationError[]; warnings: ValidationWarning[] }> {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Object-specific validations
    switch (objectType.toLowerCase()) {
      case 'contacts':
      case 'contact':
        // Ensure either email or phone is provided
        if (!record.email && !record.phone) {
          warnings.push({
            field: 'contact_info',
            value: null,
            message: 'Contact has neither email nor phone number',
            suggestion: 'Consider if this contact record provides sufficient information'
          });
        }
        
        // Check for common name issues
        if (record.first_name && record.last_name && 
            record.first_name.toLowerCase() === record.last_name.toLowerCase()) {
          warnings.push({
            field: 'name',
            value: `${record.first_name} ${record.last_name}`,
            message: 'First name and last name are identical',
            suggestion: 'Verify if this is correct or if names were incorrectly mapped'
          });
        }
        break;

      case 'companies':
      case 'company':
      case 'accounts':
      case 'account':
        // Check for company name
        if (!record.name && !record.company_name) {
          errors.push({
            field: 'name',
            value: null,
            rule: 'required',
            message: 'Company name is required',
            severity: 'error'
          });
        }
        break;

      case 'deals':
      case 'deal':
      case 'opportunities':
      case 'opportunity':
        // Check for amount
        if (record.amount && record.amount < 0) {
          warnings.push({
            field: 'amount',
            value: record.amount,
            message: 'Deal amount is negative',
            suggestion: 'Verify if negative amounts are intended for your system'
          });
        }
        
        // Check for reasonable close dates
        if (record.close_date) {
          const closeDate = new Date(record.close_date);
          const now = new Date();
          const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
          
          if (closeDate < oneYearAgo) {
            warnings.push({
              field: 'close_date',
              value: record.close_date,
              message: 'Close date is more than a year in the past',
              suggestion: 'Verify if this deal should be included in the migration'
            });
          }
        }
        break;
    }

    return { errors, warnings };
  }

  private static normalizeValue(value: any): string | null {
    if (value === null || value === undefined) return null;
    return String(value).toLowerCase().trim();
  }

  private static valuesMatch(value1: string, value2: string, fieldType: string): boolean {
    switch (fieldType) {
      case 'email':
        return value1 === value2;
      
      case 'phone':
        // Normalize phone numbers by removing common formatting
        const phone1 = value1.replace(/[\s\-\(\)\.]/g, '');
        const phone2 = value2.replace(/[\s\-\(\)\.]/g, '');
        return phone1 === phone2;
      
      case 'name':
        // For names, allow slight variations
        const similarity = this.calculateStringSimilarity(value1, value2);
        return similarity > 0.9;
      
      default:
        return value1 === value2;
    }
  }

  private static getFieldWeight(field: string): number {
    const weights: Record<string, number> = {
      email: 1.0,
      external_id: 1.0,
      id: 1.0,
      phone: 0.8,
      name: 0.6,
      first_name: 0.4,
      last_name: 0.4,
      company: 0.3
    };
    
    return weights[field] || 0.1;
  }

  private static calculateStringSimilarity(s1: string, s2: string): number {
    const longer = s1.length > s2.length ? s1 : s2;
    const shorter = s1.length > s2.length ? s2 : s1;
    
    if (longer.length === 0) return 1.0;
    
    const editDistance = this.calculateEditDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  }

  private static calculateEditDistance(s1: string, s2: string): number {
    const matrix = Array(s2.length + 1).fill(null).map(() => Array(s1.length + 1).fill(null));
    
    for (let i = 0; i <= s1.length; i += 1) {
      matrix[0][i] = i;
    }
    
    for (let j = 0; j <= s2.length; j += 1) {
      matrix[j][0] = j;
    }
    
    for (let j = 1; j <= s2.length; j += 1) {
      for (let i = 1; i <= s1.length; i += 1) {
        const indicator = s1[i - 1] === s2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + indicator
        );
      }
    }
    
    return matrix[s2.length][s1.length];
  }
}