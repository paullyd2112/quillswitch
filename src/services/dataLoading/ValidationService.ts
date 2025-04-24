
import { ValidationRule, ValidationResult, ValidationIssue } from './types';

/**
 * An enhanced data validation service with actionable feedback
 */
export class ValidationService {
  private rules: ValidationRule[];
  private uniqueKeys: Map<string, Set<string>> = new Map();
  
  constructor(rules: ValidationRule[] = []) {
    this.rules = rules;
  }
  
  /**
   * Add a validation rule to the validation service
   */
  addRule(rule: ValidationRule): void {
    this.rules.push(rule);
  }
  
  /**
   * Add multiple validation rules to the validation service
   */
  addRules(rules: ValidationRule[]): void {
    this.rules.push(...rules);
  }
  
  /**
   * Get a suggestion for fixing a validation error
   */
  private getSuggestion(field: string, value: any, rule: ValidationRule): string | undefined {
    switch (rule.rule) {
      case 'format':
        if (field === 'email' && typeof value === 'string') {
          // Suggest fixes for common email issues
          if (!value.includes('@')) {
            return `Add the missing @ symbol: ${value.replace(/\s+/g, '')}@example.com`;
          } else if (!value.includes('.')) {
            const [localPart, domain] = value.split('@');
            return `${localPart}@${domain}.com`;
          } else if (value.includes(' ')) {
            return value.replace(/\s+/g, '');
          }
        } else if (field === 'phone' && typeof value === 'string') {
          // Suggest fixes for common phone issues
          if (/[a-zA-Z]/.test(value)) {
            return value.replace(/[a-zA-Z]/g, '');
          }
          // Format phone with parentheses and dashes
          const digitsOnly = value.replace(/\D/g, '');
          if (digitsOnly.length === 10) {
            return `(${digitsOnly.substring(0, 3)}) ${digitsOnly.substring(3, 6)}-${digitsOnly.substring(6)}`;
          }
        }
        break;
        
      case 'required':
        if (field === 'firstName' || field === 'lastName') {
          return '[Required] Please provide a value';
        }
        break;
        
      case 'unique':
        return 'This record appears to be a duplicate. Consider merging or removing duplicates.';
        
      default:
        return undefined;
    }
  }
  
  /**
   * Validate a single record
   */
  validateRecord(record: any, index: number): ValidationIssue[] {
    const issues: ValidationIssue[] = [];
    
    // Apply each rule to the record
    for (const rule of this.rules) {
      const { field, rule: ruleType, params, message } = rule;
      const value = record[field];
      let isValid = true;
      
      switch (ruleType) {
        case 'required':
          isValid = value !== undefined && value !== null && value !== '';
          break;
          
        case 'format':
          if (params?.pattern) {
            const pattern = typeof params.pattern === 'string' 
              ? new RegExp(params.pattern) 
              : params.pattern;
            isValid = value === undefined || value === null || value === '' || pattern.test(String(value));
          }
          break;
          
        case 'length':
          if (typeof value === 'string') {
            isValid = 
              (params?.min === undefined || value.length >= params.min) && 
              (params?.max === undefined || value.length <= params.max);
          }
          break;
          
        case 'range':
          if (typeof value === 'number') {
            isValid = 
              (params?.min === undefined || value >= params.min) && 
              (params?.max === undefined || value <= params.max);
          }
          break;
          
        case 'unique':
          {
            // Skip empty values for uniqueness check
            if (value === undefined || value === null || value === '') {
              continue;
            }
            
            // Create unique key for the field if it doesn't exist
            if (!this.uniqueKeys.has(field)) {
              this.uniqueKeys.set(field, new Set());
            }
            
            const uniqueSet = this.uniqueKeys.get(field)!;
            const normalizedValue = String(value).toLowerCase();
            
            // Check if value already exists in the set
            if (uniqueSet.has(normalizedValue)) {
              isValid = false;
            } else {
              uniqueSet.add(normalizedValue);
            }
          }
          break;
          
        case 'custom':
          if (params?.validationFn) {
            isValid = params.validationFn(value, record);
          }
          break;
      }
      
      if (!isValid) {
        issues.push({
          record_index: index,
          field_name: field,
          error_type: ruleType,
          error_message: message,
          raw_value: typeof value === 'string' ? value : JSON.stringify(value),
          suggestion: this.getSuggestion(field, value, rule)
        });
      }
    }
    
    return issues;
  }
  
  /**
   * Validate an array of records
   */
  validateRecords(records: any[]): ValidationResult {
    let allIssues: ValidationIssue[] = [];
    
    // Reset unique key tracking for each batch of records
    this.uniqueKeys.clear();
    
    // Validate each record
    records.forEach((record, index) => {
      const recordIssues = this.validateRecord(record, index);
      allIssues = allIssues.concat(recordIssues);
    });
    
    // Create validation result
    return {
      isValid: allIssues.length === 0,
      errors: allIssues
    };
  }
  
  /**
   * Get validation rules for common data types
   */
  static getDefaultRulesForType(dataType: string): ValidationRule[] {
    switch (dataType) {
      case 'contacts':
        return [
          { field: 'email', rule: 'format', params: { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ }, message: 'Invalid email format' },
          { field: 'firstName', rule: 'required', message: 'First name is required' },
          { field: 'lastName', rule: 'required', message: 'Last name is required' },
          { field: 'phone', rule: 'format', params: { pattern: /^[\d\+\-\(\) ]+$/ }, message: 'Invalid phone format' },
          { field: 'email', rule: 'unique', message: 'Email address must be unique' }
        ];
        
      case 'accounts':
        return [
          { field: 'name', rule: 'required', message: 'Account name is required' },
          { field: 'website', rule: 'format', params: { pattern: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/ }, message: 'Invalid website URL' },
          { field: 'name', rule: 'unique', message: 'Account name must be unique' }
        ];
        
      case 'opportunities':
        return [
          { field: 'name', rule: 'required', message: 'Opportunity name is required' },
          { field: 'amount', rule: 'format', params: { pattern: /^-?\d*\.?\d+$/ }, message: 'Amount must be a number' },
          { field: 'amount', rule: 'range', params: { min: 0 }, message: 'Amount must be positive' },
          { field: 'closeDate', rule: 'format', params: { pattern: /^\d{4}-\d{2}-\d{2}$/ }, message: 'Close date must be in YYYY-MM-DD format' }
        ];
        
      default:
        return [];
    }
  }
}
