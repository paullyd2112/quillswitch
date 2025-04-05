
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import { useSetupWizard } from "@/contexts/SetupWizardContext";

const WizardNavigation: React.FC = () => {
  const { 
    currentStep, 
    steps, 
    isStepValid, 
    isSubmitting, 
    handlePrevious, 
    handleNext 
  } = useSetupWizard();

  return (
    <div className="p-6 md:p-8 border-t border-gray-100 dark:border-gray-800 flex justify-between">
      <Button
        variant="outline"
        onClick={handlePrevious}
        disabled={currentStep === 0 || isSubmitting}
        className="gap-2"
      >
        <ArrowLeft size={16} /> Previous
      </Button>
      
      <Button
        onClick={handleNext}
        disabled={!isStepValid() || isSubmitting}
        className="gap-2"
      >
        {currentStep < steps.length - 1 ? (
          <>
            Next <ArrowRight size={16} />
          </>
        ) : (
          <>
            Finish Setup <CheckCircle size={16} />
          </>
        )}
      </Button>
    </div>
  );
};

export default WizardNavigation;
