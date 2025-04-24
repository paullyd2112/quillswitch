
export interface ServiceCredential {
  id?: string;
  user_id: string; // Changed from optional to required to match the DB schema
  service_name: string;
  credential_name: string;
  credential_type: 'api_key' | 'oauth_token' | 'connection_string' | 'secret_key';
  credential_value: string;
  expires_at?: string | null;
  environment?: 'development' | 'staging' | 'production';
  created_at?: string;
  updated_at?: string;
  metadata?: Record<string, any>;
}

export interface CommonFormProps {
  isSubmitting: boolean;
}
