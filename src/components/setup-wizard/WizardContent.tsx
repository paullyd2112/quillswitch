
import React from "react";
import { useSetupWizard } from "@/contexts/SetupWizardContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, CheckCircle, Loader2 } from "lucide-react";
import CompanyInfoStep from "./CompanyInfoStep";
import SourceCrmStep from "./SourceCrmStep";
import DestinationCrmStep from "./DestinationCrmStep";
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
    handlePerCrmCustomMappingChange,
    handleSourceCrmToggle,
    handleDestinationCrmToggle,
    setMultiCrmEnabled,
    setMultiDestinationEnabled,
    handleNext,
    handlePrevious,
    handleSubmit
  } = useSetupWizard();

  const renderStepContent = () => {
    const stepProps = {
      formData,
      handleChange,
      handleApiKeyChange,
      handleCustomCrmNameChange,
      handleRadioChange,
      handleCheckboxChange,
      handleCrmDataSelectionChange,
      handlePerCrmCustomMappingChange,
      multiCrmEnabled,
      setMultiCrmEnabled,
      multiDestinationEnabled,
      setMultiDestinationEnabled,
      selectedSourceCrms,
      selectedDestinationCrms,
      handleSourceCrmToggle,
      handleDestinationCrmToggle,
      customCrmNames,
      sourceCrmOptions,
      destinationCrmOptions,
      showPerCrmDataSelection
    };

    switch (currentStep) {
      case 0:
        return <CompanyInfoStep formData={formData} handleChange={handleChange} />;
      case 1:
        return <SourceCrmStep {...stepProps} />;
      case 2:
        return <DestinationCrmStep {...stepProps} />;
      case 3:
        return <ReviewStep {...stepProps} />;
      default:
        return null;
    }
  };

  const currentStepValid = isStepValid();
  const isLastStep = currentStep === steps.length - 1;

  return (
    <div className="space-y-8">
      {/* Step Content */}
      <div className="min-h-[500px]">
        <div className="animate-fade-in">
          {renderStepContent()}
        </div>
      </div>
      
      {/* Navigation */}
      <div className="flex justify-between items-center pt-8 border-t border-slate-700/50">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 0 || isSubmitting}
          className="gap-2 bg-slate-800/50 border-slate-600 hover:bg-slate-700/50 text-slate-300"
        >
          <ArrowLeft className="h-4 w-4" />
          Previous
        </Button>
        
        <div className="flex items-center gap-6">
          {!currentStepValid && (
            <Alert className="border-amber-500/30 bg-amber-500/10 max-w-sm">
              <AlertCircle className="h-4 w-4 text-amber-400" />
              <AlertDescription className="text-amber-300 text-sm">
                {currentStep === 1 || currentStep === 2 
                  ? "Please connect and configure your CRM systems to continue."
                  : "Please complete all required fields to proceed."}
              </AlertDescription>
            </Alert>
          )}
          
          {isLastStep ? (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !currentStepValid}
              className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white shadow-lg shadow-primary/25 min-w-[160px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Complete Setup
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={!currentStepValid || isSubmitting}
              className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white shadow-lg shadow-primary/25 min-w-[120px]"
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
