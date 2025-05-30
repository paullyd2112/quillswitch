
import { ReactNode } from "react";

// WizardStep type with the icon as a component + props structure
export interface WizardStep {
  id: string;
  title: string;
  description: string;
  icon: {
    component: any;
    props: {
      size: number;
    };
  };
}

export interface CrmSystem {
  id: string;
  name: string;
  description?: string;
  popular?: boolean;
  apiKeyLabel?: string;
  apiKeyHelp?: string;
}

export interface CrmDataSelection {
  crmId: string;
  dataTypes: string[];
  customMapping?: string; // Add per-CRM custom mapping
}

export interface SetupFormData {
  companyName: string;
  industry?: string;
  companySize?: string;
  migrationGoals?: string;
  sourceCrm: string;
  destinationCrm: string;
  salesforceApiKey?: string;
  hubspotApiKey?: string;
  dataTypes: string[];
  customMapping: string;
  migrationStrategy: string;
  apiKeys: Record<string, string>;
  customSourceCrm?: string;
  customDestinationCrm?: string;
  crmDataSelections: CrmDataSelection[];
  selectedDestinationCrms: string[];
  multiDestinationEnabled: boolean;
}

// Context interface
export interface SetupWizardContextType {
  currentStep: number;
  steps: WizardStep[];
  formData: SetupFormData;
  isSubmitting: boolean;
  multiCrmEnabled: boolean;
  multiDestinationEnabled: boolean;
  selectedSourceCrms: string[];
  selectedDestinationCrms: string[];
  customCrmNames: Record<string, string>;
  showPerCrmDataSelection: boolean;
  isStepValid: () => boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleApiKeyChange: (crmId: string, value: string) => void;
  handleCustomCrmNameChange: (crmId: string, value: string) => void;
  handleRadioChange: (value: string, field: string) => void;
  handleCheckboxChange: (value: string) => void;
  handleCrmDataSelectionChange: (crmId: string, dataTypes: string[]) => void;
  handlePerCrmCustomMappingChange: (crmId: string, customMapping: string) => void;
  handleSourceCrmToggle: (crmId: string) => void;
  handleDestinationCrmToggle: (crmId: string) => void;
  setMultiCrmEnabled: (enabled: boolean) => void;
  setMultiDestinationEnabled: (enabled: boolean) => void;
  setCurrentStep: (step: number) => void;
  handleNext: () => void;
  handlePrevious: () => void;
  handleSubmit: () => void;
}
