
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  ArrowRight, 
  ArrowLeft,
  Database,
  FileCode,
  FileCheck,
  Key,
  Settings,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import ContentSection from "@/components/layout/ContentSection";
import FadeIn from "@/components/animations/FadeIn";
import GlassPanel from "@/components/ui-elements/GlassPanel";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { createDefaultMigrationProject } from "@/services/migrationService";

// Import components and types
import CompanyInfoStep from "@/components/setup-wizard/CompanyInfoStep";
import SourceCrmStep from "@/components/setup-wizard/SourceCrmStep";
import DestinationCrmStep from "@/components/setup-wizard/DestinationCrmStep";
import DataSelectionStep from "@/components/setup-wizard/DataSelectionStep";
import PerCrmDataSelectionStep from "@/components/setup-wizard/PerCrmDataSelectionStep";
import ConfirmationStep from "@/components/setup-wizard/ConfirmationStep";
import ProgressSteps from "@/components/setup-wizard/ProgressSteps";
import { WizardStep, SetupFormData, CrmDataSelection } from "@/types/setupWizard";
import { sourceCrmOptions, destinationCrmOptions } from "@/config/crmOptions";

const SetupWizard = () => {
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
  
  const steps: WizardStep[] = [
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
    if (currentStep < steps.length - 1) {
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-slate-50 dark:from-background dark:to-slate-900/50 hero-gradient">
      <Navbar />
      
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 relative">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <FadeIn>
              <Badge className="mb-4 bg-brand-100 text-brand-700 hover:bg-brand-200 dark:bg-brand-900/30 dark:text-brand-400 dark:hover:bg-brand-900/40">
                Migration Setup
              </Badge>
            </FadeIn>
            <FadeIn delay="100">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
                CRM Migration Wizard
              </h1>
            </FadeIn>
            <FadeIn delay="200">
              <p className="text-xl text-muted-foreground mb-8">
                Configure your CRM migration in just a few steps to switch platforms seamlessly
              </p>
            </FadeIn>
          </div>
        </div>
      </section>
      
      <ContentSection className="py-12 pb-32">
        <GlassPanel className="max-w-4xl mx-auto">
          <div className="p-6 md:p-8 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Configure Your CRM Migration</h2>
              <p className="text-sm text-muted-foreground">
                Step {currentStep + 1} of {steps.length}
              </p>
            </div>
            
            <ProgressSteps 
              steps={steps} 
              currentStep={currentStep} 
              setCurrentStep={setCurrentStep} 
            />
          </div>
          
          <div className="p-6 md:p-8">
            <FadeIn>
              {currentStep === 0 && (
                <CompanyInfoStep 
                  formData={formData} 
                  handleChange={handleChange} 
                />
              )}
              
              {currentStep === 1 && (
                <SourceCrmStep 
                  formData={formData}
                  multiCrmEnabled={multiCrmEnabled}
                  setMultiCrmEnabled={setMultiCrmEnabled}
                  selectedSourceCrms={selectedSourceCrms}
                  handleSourceCrmToggle={handleSourceCrmToggle}
                  handleApiKeyChange={handleApiKeyChange}
                  handleCustomCrmNameChange={handleCustomCrmNameChange}
                  customCrmNames={customCrmNames}
                  sourceCrmOptions={sourceCrmOptions}
                />
              )}
              
              {currentStep === 2 && (
                <DestinationCrmStep 
                  formData={formData}
                  handleRadioChange={handleRadioChange}
                  handleApiKeyChange={handleApiKeyChange}
                  handleCustomCrmNameChange={handleCustomCrmNameChange}
                  customCrmNames={customCrmNames}
                  destinationCrmOptions={destinationCrmOptions}
                  multiDestinationEnabled={multiDestinationEnabled}
                  setMultiDestinationEnabled={setMultiDestinationEnabled}
                  selectedDestinationCrms={selectedDestinationCrms}
                  handleDestinationCrmToggle={handleDestinationCrmToggle}
                />
              )}
              
              {currentStep === 3 && showPerCrmDataSelection && (
                <PerCrmDataSelectionStep 
                  formData={formData}
                  handleCrmDataSelectionChange={handleCrmDataSelectionChange}
                  handleChange={handleChange}
                  handleRadioChange={handleRadioChange}
                  selectedSourceCrms={selectedSourceCrms}
                  sourceCrmOptions={sourceCrmOptions}
                />
              )}
              
              {currentStep === 3 && !showPerCrmDataSelection && (
                <DataSelectionStep 
                  formData={formData}
                  handleChange={handleChange}
                  handleCheckboxChange={handleCheckboxChange}
                  handleRadioChange={handleRadioChange}
                />
              )}
              
              {currentStep === 4 && (
                <ConfirmationStep 
                  formData={formData}
                  isSubmitting={isSubmitting}
                  handleSubmit={handleSubmit}
                  multiCrmEnabled={multiCrmEnabled}
                  selectedSourceCrms={selectedSourceCrms}
                  customCrmNames={customCrmNames}
                  sourceCrmOptions={sourceCrmOptions}
                  destinationCrmOptions={destinationCrmOptions}
                  multiDestinationEnabled={multiDestinationEnabled}
                  selectedDestinationCrms={selectedDestinationCrms}
                />
              )}
            </FadeIn>
          </div>
          
          <div className="p-6 md:p-8 border-t border-gray-100 dark:border-gray-800 flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0 || isSubmitting}
              className="gap-2"
            >
              <ArrowLeft size={16} /> Previous
            </Button>
            
            <Button
              onClick={handleNext}
              disabled={!isStepValid() || isSubmitting}
              className="gap-2"
            >
              {currentStep < steps.length - 1 ? (
                <>
                  Next <ArrowRight size={16} />
                </>
              ) : (
                <>
                  Finish Setup <CheckCircle size={16} />
                </>
              )}
            </Button>
          </div>
        </GlassPanel>
      </ContentSection>
    </div>
  );
};

export default SetupWizard;
