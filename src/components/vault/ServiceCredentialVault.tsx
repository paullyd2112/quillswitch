
import React, { useEffect } from "react";
import { useVaultState } from "@/hooks/useVaultState";
import VaultHeader from "./VaultHeader";
import VaultContent from "./VaultContent";
import AddCredentialForm from "./AddCredentialForm";
import BulkActions from "./BulkActions";
import SearchAndFilter from "./SearchAndFilter";
import CredentialDetail from "./CredentialDetail";
import CredentialSecurityInfo from "./CredentialSecurityInfo";
import { Card } from "@/components/ui/card";
import { ServiceCredential } from "./types";

export const ServiceCredentialVault = () => {
  const {
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
    handleUpdateCredential
  } = useVaultState();

  // Load credentials on component mount
  useEffect(() => {
    loadCredentials();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const getFilteredCredentials = () => {
    const filteredByType = activeTab === "api-keys" 
      ? credentials.filter(cred => cred.credential_type === 'api_key')
      : activeTab === "oauth-tokens"
      ? credentials.filter(cred => cred.credential_type === 'oauth_token')
      : credentials.filter(cred => cred.credential_type === 'connection_string');
      
    return filterCredentials(filteredByType);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSelectedCredentialIds([]);
  };

  const clearSelection = () => {
    setSelectedCredentialIds([]);
  };

  const openCredentialDetail = (credential: ServiceCredential) => {
    setSelectedCredential(credential);
  };

  const filteredCredentials = getFilteredCredentials();
  const isSelectMode = selectedCredentialIds.length > 0;

  return (
    <div className="space-y-6">
      <VaultHeader 
        onAddClick={() => setShowAddForm(true)}
        showAddForm={showAddForm}
      />

      {showAddForm && (
        <Card className="border-2 border-blue-200 shadow-md">
          <AddCredentialForm 
            onAdd={handleAddCredential}
            onCancel={() => setShowAddForm(false)}
            isSubmitting={isLoading}
            availableTags={availableTags}
          />
        </Card>
      )}

      {selectedCredentialIds.length > 0 && (
        <BulkActions 
          selectedCredentialIds={selectedCredentialIds}
          onDelete={handleBulkDelete}
          onComplete={clearSelection}
        />
      )}

      <SearchAndFilter 
        onFilterChange={setFilter}
        availableTags={availableTags}
      />

      <VaultContent
        isLoading={isLoading}
        activeTab={activeTab}
        filteredCredentials={filteredCredentials}
        onCredentialSelect={openCredentialDetail}
        onDelete={handleDeleteCredential}
        isSelectMode={isSelectMode}
        selectedCredentialIds={selectedCredentialIds}
        onSelectChange={(id, selected) => {
          if (selected) {
            setSelectedCredentialIds(prev => [...prev, id]);
          } else {
            setSelectedCredentialIds(prev => prev.filter(credId => credId !== id));
          }
        }}
        onTabChange={handleTabChange}
        filter={filter}
      />
      
      <CredentialDetail 
        credential={selectedCredential}
        onClose={() => setSelectedCredential(null)}
        onUpdate={handleUpdateCredential}
        availableTags={availableTags}
      />
      
      <CredentialSecurityInfo />
    </div>
  );
};

export default ServiceCredentialVault;
