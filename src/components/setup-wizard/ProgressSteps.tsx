
import React from "react";
import { CheckCircle } from "lucide-react";
import { WizardStep } from "@/types/setupWizard";

interface ProgressStepsProps {
  steps: WizardStep[];
  currentStep: number;
  setCurrentStep: (step: number) => void;
}

const ProgressSteps: React.FC<ProgressStepsProps> = ({ steps, currentStep, setCurrentStep }) => {
  return (
    <div className="mt-8">
      <div className="relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full" />
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-brand-500 dark:bg-brand-400 rounded-full transition-all duration-300"
          style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
        />
        
        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const IconComponent = step.icon.component;
            const iconProps = step.icon.props;
            
            return (
              <div 
                key={step.id} 
                className="flex flex-col items-center"
                onClick={() => index < currentStep && setCurrentStep(index)} // Allow going back to previous steps
              >
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-colors ${
                    index < currentStep
                      ? "bg-brand-500 text-white cursor-pointer"
                      : index === currentStep
                      ? "bg-brand-500 text-white ring-4 ring-brand-100 dark:ring-brand-900/50"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {index < currentStep ? (
                    <CheckCircle size={20} />
                  ) : (
                    <IconComponent {...iconProps} />
                  )}
                </div>
                <div className="mt-2 hidden md:block">
                  <p className={`text-sm font-medium ${
                    index <= currentStep
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}>
                    {step.title}
                  </p>
                  <p className="text-xs text-muted-foreground hidden lg:block">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProgressSteps;
