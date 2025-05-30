
import { useConnection } from "@/contexts/ConnectionContext";
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
  const { connectedSystems } = useConnection();

  const isStepValid = (): boolean => {
    const connectedSourceCrms = connectedSystems.filter(system => system.type === "source");
    const connectedDestinationCrms = connectedSystems.filter(system => system.type === "destination");

    switch (currentStep) {
      case 0: // Company details
        return formData.companyName.trim() !== "";
      
      case 1: // Source CRM
        if (multiCrmEnabled) {
          const connectedSelectedSources = selectedSourceCrms.filter(crmId => 
            connectedSourceCrms.some(system => system.id === crmId)
          );
          return connectedSelectedSources.length > 0;
        } else {
          return formData.sourceCrm !== "" && 
                 connectedSourceCrms.some(system => system.id === formData.sourceCrm);
        }
      
      case 2: // Destination CRM
        if (multiDestinationEnabled) {
          const connectedSelectedDestinations = selectedDestinationCrms.filter(crmId => 
            connectedDestinationCrms.some(system => system.id === crmId)
          );
          return connectedSelectedDestinations.length > 0;
        } else {
          return formData.destinationCrm !== "" && 
                 connectedDestinationCrms.some(system => system.id === formData.destinationCrm);
        }
      
      case 3: // Data types
        if (showPerCrmDataSelection) {
          return formData.crmDataSelections.length > 0 && 
                 formData.crmDataSelections.every(selection => selection.dataTypes.length > 0);
        }
        return formData.dataTypes.length > 0;
      
      case 4: // Migration strategy
        return formData.migrationStrategy !== "";
      
      default:
        return true;
    }
  };

  return { isStepValid };
};
