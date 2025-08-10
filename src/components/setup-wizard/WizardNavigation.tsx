
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import { useSetupWizard } from "@/contexts/SetupWizardContext";
import { toast } from "@/hooks/use-toast";

const WizardNavigation: React.FC = () => {
  const { 
    currentStep, 
    steps, 
    isStepValid, 
    isSubmitting, 
    handlePrevious, 
    handleNext 
  } = useSetupWizard();

  const onNext = () => {
    if (!isStepValid()) {
      toast({
        title: "Please complete this step",
        description: "Fill in the missing fields before continuing.",
        variant: "destructive",
      });
      // Try to scroll to first invalid input
      const firstInvalid = document.querySelector('[aria-invalid="true"], .invalid, [data-invalid="true"], [data-error="true"]');
      if (firstInvalid && 'scrollIntoView' in firstInvalid) {
        (firstInvalid as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'center' });
        (firstInvalid as HTMLElement).focus?.();
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }
    handleNext();
  };

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
        onClick={onNext}
        disabled={isSubmitting}
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
