
import React from "react";
import ContentSection from "@/components/layout/ContentSection";
import ServiceCredentialVault from "@/components/vault/ServiceCredentialVault";

const CredentialsVault = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="pt-8 pb-16">
        <ContentSection 
          title="Credentials Vault"
          description="Securely store and manage your API keys, tokens, and service credentials."
          centered={false}
        >
          <ServiceCredentialVault />
        </ContentSection>
      </div>
    </div>
  );
};

export default CredentialsVault;
