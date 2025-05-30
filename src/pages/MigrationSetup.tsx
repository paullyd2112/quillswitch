
import React from "react";
import { ConnectionProvider } from "@/contexts/ConnectionContext";
import { SetupWizardProvider } from "@/contexts/SetupWizardContext";
import { UserOnboardingProvider } from "@/components/onboarding/UserOnboardingProvider";
import MigrationSetupContent from "@/components/migration-setup/MigrationSetupContent";

const MigrationSetup: React.FC = () => {
  return (
    <ConnectionProvider>
      <SetupWizardProvider>
        <UserOnboardingProvider>
          <MigrationSetupContent />
        </UserOnboardingProvider>
      </SetupWizardProvider>
    </ConnectionProvider>
  );
};

export default MigrationSetup;
