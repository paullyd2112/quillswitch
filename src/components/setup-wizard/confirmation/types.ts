
import { CrmSystem, SetupFormData } from "@/types/setupWizard";

export interface ConfirmationSectionProps {
  formData: SetupFormData;
  multiCrmEnabled?: boolean;
  selectedSourceCrms?: string[];
  customCrmNames: Record<string, string>;
  sourceCrmOptions: CrmSystem[];
  destinationCrmOptions: CrmSystem[];
  multiDestinationEnabled?: boolean;
  selectedDestinationCrms?: string[];
}

export interface ConfirmationStepProps extends ConfirmationSectionProps {
  isSubmitting: boolean;
  handleSubmit: () => void;
}
