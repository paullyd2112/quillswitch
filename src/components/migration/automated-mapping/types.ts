
export interface MappingSuggestion {
  source_field: string;
  destination_field: string;
  confidence: number; // 0-100 confidence score
  is_required?: boolean;
  reason?: string;
  semanticAnalysis?: {
    dataType: string;
    sampleValues?: string[];
    contentPattern: string;
    fieldCategory: 'personal' | 'business' | 'contact' | 'address' | 'financial' | 'custom';
  };
  learningContext?: {
    previousMappings: number;
    userCorrections: number;
    successRate: number;
    lastUsed?: string;
  };
}

export interface MigrationError {
  id: string;
  type: 'validation' | 'api_limit' | 'data_type' | 'permission' | 'network' | 'timeout';
  message: string;
  recordId?: string;
  fieldName?: string;
  suggestedAction?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  count: number;
  firstOccurred: string;
  lastOccurred: string;
}

export interface MigrationProgress {
  totalRecords: number;
  processedRecords: number;
  successfulRecords: number;
  failedRecords: number;
  currentBatch?: number;
  totalBatches?: number;
  recordsPerSecond?: number;
  estimatedTimeRemaining?: number;
  errors: MigrationError[];
  bottlenecks?: {
    component: string;
    delay: number;
    reason: string;
  }[];
}

export interface PermissionAudit {
  service: string;
  requiredPermissions: string[];
  grantedPermissions: string[];
  excessivePermissions: string[];
  missingPermissions: string[];
  riskLevel: 'low' | 'medium' | 'high';
  recommendations: string[];
}
