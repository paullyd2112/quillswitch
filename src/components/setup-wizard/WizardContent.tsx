
import React from "react";
import { useSetupWizard } from "@/contexts/SetupWizardContext";
import FadeIn from "@/components/animations/FadeIn";
import CompanyInfoStep from "./CompanyInfoStep";
import SourceCrmStep from "./SourceCrmStep";
import DestinationCrmStep from "./DestinationCrmStep";
import DataSelectionStep from "./DataSelectionStep";
import PerCrmDataSelectionStep from "./PerCrmDataSelectionStep";
import ConfirmationStep from "./ConfirmationStep";
import { sourceCrmOptions, destinationCrmOptions } from "@/config/crmOptions";
import { CrmSystem } from "@/contexts/setup-wizard/types";

const WizardContent: React.FC = () => {
  const { 
    currentStep, 
    formData, 
    isSubmitting,
    multiCrmEnabled,
    multiDestinationEnabled,
    selectedSourceCrms,
    selectedDestinationCrms,
    customCrmNames,
    showPerCrmDataSelection,
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
    handleSubmit
  } = useSetupWizard();

  return (
    <div className="p-6 md:p-8">
      <FadeIn>
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
      </FadeIn>
    </div>
  );
};

export default WizardContent;
