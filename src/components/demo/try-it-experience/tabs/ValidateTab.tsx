
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import ProgressCard from "../components/ProgressCard";

interface ValidateTabProps {
  sourceCrm: string;
  targetCrm: string;
  validationProgress: number;
  isValidating: boolean;
  isValidationComplete: boolean;
  onRunValidation: () => void;
  onNext: () => void;
  onBack: () => void;
  isComplete: boolean;
}

const ValidateTab: React.FC<ValidateTabProps> = ({
  sourceCrm,
  targetCrm,
  validationProgress,
  isValidating,
  isValidationComplete,
  onRunValidation,
  onNext,
  onBack,
  isComplete
}) => {
  return (
    <div className="space-y-6">
      <ProgressCard
        title="Validate Your Data"
        description="Run a validation check to ensure data integrity before migration"
        progress={validationProgress}
        isComplete={isValidationComplete}
        isLoading={isValidating}
        buttonText="Run Data Validation"
        onStart={onRunValidation}
        loadingText="Validating data..."
        sourceCrm={sourceCrm}
        targetCrm={targetCrm}
      />
      
      <div className="flex justify-between">
        <Button 
          variant="outline"
          onClick={onBack}
        >
          Back: Map Fields
        </Button>
        <Button 
          onClick={onNext}
          disabled={!isComplete}
        >
          Next: Migrate <ArrowRight className="ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default ValidateTab;
