
import { useState } from "react";
import { ServiceCredential, CredentialFilter } from "@/components/vault/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useVaultState = () => {
  // State for managing credentials
  const [credentials, setCredentials] = useState<ServiceCredential[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeTab, setActiveTab] = useState("api-keys");
  const [selectedCredentialIds, setSelectedCredentialIds] = useState<string[]>([]);
  const [selectedCredential, setSelectedCredential] = useState<ServiceCredential | null>(null);
  const [filter, setFilter] = useState<CredentialFilter>({
    searchTerm: "",
    types: [],
    environments: [],
    tags: [],
    showExpired: true
  });
  
  // Mock data for available tags - in a real app, this would come from the API
  const availableTags = ["production", "development", "testing", "deprecated", "internal", "external"];
  
  // Load credentials on initial mount
  const loadCredentials = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('service_credentials')
        .select('*');
      
      if (error) throw error;
      
      // Cast the database response to match our ServiceCredential type
      if (data) {
        const typedCredentials = data.map(cred => ({
          ...cred,
          credential_type: cred.credential_type as ServiceCredential['credential_type'],
          environment: cred.environment as ServiceCredential['environment']
        }));
        setCredentials(typedCredentials);
      } else {
        setCredentials([]);
      }
    } catch (error) {
      console.error("Error loading credentials:", error);
      toast.error("Failed to load credentials");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle adding a new credential
  const handleAddCredential = async (credential: ServiceCredential): Promise<void> => {
    setIsLoading(true);
    try {
      // Call the RPC function to encrypt and store the credential
      const { data, error } = await supabase.rpc('encrypt_and_store_credential', {
        p_service_name: credential.service_name,
        p_credential_name: credential.credential_name,
        p_credential_type: credential.credential_type,
        p_credential_value: credential.credential_value,
        p_environment: credential.environment,
        p_expires_at: credential.expires_at,
        p_metadata: credential.metadata || {},
        p_tags: credential.tags || []
      });
      
      if (error) throw error;
      
      // Reload credentials after adding
      await loadCredentials();
      setShowAddForm(false);
      toast.success("Credential added successfully");
    } catch (error) {
      console.error("Failed to add credential", error);
      toast.error("Failed to add credential");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle deleting a credential
  const handleDeleteCredential = async (id: string): Promise<void> => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('service_credentials')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setCredentials(prev => prev.filter(cred => cred.id !== id));
      
      // If the deleted credential was selected, clear the selection
      if (selectedCredential?.id === id) {
        setSelectedCredential(null);
      }
      
      // Remove the ID from selected IDs if it was selected
      setSelectedCredentialIds(prev => prev.filter(credId => credId !== id));
      
      toast.success("Credential deleted successfully");
    } catch (error) {
      console.error("Failed to delete credential", error);
      toast.error("Failed to delete credential");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle bulk deletion of multiple credentials
  const handleBulkDelete = async (ids: string[]): Promise<void> => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('service_credentials')
        .delete()
        .in('id', ids);
      
      if (error) throw error;
      
      setCredentials(prev => prev.filter(cred => !ids.includes(cred.id || '')));
      
      // If any deleted credentials were selected, clear the selection
      if (selectedCredential && ids.includes(selectedCredential.id || '')) {
        setSelectedCredential(null);
      }
      
      // Clear the selected IDs
      setSelectedCredentialIds([]);
      
      toast.success(`${ids.length} credentials deleted successfully`);
    } catch (error) {
      console.error("Failed to delete credentials", error);
      toast.error("Failed to delete credentials");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle updating a credential
  const handleUpdateCredential = async (credential: ServiceCredential): Promise<void> => {
    setIsLoading(true);
    try {
      // For now, we only support updating non-sensitive fields
      const { error } = await supabase
        .from('service_credentials')
        .update({
          service_name: credential.service_name,
          credential_name: credential.credential_name,
          environment: credential.environment,
          expires_at: credential.expires_at,
          tags: credential.tags,
          metadata: credential.metadata,
          updated_at: new Date().toISOString()
        })
        .eq('id', credential.id);
      
      if (error) throw error;
      
      // Update the credential in the state
      setCredentials(prev => prev.map(cred => 
        cred.id === credential.id ? { 
          ...credential, 
          updated_at: new Date().toISOString() 
        } : cred
      ));
      
      // Update the selected credential if it was the one that was updated
      if (selectedCredential?.id === credential.id) {
        setSelectedCredential({ 
          ...credential, 
          updated_at: new Date().toISOString() 
        });
      }
      
      toast.success("Credential updated successfully");
    } catch (error) {
      console.error("Failed to update credential", error);
      toast.error("Failed to update credential");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Get credential value (decrypted)
  const getCredentialValue = async (id: string): Promise<string | null> => {
    try {
      // Call the RPC function to get decrypted credential value with logging
      const { data, error } = await supabase.rpc('get_decrypted_credential_with_logging', {
        p_credential_id: id
      });
      
      if (error) throw error;
      if (!data || data.length === 0) return null;
      
      return data[0].credential_value;
    } catch (error) {
      console.error("Error retrieving credential value:", error);
      toast.error("Failed to retrieve credential value");
      return null;
    }
  };

  return {
    isLoading,
    showAddForm,
    activeTab,
    filter,
    selectedCredentialIds,
    selectedCredential,
    availableTags,
    credentials,
    setShowAddForm,
    setActiveTab,
    setFilter,
    setSelectedCredentialIds,
    setSelectedCredential,
    loadCredentials,
    handleAddCredential,
    handleDeleteCredential,
    handleBulkDelete,
    handleUpdateCredential,
    getCredentialValue
  };
};

export default useVaultState;
