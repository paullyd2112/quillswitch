
import React, { createContext, useContext, useEffect, useCallback } from "react";
import { SetupWizardContextType } from "./setup-wizard/types";
import { wizardSteps } from "./setup-wizard/wizard-steps";
import { useFormData } from "./setup-wizard/use-form-data";
import { useCrmSelection } from "./setup-wizard/use-crm-selection";
import { useWizardNavigation } from "./setup-wizard/use-wizard-navigation";
import { useSubmission } from "./setup-wizard/use-submission";
import { useStepValidation } from "./setup-wizard/use-step-validation";

// Create the context with a default undefined value
const SetupWizardContext = createContext<SetupWizardContextType | undefined>(undefined);

const STORAGE_KEY = "qs_wizard_state";

// Provider component
export const SetupWizardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Use our custom hooks to manage different aspects of the wizard
  const {
    formData,
    setFormData,
    handleChange,
    handleApiKeyChange,
    handleRadioChange,
    handleCheckboxChange,
    handleCrmDataSelectionChange,
    handlePerCrmCustomMappingChange
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

  const {
    currentStep,
    setCurrentStep,
    handleNext,
    handlePrevious
  } = useWizardNavigation(wizardSteps, () => isStepValid());

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

  const { isSubmitting, handleSubmit } = useSubmission(
    formData,
    selectedSourceCrms,
    multiCrmEnabled,
    selectedDestinationCrms,
    multiDestinationEnabled,
    customCrmNames
  );

  // Persistence: load on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed?.formData) {
        setFormData(parsed.formData);
      }
      if (typeof parsed?.currentStep === "number") {
        setCurrentStep(parsed.currentStep);
      }
    } catch (e) {
      // ignore corrupt state
      console.warn("Failed to load wizard state", e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persistence: save on change
  useEffect(() => {
    const state = {
      formData,
      currentStep,
      updatedAt: Date.now(),
      version: 1,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn("Failed to save wizard state", e);
    }
  }, [formData, currentStep]);

  const saveProgress = useCallback(() => {
    try {
      const state = {
        formData,
        currentStep,
        updatedAt: Date.now(),
        version: 1,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn("Failed to manually save wizard state", e);
    }
  }, [formData, currentStep]);

  const clearProgress = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }, []);

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
    handlePerCrmCustomMappingChange,
    handleSourceCrmToggle,
    handleDestinationCrmToggle,
    setMultiCrmEnabled,
    setMultiDestinationEnabled,
    setCurrentStep,
    handleNext,
    handlePrevious,
    handleSubmit,
    saveProgress,
    clearProgress,
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
