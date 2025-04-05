
import { useState } from "react";
import { SetupFormData } from "./types";

export const useCrmSelection = (formData: SetupFormData, setFormData: React.Dispatch<React.SetStateAction<SetupFormData>>) => {
  const [multiCrmEnabled, setMultiCrmEnabled] = useState(false);
  const [multiDestinationEnabled, setMultiDestinationEnabled] = useState(false);
  const [selectedSourceCrms, setSelectedSourceCrms] = useState<string[]>(['salesforce']);
  const [selectedDestinationCrms, setSelectedDestinationCrms] = useState<string[]>(['hubspot']);
  const [customCrmNames, setCustomCrmNames] = useState<Record<string, string>>({});
  
  const handleCustomCrmNameChange = (crmId: string, value: string) => {
    setCustomCrmNames({
      ...customCrmNames,
      [crmId]: value
    });
  };
  
  const handleSourceCrmToggle = (crmId: string) => {
    if (multiCrmEnabled) {
      const updatedCrms = selectedSourceCrms.includes(crmId) 
        ? selectedSourceCrms.filter(id => id !== crmId) 
        : [...selectedSourceCrms, crmId];
      
      setSelectedSourceCrms(updatedCrms);
      
      // Initialize data selections for this CRM if it's newly added
      if (!selectedSourceCrms.includes(crmId) && !formData.crmDataSelections.some(s => s.crmId === crmId)) {
        const { handleCrmDataSelectionChange } = useCrmSelectionHelpers(formData, setFormData);
        handleCrmDataSelectionChange(crmId, []);
      }
    } else {
      setFormData({
        ...formData,
        sourceCrm: crmId
      });
    }
  };
  
  const handleDestinationCrmToggle = (crmId: string) => {
    if (multiDestinationEnabled) {
      const updatedCrms = selectedDestinationCrms.includes(crmId) 
        ? selectedDestinationCrms.filter(id => id !== crmId) 
        : [...selectedDestinationCrms, crmId];
      
      setSelectedDestinationCrms(updatedCrms);
      setFormData({
        ...formData,
        selectedDestinationCrms: updatedCrms
      });
    } else {
      setFormData({
        ...formData,
        destinationCrm: crmId
      });
    }
  };

  return {
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
  };
};

// Helper functions to avoid circular dependencies
const useCrmSelectionHelpers = (formData: SetupFormData, setFormData: React.Dispatch<React.SetStateAction<SetupFormData>>) => {
  const handleCrmDataSelectionChange = (crmId: string, dataTypes: string[]) => {
    const updatedSelections = formData.crmDataSelections.filter(
      selection => selection.crmId !== crmId
    );
    
    updatedSelections.push({
      crmId,
      dataTypes
    });
    
    setFormData({
      ...formData,
      crmDataSelections: updatedSelections
    });
  };

  return { handleCrmDataSelectionChange };
};
