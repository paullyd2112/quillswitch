
import React from "react";
import ProgressSteps from "@/components/setup-wizard/ProgressSteps";
import WizardContent from "@/components/setup-wizard/WizardContent";
import { useSetupWizard } from "@/contexts/SetupWizardContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import FadeIn from "@/components/animations/FadeIn";

const WizardContainer: React.FC = () => {
  const { currentStep, steps, setCurrentStep } = useSetupWizard();

  return (
    <div className="max-w-4xl mx-auto">
      <FadeIn>
        <div className="glass-panel mb-8 shadow-glass">
          <div className="p-8 border-b border-tech-border">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-semibold">CRM Migration Setup</h2>
              <div className="tech-chip">
                Step {currentStep + 1} of {steps.length}
              </div>
            </div>
            
            <ProgressSteps 
              steps={steps} 
              currentStep={currentStep} 
              setCurrentStep={setCurrentStep} 
            />
          </div>
        </div>
        
        <Alert className="mb-8 bg-tech-subtle border-tech-accent/30">
          <Info className="h-4 w-4 text-tech-accent" />
          <AlertDescription className="text-tech-text-secondary">
            Complete the steps below to configure your CRM migration. Each step includes helpful guidance to make the process easier.
          </AlertDescription>
        </Alert>
      </FadeIn>
      
      <WizardContent />
    </div>
  );
};

export default WizardContainer;
