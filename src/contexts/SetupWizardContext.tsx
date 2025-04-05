
import React, { createContext, useContext } from "react";
import { SetupWizardContextType } from "./setup-wizard/types";
import { wizardSteps } from "./setup-wizard/wizard-steps";
import { useFormData } from "./setup-wizard/use-form-data";
import { useCrmSelection } from "./setup-wizard/use-crm-selection";
import { useWizardNavigation } from "./setup-wizard/use-wizard-navigation";
import { useSubmission } from "./setup-wizard/use-submission";
import { useStepValidation } from "./setup-wizard/use-step-validation";

// Create the context with a default undefined value
const SetupWizardContext = createContext<SetupWizardContextType | undefined>(undefined);

// Provider component
export const SetupWizardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Use our custom hooks to manage different aspects of the wizard
  const {
    formData,
    handleChange,
    handleApiKeyChange,
    handleRadioChange,
    handleCheckboxChange,
    handleCrmDataSelectionChange
  } = useFormData();

  const {
    multiCrmEnabled,
    setMultiCrmEnabled,
    multiDestinationEnabled,
    setMultiDestinationEnabled,
    selectedSourceCrms,
    selectedDestinationCrms,
    customCrmNames,
    handleCustomCrmNameChange,
    handleSourceCrmToggle,
    handleDestinationCrmToggle
  } = useCrmSelection(formData, setFormData);

  // Determine if we should show per-CRM data selection
  const showPerCrmDataSelection = multiCrmEnabled && selectedSourceCrms.length > 1;

  const { isStepValid } = useStepValidation(
    currentStep,
    formData,
    multiCrmEnabled,
    selectedSourceCrms,
    multiDestinationEnabled,
    selectedDestinationCrms,
    customCrmNames,
    showPerCrmDataSelection
  );

  const {
    currentStep,
    setCurrentStep,
    handleNext,
    handlePrevious
  } = useWizardNavigation(wizardSteps, isStepValid);

  const { isSubmitting, handleSubmit } = useSubmission(
    formData,
    selectedSourceCrms,
    multiCrmEnabled,
    selectedDestinationCrms,
    multiDestinationEnabled,
    customCrmNames
  );

  // Context value
  const contextValue: SetupWizardContextType = {
    currentStep,
    steps: wizardSteps,
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
    setCurrentStep,
    handleNext,
    handlePrevious,
    handleSubmit
  };

  return (
    <SetupWizardContext.Provider value={contextValue}>
      {children}
    </SetupWizardContext.Provider>
  );
};

// Custom hook for using the context
export const useSetupWizard = () => {
  const context = useContext(SetupWizardContext);
  if (context === undefined) {
    throw new Error('useSetupWizard must be used within a SetupWizardProvider');
  }
  return context;
};
