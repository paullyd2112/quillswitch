
import { ValidationRule, ValidationResult } from "./validationService";

/**
 * Enhanced validation helpers to provide more context and guidance
 */

/**
 * Get a user-friendly explanation for a validation rule
 */
export const getValidationRuleExplanation = (rule: ValidationRule): string => {
  switch (rule.rule) {
    case 'required':
      return `This field cannot be empty and must have a valid value.`;
    case 'format':
      return `The value must match the expected format pattern: ${rule.params?.pattern || 'specified pattern'}.`;
    case 'length':
      if (rule.params?.min !== undefined && rule.params?.max !== undefined) {
        return `The text length must be between ${rule.params.min} and ${rule.params.max} characters.`;
      } else if (rule.params?.min !== undefined) {
        return `The text must be at least ${rule.params.min} characters.`;
      } else if (rule.params?.max !== undefined) {
        return `The text cannot exceed ${rule.params.max} characters.`;
      }
      return 'The text must be of a specific length.';
    case 'range':
      if (rule.params?.min !== undefined && rule.params?.max !== undefined) {
        return `The value must be between ${rule.params.min} and ${rule.params.max}.`;
      } else if (rule.params?.min !== undefined) {
        return `The value must be at least ${rule.params.min}.`;
      } else if (rule.params?.max !== undefined) {
        return `The value cannot exceed ${rule.params.max}.`;
      }
      return 'The value must be within a specific range.';
    case 'unique':
      return 'This value must be unique and not appear in any other record.';
    case 'custom':
      return rule.params?.explanation || 'This field must meet custom validation requirements.';
    default:
      return 'This field must be valid for the migration to proceed.';
  }
};

/**
 * Get recommendations for fixing validation issues
 */
export const getValidationFixRecommendations = (objectType: string, errorType: string): string[] => {
  const commonRecommendations = [
    'Update the data in your source CRM before proceeding with migration',
    'Consider using transformations to fix issues during migration',
    'For large datasets, export to CSV, fix issues in bulk, and re-import'
  ];
  
  const specificRecommendations: Record<string, Record<string, string[]>> = {
    'contacts': {
      'email': [
        'Check for mistyped email domains (e.g., gmail.com instead of gmail.con)',
        'Remove spaces or special characters from email addresses',
        'Consider marking contacts with invalid emails for follow-up'
      ],
      'phone': [
        'Standardize phone number formats with country codes',
        'Remove any letters or invalid characters from phone numbers',
        'Ensure area codes are included where required'
      ],
      'name': [
        'Ensure first and last names are properly separated',
        'Remove titles from name fields if they should be in a separate field',
        'Check for and correct obvious typos in names'
      ]
    },
    'accounts': {
      'name': [
        'Ensure company names follow a consistent format',
        'Remove duplicate company records before migration',
        'Add missing information to incomplete company profiles'
      ],
      'industry': [
        'Standardize industry names to match the destination CRM options',
        'Map custom industry values to standard categories',
        'Consider using a default value for missing industries'
      ]
    },
    'opportunities': {
      'amount': [
        'Verify that all amounts are positive numbers',
        'Check for currency symbol issues or decimal point errors',
        'Ensure values are within reasonable ranges for your business'
      ],
      'closeDate': [
        'Make sure all dates are in a standard format',
        'Check for invalid or future dates that don't make sense',
        'Ensure required date fields have values'
      ]
    }
  };
  
  // Try to find specific recommendations for this object type and error
  const objectRecommendations = specificRecommendations[objectType];
  if (objectRecommendations) {
    // Look for field-specific recommendations
    for (const field in objectRecommendations) {
      if (errorType.toLowerCase().includes(field.toLowerCase())) {
        return objectRecommendations[field];
      }
    }
  }
  
  // Return common recommendations if no specific ones found
  return commonRecommendations;
};

/**
 * Enhance a validation result with additional context
 */
export const enhanceValidationResult = (
  result: ValidationResult,
  objectType: string
): ValidationResult & { 
  recommendations: string[],
  impactLevel: 'high' | 'medium' | 'low',
  errorsByType: Record<string, number>
} => {
  // Count errors by type
  const errorsByType: Record<string, number> = {};
  result.errors.forEach(error => {
    const field = error.field;
    errorsByType[field] = (errorsByType[field] || 0) + 1;
  });
  
  // Determine most common error type
  let mostCommonErrorType = '';
  let mostCommonErrorCount = 0;
  
  for (const [field, count] of Object.entries(errorsByType)) {
    if (count > mostCommonErrorCount) {
      mostCommonErrorCount = count;
      mostCommonErrorType = field;
    }
  }
  
  // Determine impact level
  let impactLevel: 'high' | 'medium' | 'low' = 'low';
  const errorPercentage = result.invalidRecords / (result.validRecords + result.invalidRecords);
  
  if (errorPercentage > 0.3) {
    impactLevel = 'high';
  } else if (errorPercentage > 0.1) {
    impactLevel = 'medium';
  }
  
  // Get recommendations
  const recommendations = getValidationFixRecommendations(objectType, mostCommonErrorType);
  
  return {
    ...result,
    recommendations,
    impactLevel,
    errorsByType
  };
};
