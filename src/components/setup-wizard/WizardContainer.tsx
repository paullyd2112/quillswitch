
import React from "react";
import GlassPanel from "@/components/ui-elements/GlassPanel";
import ProgressSteps from "@/components/setup-wizard/ProgressSteps";
import WizardContent from "@/components/setup-wizard/WizardContent";
import WizardNavigation from "@/components/setup-wizard/WizardNavigation";
import { useSetupWizard } from "@/contexts/SetupWizardContext";

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

export default WizardContainer;
