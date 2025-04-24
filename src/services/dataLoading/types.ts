
export interface ValidationIssue {
  record_index: number;
  field_name: string;
  error_type: string;
  error_message: string;
  raw_value?: string;
  suggestion?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationIssue[];
}

export interface ValidationRule {
  field: string;
  rule: 'required' | 'format' | 'length' | 'range' | 'unique' | 'custom';
  params?: any;
  message: string;
}

export interface DataLoadingConfig {
  validationRules?: ValidationRule[];
  deduplicationKeys?: string[];
  transformations?: Record<string, (value: any, record: any) => any>;
  batchSize?: number;
}

export interface DataProcessingResult {
  jobId: string;
  validCount: number;
  errorCount: number;
  duplicateCount: number;
}

export interface DataQualityMetrics {
  completeness: number; // Percentage of required fields that are filled
  accuracy: number; // Percentage of fields that pass validation
  uniqueness: number; // Percentage of records that are unique
  consistency: number; // Percentage of fields that follow consistent patterns
  overall: number; // Overall data quality score
}

export const DEFAULT_CONFIG: DataLoadingConfig = {
  deduplicationKeys: ['email'],
  batchSize: 100
};

export const DATA_TYPE_VALIDATORS = {
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Invalid email format'
  },
  phone: {
    pattern: /^[\d\+\-\(\) ]+$/,
    message: 'Invalid phone format'
  },
  date: {
    pattern: /^\d{4}-\d{2}-\d{2}$/,
    message: 'Invalid date format (use YYYY-MM-DD)'
  },
  url: {
    pattern: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
    message: 'Invalid URL format'
  },
  number: {
    pattern: /^-?\d*\.?\d+$/,
    message: 'Invalid number format'
  }
};
