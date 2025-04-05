import React, { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CrmDataSelection, SetupFormData, WizardStep } from "@/types/setupWizard";
import { createDefaultMigrationProject } from "@/services/migrationService";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, ArrowRight, ArrowLeft, Database, FileCode, FileCheck, Settings } from "lucide-react";

// Define the context type
interface SetupWizardContextType {
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
  handleSourceCrmToggle: (crmId: string) => void;
  handleDestinationCrmToggle: (crmId: string) => void;
  setMultiCrmEnabled: (enabled: boolean) => void;
  setMultiDestinationEnabled: (enabled: boolean) => void;
  setCurrentStep: (step: number) => void;
  handleNext: () => void;
  handlePrevious: () => void;
  handleSubmit: () => void;
}

// Create the context with a default undefined value
const SetupWizardContext = createContext<SetupWizardContextType | undefined>(undefined);

// Define steps
const wizardSteps: WizardStep[] = [
  {
    id: "company",
    title: "Company Info",
    description: "Basic company information",
    icon: <Settings size={24} />
  },
  {
    id: "source",
    title: "Source CRM",
    description: "Configure your current CRM",
    icon: <Database size={24} />
  },
  {
    id: "destination",
    title: "Destination CRM",
    description: "Setup your new CRM",
    icon: <FileCode size={24} />
  },
  {
    id: "data",
    title: "Data Selection",
    description: "Choose what to migrate",
    icon: <FileCheck size={24} />
  },
  {
    id: "confirmation",
    title: "Confirmation",
    description: "Review and confirm",
    icon: <CheckCircle size={24} />
  }
];

// Provider component
export const SetupWizardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [multiCrmEnabled, setMultiCrmEnabled] = useState(false);
  const [multiDestinationEnabled, setMultiDestinationEnabled] = useState(false);
  const [selectedSourceCrms, setSelectedSourceCrms] = useState<string[]>(['salesforce']);
  const [selectedDestinationCrms, setSelectedDestinationCrms] = useState<string[]>(['hubspot']);
  const [customCrmNames, setCustomCrmNames] = useState<Record<string, string>>({});
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

  // Determine if we should show per-CRM data selection
  const showPerCrmDataSelection = multiCrmEnabled && selectedSourceCrms.length > 1;
  
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
  
  const handleCustomCrmNameChange = (crmId: string, value: string) => {
    setCustomCrmNames({
      ...customCrmNames,
      [crmId]: value
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
    
    updatedSelections.push({
      crmId,
      dataTypes
    });
    
    setFormData({
      ...formData,
      crmDataSelections: updatedSelections
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
  
  const handleNext = () => {
    if (currentStep < wizardSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };
  
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Prepare the form data for submission
      const submissionData = {
        ...formData,
        // If multi-CRM is enabled, use the array of selected CRMs
        sourceCrm: multiCrmEnabled ? selectedSourceCrms : formData.sourceCrm,
        // If multi-destination is enabled, use the array of selected destination CRMs
        destinationCrm: multiDestinationEnabled ? selectedDestinationCrms : formData.destinationCrm,
        // Include custom CRM names if applicable
        customCrmNames: customCrmNames,
        // Include multi-CRM and multi-destination flags
        multiCrmEnabled,
        multiDestinationEnabled
      };
      
      // Create a migration project in Supabase and initialize tracking
      const project = await createDefaultMigrationProject(submissionData);
      
      if (project) {
        toast({
          title: "Migration Setup Complete!",
          description: "Your CRM migration has been configured and is ready to track.",
        });
        
        // Redirect to the migration dashboard for the new project
        navigate(`/migrations/${project.id}`);
      } else {
        throw new Error("Failed to create migration project");
      }
    } catch (error: any) {
      console.error("Error setting up migration:", error);
      toast({
        title: "Setup Failed",
        description: error.message || "There was an error setting up your migration. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };
  
  const isStepValid = () => {
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
          return customCrmNames["destination"] && formData.apiKeys["destination"];
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
    handleSourceCrmToggle,
    handleDestinationCrmToggle,
    setMultiCrmEnabled,
    setMultiDestinationEnabled,
    setCurrentStep,
    handleNext,
    handlePrevious,
    handleSubmit
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
