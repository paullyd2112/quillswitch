
import React from "react";
import { useSetupWizard } from "@/contexts/SetupWizardContext";
import FadeIn from "@/components/animations/FadeIn";
import CompanyInfoStep from "./CompanyInfoStep";
import SourceCrmStep from "./SourceCrmStep";
import DestinationCrmStep from "./DestinationCrmStep";
import DataSelectionStep from "./DataSelectionStep";
import PerCrmDataSelectionStep from "./PerCrmDataSelectionStep";
import ConfirmationStep from "./ConfirmationStep";
import SimplifiedStepContent from "./SimplifiedStepContent";
import { sourceCrmOptions, destinationCrmOptions } from "@/config/crmOptions";
import { CrmSystem } from "@/contexts/setup-wizard/types";

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

  // Help text for each step
  const stepHelpText = [
    "Provide your company information to help us customize your migration experience. This information helps us understand your business needs and goals.",
    "Select the CRM system where your data currently resides. This is the source from which we'll extract your data.",
    "Select the CRM system where you want to migrate your data. This is your target system.",
    "Choose which types of data you want to migrate. You can select multiple data types based on your needs.",
    "Review your migration setup before proceeding. Make sure all information is correct."
  ];

  // Define step-specific props
  const getStepProps = () => {
    const commonProps = {
      onNext: handleNext,
      onPrevious: currentStep > 0 ? handlePrevious : undefined,
      disableNext: !isStepValid(),
    };

    if (currentStep === steps.length - 1) {
      return {
        ...commonProps,
        nextLabel: isSubmitting ? "Processing..." : "Start Migration",
        onNext: handleSubmit,
        disableNext: isSubmitting || !isStepValid(),
      };
    }

    return commonProps;
  };

  return (
    <div className="p-6 md:p-8">
      <FadeIn>
        <SimplifiedStepContent
          title={steps[currentStep].title}
          description={steps[currentStep].description}
          helpText={stepHelpText[currentStep]}
          {...getStepProps()}
        >
          {currentStep === 0 && (
            <CompanyInfoStep 
              formData={formData} 
              handleChange={handleChange} 
            />
          )}
          
          {currentStep === 1 && (
            <SourceCrmStep 
              formData={formData}
              multiCrmEnabled={multiCrmEnabled}
              setMultiCrmEnabled={setMultiCrmEnabled}
              selectedSourceCrms={selectedSourceCrms}
              handleSourceCrmToggle={handleSourceCrmToggle}
              handleApiKeyChange={handleApiKeyChange}
              handleCustomCrmNameChange={handleCustomCrmNameChange}
              customCrmNames={customCrmNames}
              sourceCrmOptions={sourceCrmOptions as CrmSystem[]}
            />
          )}
          
          {currentStep === 2 && (
            <DestinationCrmStep 
              formData={formData}
              handleRadioChange={handleRadioChange}
              handleApiKeyChange={handleApiKeyChange}
              handleCustomCrmNameChange={handleCustomCrmNameChange}
              customCrmNames={customCrmNames}
              destinationCrmOptions={destinationCrmOptions as CrmSystem[]}
              multiDestinationEnabled={multiDestinationEnabled}
              setMultiDestinationEnabled={setMultiDestinationEnabled}
              selectedDestinationCrms={selectedDestinationCrms}
              handleDestinationCrmToggle={handleDestinationCrmToggle}
            />
          )}
          
          {currentStep === 3 && showPerCrmDataSelection && (
            <PerCrmDataSelectionStep 
              formData={formData}
              handleCrmDataSelectionChange={handleCrmDataSelectionChange}
              handleChange={handleChange}
              handleRadioChange={handleRadioChange}
              selectedSourceCrms={selectedSourceCrms}
              sourceCrmOptions={sourceCrmOptions as CrmSystem[]}
              customCrmNames={customCrmNames}
            />
          )}
          
          {currentStep === 3 && !showPerCrmDataSelection && (
            <DataSelectionStep 
              formData={formData}
              handleChange={handleChange}
              handleCheckboxChange={handleCheckboxChange}
              handleRadioChange={handleRadioChange}
            />
          )}
          
          {currentStep === 4 && (
            <ConfirmationStep 
              formData={formData}
              isSubmitting={isSubmitting}
              handleSubmit={handleSubmit}
              multiCrmEnabled={multiCrmEnabled}
              selectedSourceCrms={selectedSourceCrms}
              customCrmNames={customCrmNames}
              sourceCrmOptions={sourceCrmOptions as CrmSystem[]}
              destinationCrmOptions={destinationCrmOptions as CrmSystem[]}
              multiDestinationEnabled={multiDestinationEnabled}
              selectedDestinationCrms={selectedDestinationCrms}
            />
          )}
        </SimplifiedStepContent>
      </FadeIn>
    </div>
  );
};

export default WizardContent;
