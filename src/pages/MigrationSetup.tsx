
import React, { useState } from "react";
import BaseLayout from "@/components/layout/BaseLayout";
import { ConnectionProvider } from "@/contexts/ConnectionContext";
import { SetupWizardProvider } from "@/contexts/SetupWizardContext";
import { UserOnboardingProvider } from "@/components/onboarding/UserOnboardingProvider";
import MigrationSetupContent from "@/components/migration-setup/MigrationSetupContent";

const MigrationSetup: React.FC = () => {
  return (
    <BaseLayout>
      <ConnectionProvider>
        <SetupWizardProvider>
          <UserOnboardingProvider>
            <MigrationSetupContent />
          </UserOnboardingProvider>
        </SetupWizardProvider>
      </ConnectionProvider>
    </BaseLayout>
  );
};

export default MigrationSetup;
