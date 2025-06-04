
import { useMemo } from "react";
import { ServiceCredential, CredentialFilter } from "@/components/vault/types";

export const useCredentialFiltering = (
  credentials: ServiceCredential[],
  activeTab: string,
  filter: CredentialFilter
) => {
  const getFilteredCredentials = useMemo(() => {
    const filterCredentials = (credentials: ServiceCredential[]): ServiceCredential[] => {
      return credentials.filter(cred => {
        if (filter.searchTerm && 
            !cred.service_name.toLowerCase().includes(filter.searchTerm.toLowerCase()) && 
            !cred.credential_name.toLowerCase().includes(filter.searchTerm.toLowerCase())) {
          return false;
        }
        
        if (filter.types.length > 0 && !filter.types.includes(cred.credential_type)) {
          return false;
        }
        
        if (filter.environments.length > 0 && cred.environment && 
            !filter.environments.includes(cred.environment)) {
          return false;
        }
        
        if (filter.tags.length > 0) {
          if (!cred.tags || !cred.tags.some(tag => filter.tags.includes(tag))) {
            return false;
          }
        }
        
        if (!filter.showExpired && cred.expires_at) {
          const now = new Date();
          const expiryDate = new Date(cred.expires_at);
          if (expiryDate < now) {
            return false;
          }
        }
        
        return true;
      });
    };

    const filteredByType = activeTab === "api-keys" 
      ? credentials.filter(cred => cred.credential_type === 'api_key')
      : activeTab === "oauth-tokens"
      ? credentials.filter(cred => cred.credential_type === 'oauth_token')
      : credentials.filter(cred => cred.credential_type === 'connection_string');
      
    return filterCredentials(filteredByType);
  }, [credentials, activeTab, filter]);

  return getFilteredCredentials;
};
