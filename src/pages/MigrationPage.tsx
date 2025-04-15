
import React from "react";
import Navbar from "@/components/layout/Navbar";
import ContentSection from "@/components/layout/ContentSection";
import MigrationsList from "@/pages/MigrationsList";

const MigrationPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        <ContentSection 
          title="CRM Migration"
          description="Manage and monitor your CRM data migration process"
          centered={false}
        >
          <MigrationsList />
        </ContentSection>
      </div>
    </div>
  );
};

export default MigrationPage;
