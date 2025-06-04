
import React from "react";
import { CheckCircle } from "lucide-react";
import { WizardStep } from "@/contexts/setup-wizard/types";

interface ProgressStepsProps {
  steps: WizardStep[];
  currentStep: number;
  setCurrentStep: (step: number) => void;
}

const ProgressSteps: React.FC<ProgressStepsProps> = ({ steps, currentStep, setCurrentStep }) => {
  return (
    <div className="relative">
      {/* Progress Line */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-slate-700 rounded-full" />
      <div
        className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-500 ease-out"
        style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
      />
      
      {/* Step Indicators */}
      <div className="relative flex justify-between">
        {steps.map((step, index) => {
          const IconComponent = step.icon.component;
          const iconProps = step.icon.props;
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isClickable = index <= currentStep;
          
          return (
            <div 
              key={step.id} 
              className="flex flex-col items-center group"
              onClick={() => isClickable && setCurrentStep(index)}
            >
              {/* Step Circle */}
              <div 
                className={`w-12 h-12 rounded-full flex items-center justify-center z-10 transition-all duration-300 ${
                  isCompleted
                    ? "bg-gradient-to-br from-primary to-primary/80 text-white shadow-lg shadow-primary/25 cursor-pointer hover:scale-105"
                    : isCurrent
                    ? "bg-gradient-to-br from-primary to-primary/80 text-white ring-4 ring-primary/20 shadow-lg shadow-primary/25 scale-105"
                    : "bg-slate-800 border-2 border-slate-600 text-slate-400"
                } ${isClickable ? 'cursor-pointer' : ''}`}
              >
                {isCompleted ? (
                  <CheckCircle className="h-6 w-6" />
                ) : (
                  <IconComponent {...iconProps} className="h-5 w-5" />
                )}
              </div>
              
              {/* Step Info */}
              <div className="mt-3 text-center max-w-[120px]">
                <p className={`text-sm font-medium transition-colors ${
                  index <= currentStep
                    ? "text-white"
                    : "text-slate-500"
                }`}>
                  {step.title}
                </p>
                <p className={`text-xs mt-1 transition-colors hidden sm:block ${
                  index <= currentStep
                    ? "text-slate-300"
                    : "text-slate-600"
                }`}>
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressSteps;
