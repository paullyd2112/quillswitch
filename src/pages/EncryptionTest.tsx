
import React from "react";
import Navbar from "@/components/layout/Navbar";
import ContentSection from "@/components/layout/ContentSection";
import EncryptionTest from "@/components/EncryptionTest";

const EncryptionTestPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        <ContentSection 
          title="Encryption Test"
          description="Test our secure encryption and decryption functionality."
          centered={true}
        >
          <EncryptionTest />
        </ContentSection>
      </div>
    </div>
  );
};

export default EncryptionTestPage;
