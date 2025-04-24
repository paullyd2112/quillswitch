
import { useState } from "react";
import { ServiceCredential, CredentialFilter } from "@/components/vault/types";
import { fieldEncrypt } from "@/utils/encryptionUtils";

export const useVaultState = () => {
  // State for managing credentials
  const [credentials, setCredentials] = useState<ServiceCredential[]>([]);
  const [isLoading, setIsLoading] = useState(false);
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
  
  // Handle adding a new credential
  const handleAddCredential = async (credential: ServiceCredential): Promise<void> => {
    setIsLoading(true);
    try {
      // In a real app, we would make an API call to add the credential
      // For now, we'll mock it with a timeout
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Generate a mock encryption key for demo purposes
      // In a real app, this would come from a secure source
      const mockEncryptionKey = "demo-encryption-key-123";
      
      // Encrypt sensitive fields
      const encryptedValue = await fieldEncrypt(credential.credential_value, mockEncryptionKey);
      const newCredential = {
        ...credential,
        credential_value: encryptedValue,
        id: Date.now().toString(), // Mock ID - in a real app, this would come from the API
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      setCredentials(prev => [...prev, newCredential]);
      setShowAddForm(false);
    } catch (error) {
      console.error("Failed to add credential", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle deleting a credential
  const handleDeleteCredential = async (id: string): Promise<void> => {
    setIsLoading(true);
    try {
      // In a real app, we would make an API call to delete the credential
      await new Promise(resolve => setTimeout(resolve, 500));
      setCredentials(prev => prev.filter(cred => cred.id !== id));
      
      // If the deleted credential was selected, clear the selection
      if (selectedCredential?.id === id) {
        setSelectedCredential(null);
      }
      
      // Remove the ID from selected IDs if it was selected
      setSelectedCredentialIds(prev => prev.filter(credId => credId !== id));
    } catch (error) {
      console.error("Failed to delete credential", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle bulk deletion of multiple credentials
  const handleBulkDelete = async (ids: string[]): Promise<void> => {
    setIsLoading(true);
    try {
      // In a real app, we would make an API call to delete multiple credentials
      await new Promise(resolve => setTimeout(resolve, 500));
      setCredentials(prev => prev.filter(cred => !ids.includes(cred.id || '')));
      
      // If any deleted credentials were selected, clear the selection
      if (selectedCredential && ids.includes(selectedCredential.id || '')) {
        setSelectedCredential(null);
      }
      
      // Clear the selected IDs
      setSelectedCredentialIds([]);
    } catch (error) {
      console.error("Failed to delete credentials", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle updating a credential
  const handleUpdateCredential = async (credential: ServiceCredential): Promise<void> => {
    setIsLoading(true);
    try {
      // In a real app, we would make an API call to update the credential
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update the credential in the state
      setCredentials(prev => prev.map(cred => 
        cred.id === credential.id ? { ...credential, updated_at: new Date().toISOString() } : cred
      ));
      
      // Update the selected credential if it was the one that was updated
      if (selectedCredential?.id === credential.id) {
        setSelectedCredential({ ...credential, updated_at: new Date().toISOString() });
      }
    } catch (error) {
      console.error("Failed to update credential", error);
    } finally {
      setIsLoading(false);
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
    handleAddCredential,
    handleDeleteCredential,
    handleBulkDelete,
    handleUpdateCredential
  };
};

export default useVaultState;
