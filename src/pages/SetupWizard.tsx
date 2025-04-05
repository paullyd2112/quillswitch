
import React from "react";
import Navbar from "@/components/layout/Navbar";
import ContentSection from "@/components/layout/ContentSection";
import WizardHeader from "@/components/setup-wizard/WizardHeader";
import WizardContainer from "@/components/setup-wizard/WizardContainer";
import { SetupWizardProvider } from "@/contexts/SetupWizardContext";

const SetupWizard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-slate-50 dark:from-background dark:to-slate-900/50 hero-gradient">
      <Navbar />
      
      <WizardHeader />
      
      <ContentSection className="py-12 pb-32">
        <SetupWizardProvider>
          <WizardContainer />
        </SetupWizardProvider>
      </ContentSection>
    </div>
  );
};

export default SetupWizard;
