
import React from "react";
import Navbar from "@/components/layout/Navbar";
import ContentSection from "@/components/layout/ContentSection";
import FadeIn from "@/components/animations/FadeIn";
import GlassPanel from "@/components/ui-elements/GlassPanel";
import WizardHeader from "@/components/setup-wizard/WizardHeader";
import ProgressSteps from "@/components/setup-wizard/ProgressSteps";
import WizardContent from "@/components/setup-wizard/WizardContent";
import WizardNavigation from "@/components/setup-wizard/WizardNavigation";
import { SetupWizardProvider, useSetupWizard } from "@/contexts/SetupWizardContext";

const WizardContainer: React.FC = () => {
  const { currentStep, steps, setCurrentStep } = useSetupWizard();

  return (
    <GlassPanel className="max-w-4xl mx-auto">
      <div className="p-6 md:p-8 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Configure Your CRM Migration</h2>
          <p className="text-sm text-muted-foreground">
            Step {currentStep + 1} of {steps.length}
          </p>
        </div>
        
        <ProgressSteps 
          steps={steps} 
          currentStep={currentStep} 
          setCurrentStep={setCurrentStep} 
        />
      </div>
      
      <WizardContent />
      <WizardNavigation />
    </GlassPanel>
  );
};

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
