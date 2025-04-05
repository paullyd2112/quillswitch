import { SetupFormData } from "./types";

export const useStepValidation = (
  currentStep: number,
  formData: SetupFormData,
  multiCrmEnabled: boolean,
  selectedSourceCrms: string[],
  multiDestinationEnabled: boolean,
  selectedDestinationCrms: string[],
  customCrmNames: Record<string, string>,
  showPerCrmDataSelection: boolean
) => {
  const isStepValid = (): boolean => {
    switch (currentStep) {
      case 0: // Company Info
        return formData.companyName.trim() !== "";
      case 1: // Source CRM
        // For multi-CRM, ensure at least one CRM is selected
        if (multiCrmEnabled) {
          return selectedSourceCrms.length > 0;
        }
        // For single CRM, check if the selected CRM has an API key if needed
        return true;
      case 2: // Destination CRM
        if (multiDestinationEnabled) {
          return selectedDestinationCrms.length > 0;
        }
        if (formData.destinationCrm === "custom") {
          return Boolean(customCrmNames["destination"] && formData.apiKeys["destination"]);
        }
        // Other validation for destination CRM
        return true;
      case 3: // Data Selection
        // For per-CRM data selection in multi-CRM mode
        if (showPerCrmDataSelection) {
          return formData.crmDataSelections.some(selection => selection.dataTypes.length > 0);
        }
        // For regular data selection
        return formData.dataTypes.length > 0;
      default:
        return true;
    }
  };

  return { isStepValid };
};
