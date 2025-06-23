
import React from "react";
import { Helmet } from "react-helmet";
import EnhancedContentSection from "@/components/layout/enhanced-content-section";
import ServiceCredentialVault from "@/components/vault/ServiceCredentialVault";

const CredentialsVault = () => {
  return (
    <>
      <Helmet>
        <title>Credentials Vault | QuillSwitch</title>
        <meta name="description" content="Securely store and manage your API keys, tokens, and service credentials" />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <EnhancedContentSection 
          title="Credentials Vault"
          description="Securely store and manage your API keys, tokens, and service credentials with enterprise-grade encryption."
          maxWidth="full"
        >
          <ServiceCredentialVault />
        </EnhancedContentSection>
      </div>
    </>
  );
};

export default CredentialsVault;
