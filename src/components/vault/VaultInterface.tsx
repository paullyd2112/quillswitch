
import React from "react";
import SearchAndFilter from "./SearchAndFilter";
import VaultContent from "./VaultContent";
import { ServiceCredential, CredentialFilter } from "./types";

interface VaultInterfaceProps {
  isLoading: boolean;
  activeTab: string;
  filteredCredentials: ServiceCredential[];
  onCredentialSelect: (credential: ServiceCredential) => void;
  onDelete: (id: string) => Promise<void>;
  isSelectMode: boolean;
  selectedCredentialIds: string[];
  onSelectChange: (id: string, selected: boolean) => void;
  onTabChange: (value: string) => void;
  filter: CredentialFilter;
  onFilterChange: (filter: CredentialFilter) => void;
  availableTags: string[];
}

const VaultInterface: React.FC<VaultInterfaceProps> = ({
  isLoading,
  activeTab,
  filteredCredentials,
  onCredentialSelect,
  onDelete,
  isSelectMode,
  selectedCredentialIds,
  onSelectChange,
  onTabChange,
  filter,
  onFilterChange,
  availableTags
}) => {
  return (
    <>
      <SearchAndFilter 
        onFilterChange={onFilterChange}
        availableTags={availableTags}
      />

      <VaultContent
        isLoading={isLoading}
        activeTab={activeTab}
        filteredCredentials={filteredCredentials}
        onCredentialSelect={onCredentialSelect}
        onDelete={onDelete}
        isSelectMode={isSelectMode}
        selectedCredentialIds={selectedCredentialIds}
        onSelectChange={onSelectChange}
        onTabChange={onTabChange}
        filter={filter}
      />
    </>
  );
};

export default VaultInterface;
