
export interface CrmSystem {
  id: string;
  name: string;
  description?: string;
  apiKeyLabel?: string;
  apiKeyHelp?: string;
  popular?: boolean;
}

export interface WizardStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export interface CrmDataSelection {
  crmId: string;
  dataTypes: string[];
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
  // New fields for multi-CRM support
  crmDataSelections: CrmDataSelection[];
  selectedDestinationCrms: string[];
  multiDestinationEnabled: boolean;
}
