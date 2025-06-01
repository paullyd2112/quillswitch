
export interface ConnectedCredential {
  id: string;
  service_name: string;
  credential_name: string;
  credential_type: string;
  created_at: string;
  expires_at?: string;
}

export interface CrmProvider {
  id: string;
  name: string;
  description: string;
  icon: string;
}
