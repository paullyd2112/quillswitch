
import { SetupFormData, CrmSystem } from "@/contexts/setup-wizard/types";

export interface ConfirmationStepProps {
  formData: SetupFormData;
  isSubmitting: boolean;
  handleSubmit: () => void;
  multiCrmEnabled: boolean;
  selectedSourceCrms: string[];
  customCrmNames: Record<string, string>;
  sourceCrmOptions: CrmSystem[];
  destinationCrmOptions: CrmSystem[];
  multiDestinationEnabled: boolean;
  selectedDestinationCrms: string[];
}

export interface CompanyInfoSectionProps {
  formData: SetupFormData;
  customCrmNames?: Record<string, string>;
  sourceCrmOptions?: CrmSystem[];
  destinationCrmOptions?: CrmSystem[];
}

export interface CrmConfigSectionProps {
  formData: SetupFormData;
  multiCrmEnabled: boolean;
  selectedSourceCrms: string[];
  customCrmNames: Record<string, string>;
  sourceCrmOptions: CrmSystem[];
  destinationCrmOptions: CrmSystem[];
  multiDestinationEnabled: boolean;
  selectedDestinationCrms: string[];
}

export interface MigrationConfigSectionProps {
  formData: SetupFormData;
  multiCrmEnabled: boolean;
  customCrmNames?: Record<string, string>;
  sourceCrmOptions?: CrmSystem[];
  destinationCrmOptions?: CrmSystem[];
}

export interface SubmitButtonProps {
  isSubmitting: boolean;
  handleSubmit: () => void;
}
