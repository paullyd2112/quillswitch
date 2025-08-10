
import React from "react";
import GlassPanel from "@/components/ui-elements/GlassPanel";
import ProgressSteps from "@/components/setup-wizard/ProgressSteps";
import WizardContent from "@/components/setup-wizard/WizardContent";
import { useSetupWizard } from "@/contexts/SetupWizardContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

const WizardContainer: React.FC = () => {
  const { currentStep, steps, setCurrentStep } = useSetupWizard();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <GlassPanel className="p-6 border border-primary/20">
        <div className="border-b border-slate-700 pb-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-white">CRM Migration Configuration</h2>
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
        
        <Alert className="mb-6 bg-primary/10 border-primary/20 backdrop-blur-sm">
          <Info className="h-4 w-4 text-primary" />
          <AlertDescription className="text-slate-300">
            Complete the steps below to configure your CRM migration. Each step includes helpful guidance to make the process easier.
          </AlertDescription>
        </Alert>
        
        <div id="wizard-content">
          <WizardContent />
        </div>
      </GlassPanel>
    </div>
  );
};

export default WizardContainer;
