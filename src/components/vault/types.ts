
export interface ServiceCredential {
  id?: string;
  user_id: string; 
  service_name: string;
  credential_name: string;
  credential_type: 'api_key' | 'oauth_token' | 'connection_string' | 'secret_key';
  credential_value: string | Uint8Array;
  expires_at?: string | null;
  environment?: 'development' | 'staging' | 'production' | null;
  created_at?: string;
  updated_at?: string;
  metadata?: Record<string, any> | null;
  tags?: string[];
  last_used?: string; // Track when the credential was last accessed
}

export interface CommonFormProps {
  isSubmitting: boolean;
}

// For bulk operations
export interface BulkActionProps {
  selectedCredentialIds: string[];
  onComplete: () => void;
}

// For filtering
export interface CredentialFilter {
  searchTerm: string;
  types: string[];
  environments: string[];
  tags: string[];
  showExpired: boolean;
}
