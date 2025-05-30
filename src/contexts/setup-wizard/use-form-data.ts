
import { useState } from "react";
import { SetupFormData, CrmDataSelection } from "./types";

export const useFormData = () => {
  const [formData, setFormData] = useState<SetupFormData>({
    companyName: "",
    sourceCrm: "salesforce",
    destinationCrm: "hubspot",
    salesforceApiKey: "",
    hubspotApiKey: "",
    dataTypes: [] as string[],
    customMapping: "",
    migrationStrategy: "full",
    apiKeys: {} as Record<string, string>,
    customSourceCrm: "",
    customDestinationCrm: "",
    crmDataSelections: [] as CrmDataSelection[],
    selectedDestinationCrms: ['hubspot'],
    multiDestinationEnabled: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleApiKeyChange = (crmId: string, value: string) => {
    setFormData({
      ...formData,
      apiKeys: {
        ...formData.apiKeys,
        [crmId]: value
      }
    });
  };
  
  const handleRadioChange = (value: string, field: string) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };
  
  const handleCheckboxChange = (value: string) => {
    const updatedDataTypes = formData.dataTypes.includes(value)
      ? formData.dataTypes.filter(item => item !== value)
      : [...formData.dataTypes, value];
      
    setFormData({
      ...formData,
      dataTypes: updatedDataTypes
    });
  };
  
  const handleCrmDataSelectionChange = (crmId: string, dataTypes: string[]) => {
    const updatedSelections = formData.crmDataSelections.filter(
      selection => selection.crmId !== crmId
    );
    
    // Find existing selection to preserve custom mapping
    const existingSelection = formData.crmDataSelections.find(
      selection => selection.crmId === crmId
    );
    
    updatedSelections.push({
      crmId,
      dataTypes,
      customMapping: existingSelection?.customMapping || ""
    });
    
    setFormData({
      ...formData,
      crmDataSelections: updatedSelections
    });
  };

  const handlePerCrmCustomMappingChange = (crmId: string, customMapping: string) => {
    const updatedSelections = formData.crmDataSelections.map(selection => {
      if (selection.crmId === crmId) {
        return {
          ...selection,
          customMapping
        };
      }
      return selection;
    });
    
    // If no selection exists for this CRM, create one
    if (!formData.crmDataSelections.find(s => s.crmId === crmId)) {
      updatedSelections.push({
        crmId,
        dataTypes: [],
        customMapping
      });
    }
    
    setFormData({
      ...formData,
      crmDataSelections: updatedSelections
    });
  };

  return {
    formData,
    setFormData,
    handleChange,
    handleApiKeyChange,
    handleRadioChange,
    handleCheckboxChange,
    handleCrmDataSelectionChange,
    handlePerCrmCustomMappingChange,
  };
};
