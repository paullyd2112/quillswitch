
import React from "react";
import { useSetupWizard } from "@/contexts/SetupWizardContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import CompanyDetailsStep from "./CompanyDetailsStep";
import SourceCrmStep from "./SourceCrmStep";
import DestinationCrmStep from "./DestinationCrmStep";
import DataTypesStep from "./DataTypesStep";
import MigrationStrategyStep from "./MigrationStrategyStep";
import ReviewStep from "./ReviewStep";
import { sourceCrmOptions, destinationCrmOptions } from "@/config/crmSystems";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const WizardContent: React.FC = () => {
  const {
    currentStep,
    steps,
    formData,
    isSubmitting,
    multiCrmEnabled,
    multiDestinationEnabled,
    selectedSourceCrms,
    selectedDestinationCrms,
    customCrmNames,
    showPerCrmDataSelection,
    isStepValid,
    handleChange,
    handleApiKeyChange,
    handleCustomCrmNameChange,
    handleRadioChange,
    handleCheckboxChange,
    handleCrmDataSelectionChange,
    handleSourceCrmToggle,
    handleDestinationCrmToggle,
    setMultiCrmEnabled,
    setMultiDestinationEnabled,
    handleNext,
    handlePrevious,
    handleSubmit
  } = useSetupWizard();

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <CompanyDetailsStep
            formData={formData}
            handleChange={handleChange}
            handleRadioChange={handleRadioChange}
          />
        );
      case 1:
        return (
          <SourceCrmStep
            formData={formData}
            multiCrmEnabled={multiCrmEnabled}
            setMultiCrmEnabled={setMultiCrmEnabled}
            selectedSourceCrms={selectedSourceCrms}
            handleSourceCrmToggle={handleSourceCrmToggle}
            handleApiKeyChange={handleApiKeyChange}
            handleCustomCrmNameChange={handleCustomCrmNameChange}
            customCrmNames={customCrmNames}
            sourceCrmOptions={sourceCrmOptions}
          />
        );
      case 2:
        return (
          <DestinationCrmStep
            formData={formData}
            multiDestinationEnabled={multiDestinationEnabled}
            setMultiDestinationEnabled={setMultiDestinationEnabled}
            selectedDestinationCrms={selectedDestinationCrms}
            handleDestinationCrmToggle={handleDestinationCrmToggle}
            handleApiKeyChange={handleApiKeyChange}
            handleCustomCrmNameChange={handleCustomCrmNameChange}
            customCrmNames={customCrmNames}
            destinationCrmOptions={destinationCrmOptions}
          />
        );
      case 3:
        return (
          <DataTypesStep
            formData={formData}
            handleCheckboxChange={handleCheckboxChange}
            handleCrmDataSelectionChange={handleCrmDataSelectionChange}
            showPerCrmDataSelection={showPerCrmDataSelection}
            selectedSourceCrms={selectedSourceCrms}
            sourceCrmOptions={sourceCrmOptions}
          />
        );
      case 4:
        return (
          <MigrationStrategyStep
            formData={formData}
            handleRadioChange={handleRadioChange}
            handleChange={handleChange}
          />
        );
      case 5:
        return (
          <ReviewStep
            formData={formData}
            selectedSourceCrms={selectedSourceCrms}
            selectedDestinationCrms={selectedDestinationCrms}
            multiCrmEnabled={multiCrmEnabled}
            multiDestinationEnabled={multiDestinationEnabled}
            customCrmNames={customCrmNames}
            sourceCrmOptions={sourceCrmOptions}
            destinationCrmOptions={destinationCrmOptions}
          />
        );
      default:
        return null;
    }
  };

  const currentStepValid = isStepValid();

  return (
    <div className="space-y-8">
      <div className="min-h-[400px]">
        {renderStepContent()}
      </div>
      
      <div className="flex justify-between items-center pt-6 border-t border-slate-700">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Previous
        </Button>
        
        <div className="flex items-center gap-4">
          {!currentStepValid && (
            <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800 max-w-md">
              <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <AlertDescription className="text-amber-700 dark:text-amber-300 text-sm">
                {currentStep === 1 || currentStep === 2 
                  ? "Please connect and select your CRM systems to continue."
                  : "Please complete all required fields to continue."}
              </AlertDescription>
            </Alert>
          )}
          
          {currentStep === steps.length - 1 ? (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !currentStepValid}
              className="gap-2 bg-primary hover:bg-primary/90"
            >
              {isSubmitting ? "Creating Migration..." : "Complete Setup"}
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={!currentStepValid}
              className="gap-2 bg-primary hover:bg-primary/90"
            >
              Next
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default WizardContent;
