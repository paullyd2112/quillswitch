
/**
 * Types for Google Cloud Secret Manager integration
 */

export interface GCPSecret {
  name: string;
  createTime: string;
  labels: Record<string, string>;
}

export interface SecretResponse {
  success: boolean;
  data?: string | GCPSecret[];
  error?: string;
}

export interface MaskedSecret {
  value: string | null;
  masked: string;
}

export interface SecretProviderConfig {
  provider: 'gcp' | 'aws' | 'azure' | 'vault';
  projectId?: string;
  region?: string;
  endpoint?: string;
}
