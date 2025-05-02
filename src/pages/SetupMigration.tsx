
import React from "react";
import BaseLayout from "@/components/layout/BaseLayout";
import { ConnectionProvider } from "@/contexts/ConnectionContext";
import SetupMigrationContent from "@/components/setup-migration/SetupMigrationContent";

const SetupMigration: React.FC = () => {
  return (
    <BaseLayout>
      <ConnectionProvider>
        <SetupMigrationContent />
      </ConnectionProvider>
    </BaseLayout>
  );
};

export default SetupMigration;
