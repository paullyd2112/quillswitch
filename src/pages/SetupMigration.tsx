
import React from "react";
import BaseLayout from "@/components/layout/BaseLayout";
import { ConnectionProvider } from "@/contexts/ConnectionContext";
import { UserOnboardingProvider } from "@/components/onboarding/UserOnboardingProvider";
import SetupMigrationContent from "@/components/setup-migration/SetupMigrationContent";

const SetupMigration: React.FC = () => {
  return (
    <BaseLayout>
      <ConnectionProvider>
        <UserOnboardingProvider>
          <SetupMigrationContent />
        </UserOnboardingProvider>
      </ConnectionProvider>
    </BaseLayout>
  );
};

export default SetupMigration;
