
import React, { useEffect } from "react";
import { useVaultState } from "@/hooks/useVaultState";
import { useCredentialFiltering } from "@/hooks/useCredentialFiltering";
import VaultHeader from "./VaultHeader";
import VaultActions from "./VaultActions";
import VaultInterface from "./VaultInterface";
import VaultDetailsSection from "./VaultDetailsSection";
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

  // Use the custom filtering hook
  const filteredCredentials = useCredentialFiltering(credentials, activeTab, filter);

  // Load credentials on component mount
  useEffect(() => {
    loadCredentials();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const isSelectMode = selectedCredentialIds.length > 0;

  return (
    <div className="space-y-6">
      <VaultHeader 
        onAddClick={() => setShowAddForm(true)}
        showAddForm={showAddForm}
      />

      <VaultActions
        showAddForm={showAddForm}
        onAddCredential={handleAddCredential}
        onCancelAdd={() => setShowAddForm(false)}
        isSubmitting={isLoading}
        availableTags={availableTags}
        selectedCredentialIds={selectedCredentialIds}
        onBulkDelete={handleBulkDelete}
        onBulkComplete={clearSelection}
      />

      <VaultInterface
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
        onFilterChange={setFilter}
        availableTags={availableTags}
      />
      
      <VaultDetailsSection
        selectedCredential={selectedCredential}
        onCloseDetail={() => setSelectedCredential(null)}
        onUpdateCredential={handleUpdateCredential}
        availableTags={availableTags}
      />
    </div>
  );
};

export default ServiceCredentialVault;
