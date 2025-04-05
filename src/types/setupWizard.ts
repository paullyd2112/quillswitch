
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

export interface SetupFormData {
  companyName: string;
  sourceCrm: string;
  destinationCrm: string;
  salesforceApiKey: string;
  hubspotApiKey: string;
  dataTypes: string[];
  customMapping: string;
  migrationStrategy: string;
  apiKeys: Record<string, string>;
  customSourceCrm: string;
  customDestinationCrm: string;
}
