
import React from "react";
import CredentialDetail from "./CredentialDetail";
import CredentialSecurityInfo from "./CredentialSecurityInfo";
import { ServiceCredential } from "./types";

interface VaultDetailsSectionProps {
  selectedCredential: ServiceCredential | null;
  onCloseDetail: () => void;
  onUpdateCredential: (credential: ServiceCredential) => Promise<void>;
  availableTags: string[];
}

const VaultDetailsSection: React.FC<VaultDetailsSectionProps> = ({
  selectedCredential,
  onCloseDetail,
  onUpdateCredential,
  availableTags
}) => {
  return (
    <>
      <CredentialDetail 
        credential={selectedCredential}
        onClose={onCloseDetail}
        onUpdate={onUpdateCredential}
        availableTags={availableTags}
      />
      
      <CredentialSecurityInfo />
    </>
  );
};

export default VaultDetailsSection;
