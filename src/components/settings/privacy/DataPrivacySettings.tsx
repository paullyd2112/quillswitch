
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DataExportCard from "./DataExportCard";
import ConsentManagementCard from "./ConsentManagementCard";
import PrivacyDocumentsCard from "./PrivacyDocumentsCard";
import AccountDeletionCard from "./AccountDeletionCard";
import DataSubjectRights from "@/components/gdpr/DataSubjectRights";
import PrivacyPolicy from "./PrivacyPolicy";
import DataProcessingRegister from "./DataProcessingRegister";
import DataBreachProcess from "./DataBreachProcess";
import DpiaRegister from "./DpiaRegister";
import DataProcessingAgreements from "./DataProcessingAgreements";
import DataProtectionOfficer from "./DataProtectionOfficer";

const DataPrivacySettings = () => {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="rights">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-6">
          <TabsTrigger value="rights">Rights</TabsTrigger>
          <TabsTrigger value="documentation">Documentation</TabsTrigger>
          <TabsTrigger value="processing">Processing</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="agreements">Agreements</TabsTrigger>
          <TabsTrigger value="governance">Governance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="rights" className="space-y-6 pt-6">
          <DataSubjectRights />
          <DataExportCard />
          <AccountDeletionCard />
        </TabsContent>
        
        <TabsContent value="documentation" className="space-y-6 pt-6">
          <PrivacyPolicy />
          <PrivacyDocumentsCard />
        </TabsContent>
        
        <TabsContent value="processing" className="space-y-6 pt-6">
          <DataProcessingRegister />
          <ConsentManagementCard />
          <DpiaRegister />
        </TabsContent>
        
        <TabsContent value="security" className="space-y-6 pt-6">
          <DataBreachProcess />
        </TabsContent>
        
        <TabsContent value="agreements" className="space-y-6 pt-6">
          <DataProcessingAgreements />
        </TabsContent>
        
        <TabsContent value="governance" className="space-y-6 pt-6">
          <DataProtectionOfficer />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DataPrivacySettings;
