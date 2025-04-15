
import React from "react";
import Navbar from "@/components/layout/Navbar";
import ContentSection from "@/components/layout/ContentSection";
import { 
  AutomatedMappingPanel, 
  EnterpriseMigrationCapabilityTest, 
  HighConcurrencyMigrationTest,
  MultiSourceSelection,
  DataMappingVisualizer,
  FieldMappingsTable
} from "@/components/migration";

const MigrationPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        <ContentSection
          title="Migration Tools"
          description="Configure and test your data migration capabilities."
          centered={false}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div>
              <h2 className="text-xl font-semibold mb-4">Migration Capabilities</h2>
              <EnterpriseMigrationCapabilityTest />
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4">High Concurrency Testing</h2>
              <HighConcurrencyMigrationTest />
            </div>
          </div>
          
          <div className="mb-16">
            <h2 className="text-xl font-semibold mb-4">Multi-Source Selection</h2>
            <MultiSourceSelection />
          </div>
          
          <div className="mb-16">
            <h2 className="text-xl font-semibold mb-4">Automated Field Mapping</h2>
            <AutomatedMappingPanel />
          </div>
          
          <div className="mb-16">
            <h2 className="text-xl font-semibold mb-4">Data Mapping Visualization</h2>
            <DataMappingVisualizer />
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Field Mappings</h2>
            <FieldMappingsTable 
              mappings={[
                { sourceField: "first_name", destinationField: "firstName", status: "mapped" },
                { sourceField: "last_name", destinationField: "lastName", status: "mapped" },
                { sourceField: "email", destinationField: "email", status: "mapped" },
                { sourceField: "company", destinationField: "companyName", status: "mapped" },
                { sourceField: "phone", destinationField: "phoneNumber", status: "mapped" }
              ]} 
              onEditMapping={() => {}}
              onRemoveMapping={() => {}}
              onPreviewMapping={() => {}}
            />
          </div>
        </ContentSection>
      </div>
    </div>
  );
};

export default MigrationPage;
