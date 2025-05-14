
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
    <div className="max-w-4xl mx-auto">
      <GlassPanel className="mb-6">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">CRM Migration Setup</h2>
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
      </GlassPanel>
      
      <Alert className="mb-6 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
        <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        <AlertDescription className="text-blue-700 dark:text-blue-300">
          Complete the steps below to configure your CRM migration. Each step includes helpful guidance to make the process easier.
        </AlertDescription>
      </Alert>
      
      <WizardContent />
    </div>
  );
};

export default WizardContainer;
