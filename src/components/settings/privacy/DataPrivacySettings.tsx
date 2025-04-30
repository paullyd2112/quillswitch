
import React from "react";
import { Card } from "@/components/ui/card";
import DataExportCard from "./DataExportCard";
import ConsentManagementCard from "./ConsentManagementCard";
import PrivacyDocumentsCard from "./PrivacyDocumentsCard";
import AccountDeletionCard from "./AccountDeletionCard";
import DataSubjectRights from "@/components/gdpr/DataSubjectRights";

const DataPrivacySettings = () => {
  return (
    <div className="space-y-6">
      <DataSubjectRights />
      <DataExportCard />
      <ConsentManagementCard />
      <PrivacyDocumentsCard />
      <AccountDeletionCard />
    </div>
  );
};

export default DataPrivacySettings;
