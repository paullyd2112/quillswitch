
import { ServiceCredential } from "@/components/vault/types";
import { toast } from "sonner";

type ValidationResult = {
  isValid: boolean;
  errors: ValidationError[];
};

type ValidationError = {
  field: string;
  message: string;
  severity: 'error' | 'warning';
};

/**
 * Validates a service credential before saving
 */
export const validateCredential = (credential: ServiceCredential): ValidationResult => {
  const errors: ValidationError[] = [];
  
  // Required fields
  if (!credential.service_name?.trim()) {
    errors.push({
      field: 'service_name',
      message: 'Service name is required',
      severity: 'error'
    });
  }
  
  if (!credential.credential_name?.trim()) {
    errors.push({
      field: 'credential_name',
      message: 'Credential name is required',
      severity: 'error'
    });
  }
  
  if (!credential.credential_value) {
    errors.push({
      field: 'credential_value',
      message: 'Credential value is required',
      severity: 'error'
    });
  }
  
  // Format validations
  if (credential.credential_type === 'api_key' && 
      typeof credential.credential_value === 'string' && 
      credential.credential_value.length < 8) {
    errors.push({
      field: 'credential_value',
      message: 'API keys should typically be at least 8 characters',
      severity: 'warning'
    });
  }
  
  // Expiration date validation
  if (credential.expires_at) {
    const expiryDate = new Date(credential.expires_at);
    const now = new Date();
    
    if (expiryDate <= now) {
      errors.push({
        field: 'expires_at',
        message: 'Expiration date must be in the future',
        severity: 'error'
      });
    }
    
    // Warn about soon expiring credentials (within 7 days)
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(now.getDate() + 7);
    
    if (expiryDate <= sevenDaysFromNow) {
      errors.push({
        field: 'expires_at',
        message: 'Credential will expire within 7 days',
        severity: 'warning'
      });
    }
  }
  
  return {
    isValid: errors.filter(e => e.severity === 'error').length === 0,
    errors
  };
};

/**
 * Displays validation errors as notifications
 */
export const displayValidationErrors = (validationResult: ValidationResult): void => {
  if (validationResult.errors.length === 0) return;
  
  // Show errors first
  validationResult.errors
    .filter(e => e.severity === 'error')
    .forEach(error => {
      toast.error(`${error.field}: ${error.message}`);
    });
  
  // Then show warnings
  validationResult.errors
    .filter(e => e.severity === 'warning')
    .forEach(warning => {
      toast.warning(`${warning.field}: ${warning.message}`);
    });
};
