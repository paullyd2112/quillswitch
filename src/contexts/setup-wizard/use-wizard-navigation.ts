
import { useState } from "react";
import { WizardStep } from "./types";

export const useWizardNavigation = (steps: WizardStep[], isStepValid: () => boolean) => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const handleNext = () => {
    if (currentStep < steps.length - 1 && isStepValid()) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return {
    currentStep,
    setCurrentStep,
    handleNext,
    handlePrevious
  };
};
