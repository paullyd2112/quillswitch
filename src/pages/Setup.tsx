// TODO: This page is a candidate for future overhaul to improve UX and architecture
import React from "react";
import { Container } from "@/components/ui/container";
import { SetupWizardProvider } from "@/contexts/SetupWizardContext";
import WizardHeader from "@/components/setup-wizard/WizardHeader";
import WizardContent from "@/components/setup-wizard/WizardContent";

const Setup = () => {
  return (
    <div className="min-h-screen bg-slate-950">
      <Container>
        <div className="py-8">
          <SetupWizardProvider>
            <WizardHeader />
            <WizardContent />
          </SetupWizardProvider>
        </div>
      </Container>
    </div>
  );
};

export default Setup;
