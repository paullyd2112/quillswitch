import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  CheckCircle,
  ChevronRight, 
  ArrowRight, 
  ArrowLeft,
  Database,
  FileCode,
  Users,
  Zap,
  FileCheck,
  Key,
  RefreshCw,
  Settings,
  PlusCircle
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import ContentSection from "@/components/layout/ContentSection";
import FadeIn from "@/components/animations/FadeIn";
import SlideUp from "@/components/animations/SlideUp";
import GlassPanel from "@/components/ui-elements/GlassPanel";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { createDefaultMigrationProject } from "@/services/migrationService";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface WizardStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface CrmSystem {
  id: string;
  name: string;
  description?: string;
  apiKeyLabel?: string;
  apiKeyHelp?: string;
  popular?: boolean;
}

const SetupWizard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [multiCrmEnabled, setMultiCrmEnabled] = useState(false);
  const [selectedSourceCrms, setSelectedSourceCrms] = useState<string[]>(['salesforce']);
  const [customCrmNames, setCustomCrmNames] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
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
    customDestinationCrm: ""
  });
  
  const sourceCrmOptions: CrmSystem[] = [
    { id: 'salesforce', name: 'Salesforce', description: 'Dominant market leader', popular: true },
    { id: 'dynamics', name: 'Microsoft Dynamics 365', description: 'Strong in the enterprise space', popular: true },
    { id: 'hubspot', name: 'HubSpot CRM', description: 'Popular with SMBs, known for inbound marketing', popular: true },
    { id: 'zoho', name: 'Zoho CRM', description: 'Cost-effective, feature-rich option', popular: true },
    { id: 'oracle', name: 'Oracle CX', description: 'Enterprise-level CRM integrated with Oracle products' },
    { id: 'sap', name: 'SAP CRM', description: 'Enterprise solutions integrated with SAP ERP' },
    { id: 'pipedrive', name: 'Pipedrive', description: 'Sales-focused with pipeline management', popular: true },
    { id: 'monday', name: 'Monday.com', description: 'Work OS platform with CRM capabilities' },
    { id: 'freshsales', name: 'Freshsales', description: 'AI-powered CRM with user-friendly interface' },
    { id: 'zendesk', name: 'Zendesk Sell', description: 'Sales CRM focused on productivity' },
    { id: 'sugar', name: 'SugarCRM', description: 'Flexible and customizable CRM' },
    { id: 'close', name: 'Close.io', description: 'Built for inside sales teams' },
    { id: 'insightly', name: 'Insightly', description: 'CRM for project management and sales' },
    { id: 'copper', name: 'Copper CRM', description: 'Integrates with Google Workspace' },
    { id: 'keap', name: 'Keap', description: 'CRM and marketing automation for small businesses' },
    { id: 'nutshell', name: 'Nutshell', description: 'Simple CRM for small to mid sized business' },
    { id: 'apptivo', name: 'Apptivo CRM', description: 'Suite of business apps with adaptable CRM' },
    { id: 'salesflare', name: 'Salesflare', description: 'CRM that automates data entry' },
    { id: 'custom', name: 'Custom/Other CRM', description: 'Specify your own CRM system' }
  ];
  
  const destinationCrmOptions: CrmSystem[] = [
    { id: 'hubspot', name: 'HubSpot', apiKeyLabel: 'HubSpot API Key', apiKeyHelp: 'Your API key can be found in HubSpot > Settings > Integrations > API Keys', popular: true },
    { id: 'salesforce', name: 'Salesforce', apiKeyLabel: 'Salesforce API Key', apiKeyHelp: 'Your API key can be found in Salesforce Setup > Apps > App Manager > Your Connected App > Manage Consumer Details', popular: true },
    { id: 'pipedrive', name: 'Pipedrive', apiKeyLabel: 'Pipedrive API Key', apiKeyHelp: 'Your API key can be found in Settings > Personal > API', popular: true },
    { id: 'monday', name: 'Monday Sales CRM', apiKeyLabel: 'Monday API Key', apiKeyHelp: 'Your API key can be found in Admin > API', popular: true },
    { id: 'zoho', name: 'Zoho CRM', apiKeyLabel: 'Zoho API Key', apiKeyHelp: 'Your API key can be generated in Setup > Developer Space > API > Generate New Token', popular: true },
    { id: 'dynamics', name: 'Microsoft Dynamics 365', apiKeyLabel: 'Dynamics API Key', apiKeyHelp: 'Your API key can be found in Settings > Customizations > Developer Resources', popular: true },
    { id: 'custom', name: 'Custom/Other CRM', apiKeyLabel: 'API Key', apiKeyHelp: 'Enter the API key for your CRM system' }
  ];
  
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
  
  const handleSourceCrmToggle = (crmId: string) => {
    if (multiCrmEnabled) {
      // For multi-CRM mode
      setSelectedSourceCrms(prev => 
        prev.includes(crmId) 
          ? prev.filter(id => id !== crmId) 
          : [...prev, crmId]
      );
    } else {
      // For single CRM mode
      setFormData({
        ...formData,
        sourceCrm: crmId
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
        // Include custom CRM names if applicable
        customCrmNames: customCrmNames
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
        if (formData.destinationCrm === "custom") {
          return customCrmNames["destination"] && formData.apiKeys["destination"];
        }
        // Other validation for destination CRM
        return true;
      case 3: // Data Selection
        return formData.dataTypes.length > 0;
      default:
        return true;
    }
  };

  const renderSourceCrmOptions = () => {
    const popularOptions = sourceCrmOptions.filter(crm => crm.popular);
    const otherOptions = sourceCrmOptions.filter(crm => !crm.popular);
    
    return (
      <>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
          {popularOptions.map(crm => (
            <div 
              key={crm.id}
              className={`border rounded-md p-3 cursor-pointer transition-colors ${
                multiCrmEnabled 
                  ? selectedSourceCrms.includes(crm.id) ? "bg-brand-50 border-brand-200 dark:bg-brand-900/20 dark:border-brand-800" : ""
                  : formData.sourceCrm === crm.id ? "bg-brand-50 border-brand-200 dark:bg-brand-900/20 dark:border-brand-800" : ""
              }`}
              onClick={() => handleSourceCrmToggle(crm.id)}
            >
              <div className="flex items-start gap-2">
                {multiCrmEnabled ? (
                  <Checkbox 
                    checked={selectedSourceCrms.includes(crm.id)} 
                    onCheckedChange={() => handleSourceCrmToggle(crm.id)}
                    className="mt-1"
                  />
                ) : (
                  <RadioGroupItem 
                    value={crm.id} 
                    id={`source-${crm.id}`} 
                    checked={formData.sourceCrm === crm.id}
                    className="mt-1"
                  />
                )}
                <div>
                  <Label htmlFor={`source-${crm.id}`} className="font-medium cursor-pointer">
                    {crm.name}
                  </Label>
                  {crm.description && (
                    <p className="text-xs text-muted-foreground">{crm.description}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <Accordion type="single" collapsible className="mb-6">
          <AccordionItem value="more-crms">
            <AccordionTrigger className="text-sm">Show more CRM options</AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-2">
                {otherOptions.map(crm => (
                  <div 
                    key={crm.id}
                    className={`border rounded-md p-3 cursor-pointer transition-colors ${
                      multiCrmEnabled 
                        ? selectedSourceCrms.includes(crm.id) ? "bg-brand-50 border-brand-200 dark:bg-brand-900/20 dark:border-brand-800" : ""
                        : formData.sourceCrm === crm.id ? "bg-brand-50 border-brand-200 dark:bg-brand-900/20 dark:border-brand-800" : ""
                    }`}
                    onClick={() => handleSourceCrmToggle(crm.id)}
                  >
                    <div className="flex items-start gap-2">
                      {multiCrmEnabled ? (
                        <Checkbox 
                          checked={selectedSourceCrms.includes(crm.id)} 
                          onCheckedChange={() => handleSourceCrmToggle(crm.id)}
                          className="mt-1"
                        />
                      ) : (
                        <RadioGroupItem 
                          value={crm.id} 
                          id={`source-${crm.id}`} 
                          checked={formData.sourceCrm === crm.id}
                          className="mt-1"
                        />
                      )}
                      <div>
                        <Label htmlFor={`source-${crm.id}`} className="font-medium cursor-pointer">
                          {crm.name}
                        </Label>
                        {crm.description && (
                          <p className="text-xs text-muted-foreground">{crm.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </>
    );
  };
  
  const renderApiKeyInputs = () => {
    const selectedCrms = multiCrmEnabled 
      ? selectedSourceCrms 
      : [formData.sourceCrm];
    
    return (
      <div className="space-y-4 mt-6">
        {selectedCrms.map(crmId => {
          const crmOption = sourceCrmOptions.find(c => c.id === crmId);
          
          if (!crmOption) return null;
          
          return (
            <div key={crmId} className="space-y-2 border p-4 rounded-md">
              <div className="flex justify-between items-center">
                <Label className="font-medium">{crmOption.name} Configuration</Label>
                {multiCrmEnabled && (
                  <Badge variant="outline">{crmOption.name}</Badge>
                )}
              </div>
              
              {crmId === 'custom' ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="custom-crm-name">Custom CRM Name</Label>
                    <Input 
                      id="custom-crm-name"
                      placeholder="Enter your CRM system name"
                      value={customCrmNames[crmId] || ''}
                      onChange={(e) => handleCustomCrmNameChange(crmId, e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`api-key-${crmId}`}>API Key</Label>
                    <Input 
                      id={`api-key-${crmId}`}
                      placeholder="Enter your API key"
                      value={formData.apiKeys[crmId] || ''}
                      onChange={(e) => handleApiKeyChange(crmId, e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Please enter the API key for your custom CRM system
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor={`api-key-${crmId}`}>{crmOption.name} API Key</Label>
                  <Input 
                    id={`api-key-${crmId}`}
                    placeholder={`Enter your ${crmOption.name} API key`}
                    value={formData.apiKeys[crmId] || ''}
                    onChange={(e) => handleApiKeyChange(crmId, e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Your API key can be found in your {crmOption.name} account settings
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
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
            
            <div className="mt-8">
              <div className="relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full" />
                <div
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-brand-500 dark:bg-brand-400 rounded-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                />
                
                <div className="relative flex justify-between">
                  {steps.map((step, index) => (
                    <div 
                      key={step.id} 
                      className="flex flex-col items-center"
                      onClick={() => index < currentStep && setCurrentStep(index)} // Allow going back to previous steps
                    >
                      <div 
                        className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-colors ${
                          index < currentStep
                            ? "bg-brand-500 text-white cursor-pointer"
                            : index === currentStep
                            ? "bg-brand-500 text-white ring-4 ring-brand-100 dark:ring-brand-900/50"
                            : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                        }`}
                      >
                        {index < currentStep ? (
                          <CheckCircle size={20} />
                        ) : (
                          step.icon
                        )}
                      </div>
                      <div className="mt-2 hidden md:block">
                        <p className={`text-sm font-medium ${
                          index <= currentStep
                            ? "text-foreground"
                            : "text-muted-foreground"
                        }`}>
                          {step.title}
                        </p>
                        <p className="text-xs text-muted-foreground hidden lg:block">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-6 md:p-8">
            <FadeIn>
              {currentStep === 0 && (
                <div>
                  <h3 className="text-xl font-medium mb-4">Company Information</h3>
                  <p className="text-muted-foreground mb-6">
                    Tell us about your company to help us customize your CRM migration process.
                  </p>
                  
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company Name</Label>
                      <Input 
                        id="companyName"
                        name="companyName"
                        placeholder="Acme Inc."
                        value={formData.companyName}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {currentStep === 1 && (
                <div>
                  <h3 className="text-xl font-medium mb-4">Source CRM Configuration</h3>
                  <p className="text-muted-foreground mb-6">
                    Configure access to your current CRM system that you want to migrate from.
                  </p>
                  
                  <div className="space-y-6">
                    <div className="flex items-start space-x-2 p-3 bg-muted/40 rounded-md">
                      <Checkbox 
                        id="multi-crm" 
                        checked={multiCrmEnabled}
                        onCheckedChange={(checked) => setMultiCrmEnabled(checked === true)}
                      />
                      <div>
                        <Label htmlFor="multi-crm" className="font-medium">Do you have data in multiple CRMs?</Label>
                        <p className="text-xs text-muted-foreground">Enable this to select and configure multiple source CRMs</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>{multiCrmEnabled ? "Select Source CRMs" : "Source CRM Platform"}</Label>
                      {renderSourceCrmOptions()}
                    </div>
                    
                    {renderApiKeyInputs()}
                  </div>
                </div>
              )}
              
              {currentStep === 2 && (
                <div>
                  <h3 className="text-xl font-medium mb-4">Destination CRM Configuration</h3>
                  <p className="text-muted-foreground mb-6">
                    Configure access to the CRM system you want to migrate to.
                  </p>
                  
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label>Destination CRM Platform</Label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {destinationCrmOptions.map(crm => (
                          <div 
                            key={crm.id}
                            className={`border rounded-md p-3 cursor-pointer transition-colors ${
                              formData.destinationCrm === crm.id ? "bg-brand-50 border-brand-200 dark:bg-brand-900/20 dark:border-brand-800" : ""
                            }`}
                            onClick={() => handleRadioChange(crm.id, "destinationCrm")}
                          >
                            <div className="flex items-start gap-2">
                              <RadioGroupItem 
                                value={crm.id} 
                                id={`dest-${crm.id}`} 
                                checked={formData.destinationCrm === crm.id}
                                className="mt-1"
                              />
                              <div>
                                <Label htmlFor={`dest-${crm.id}`} className="font-medium cursor-pointer">
                                  {crm.name}
                                </Label>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {formData.destinationCrm === "custom" ? (
                      <div className="space-y-4 border p-4 rounded-md">
                        <div className="space-y-2">
                          <Label htmlFor="custom-dest-name">Custom Destination CRM Name</Label>
                          <Input 
                            id="custom-dest-name"
                            placeholder="Enter your destination CRM name"
                            value={customCrmNames["destination"] || ''}
                            onChange={(e) => handleCustomCrmNameChange("destination", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="api-key-destination">API Key</Label>
                          <Input 
                            id="api-key-destination"
                            placeholder="Enter your API key"
                            value={formData.apiKeys["destination"] || ''}
                            onChange={(e) => handleApiKeyChange("destination", e.target.value)}
                          />
                          <p className="text-xs text-muted-foreground">
                            Please enter the API key for your custom destination CRM
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2 border p-4 rounded-md">
                        <Label htmlFor={`api-key-${formData.destinationCrm}`}>
                          {destinationCrmOptions.find(c => c.id === formData.destinationCrm)?.apiKeyLabel || 'API Key'}
                        </Label>
                        <Input 
                          id={`api-key-${formData.destinationCrm}`}
                          placeholder={`Enter your ${formData.destinationCrm} API key`}
                          value={formData.apiKeys[formData.destinationCrm] || ''}
                          onChange={(e) => handleApiKeyChange(formData.destinationCrm, e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">
                          {destinationCrmOptions.find(c => c.id === formData.destinationCrm)?.apiKeyHelp || 
                            `Your API key can be found in your ${formData.destinationCrm} account settings`}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {currentStep === 3 && (
                <div>
                  <h3 className="text-xl font-medium mb-4">Data Selection</h3>
                  <p className="text-muted-foreground mb-6">
                    Choose which data types you want to migrate from your current CRM to your new one.
                  </p>
                  
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <Label>Data Types to Migrate</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="flex items-start space-x-2">
                          <input 
                            type="checkbox" 
                            id="data-contacts" 
                            className="rounded border-gray-300 text-brand-500 mt-1"
                            checked={formData.dataTypes.includes("contacts")}
                            onChange={() => handleCheckboxChange("contacts")}
                          />
                          <div>
                            <Label htmlFor="data-contacts" className="font-medium">Contacts & Leads</Label>
                            <p className="text-xs text-muted-foreground">All contact and lead information</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-2">
                          <input 
                            type="checkbox" 
                            id="data-accounts" 
                            className="rounded border-gray-300 text-brand-500 mt-1"
                            checked={formData.dataTypes.includes("accounts")}
                            onChange={() => handleCheckboxChange("accounts")}
                          />
                          <div>
                            <Label htmlFor="data-accounts" className="font-medium">Accounts & Companies</Label>
                            <p className="text-xs text-muted-foreground">Organization information</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-2">
                          <input 
                            type="checkbox" 
                            id="data-opportunities" 
                            className="rounded border-gray-300 text-brand-500 mt-1"
                            checked={formData.dataTypes.includes("opportunities")}
                            onChange={() => handleCheckboxChange("opportunities")}
                          />
                          <div>
                            <Label htmlFor="data-opportunities" className="font-medium">Opportunities & Deals</Label>
                            <p className="text-xs text-muted-foreground">Sales pipeline and deals</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-2">
                          <input 
                            type="checkbox" 
                            id="data-cases" 
                            className="rounded border-gray-300 text-brand-500 mt-1"
                            checked={formData.dataTypes.includes("cases")}
                            onChange={() => handleCheckboxChange("cases")}
                          />
                          <div>
                            <Label htmlFor="data-cases" className="font-medium">Cases & Tickets</Label>
                            <p className="text-xs text-muted-foreground">Support cases and tickets</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-2">
                          <input 
                            type="checkbox" 
                            id="data-activities" 
                            className="rounded border-gray-300 text-brand-500 mt-1"
                            checked={formData.dataTypes.includes("activities")}
                            onChange={() => handleCheckboxChange("activities")}
                          />
                          <div>
                            <Label htmlFor="data-activities" className="font-medium">Activities & Tasks</Label>
                            <p className="text-xs text-muted-foreground">Call logs, emails, and tasks</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-2">
                          <input 
                            type="checkbox" 
                            id="data-custom" 
                            className="rounded border-gray-300 text-brand-500 mt-1"
                            checked={formData.dataTypes.includes("custom")}
                            onChange={() => handleCheckboxChange("custom")}
                          />
                          <div>
                            <Label htmlFor="data-custom" className="font-medium">Custom Objects</Label>
                            <p className="text-xs text-muted-foreground">Your custom data objects</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2 pt-4">
                      <Label>Migration Strategy</Label>
                      <RadioGroup 
                        value={formData.migrationStrategy} 
                        onValueChange={(value) => handleRadioChange(value, "migrationStrategy")}
                        className="grid grid-cols-1 gap-4 pt-2"
                      >
                        <div className="border rounded-md p-4">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="full" id="full" />
                            <div>
                              <Label htmlFor="full" className="font-medium">Full Migration</Label>
                              <p className="text-sm text-muted-foreground">Migrate all selected data at once</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="border rounded-md p-4">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="incremental" id="incremental" />
                            <div>
                              <Label htmlFor="incremental" className="font-medium">Incremental Migration</Label>
                              <p className="text-sm text-muted-foreground">Migrate in phases with testing between each phase</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="border rounded-md p-4">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="parallel" id="parallel" />
                            <div>
                              <Label htmlFor="parallel" className="font-medium">Parallel Operation</Label>
                              <p className="text-sm text-muted-foreground">Run both CRMs in parallel with continuous syncing</p>
                            </div>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    {formData.dataTypes.includes("custom") && (
                      <div className="space-y-2 pt-4">
                        <Label htmlFor="customMapping">Custom Object Mapping</Label>
                        <Textarea 
                          id="customMapping"
                          name="customMapping"
                          placeholder="Describe your custom objects and how they should be mapped between systems..."
                          value={formData.customMapping}
                          onChange={handleChange}
                          className="min-h-32"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {currentStep === 4 && (
                <div className="text-center py-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-6">
                    <CheckCircle size={32} />
                  </div>
                  <h3 className="text-2xl font-medium mb-2">Migration Setup Complete!</h3>
                  <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                    Your CRM migration is now configured. Review the details below and start your migration when ready.
                  </p>
                  
                  <SlideUp>
                    <GlassPanel className="p-6 max-w-md mx-auto">
                      <h4 className="font-medium mb-4">Migration Summary</h4>
                      <ul className="space-y-2 text-left">
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Company:</span>
                          <span className="font-medium">{formData.companyName}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Source CRM:</span>
                          <span className="font-medium">
                            {multiCrmEnabled 
                              ? `${selectedSourceCrms.length} CRMs selected` 
                              : sourceCrmOptions.find(c => c.id === formData.sourceCrm)?.name || formData.sourceCrm}
                          </span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Destination CRM:</span>
                          <span className="font-medium">
                            {formData.destinationCrm === "custom" 
                              ? customCrmNames["destination"] || "Custom CRM"
                              : destinationCrmOptions.find(c => c.id === formData.destinationCrm)?.name || formData.destinationCrm}
                          </span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Data Types:</span>
                          <span className="font-medium">{formData.dataTypes.length} selected</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Strategy:</span>
                          <span className="font-medium">{formData.migrationStrategy === "full" ? "Full Migration" : formData.migrationStrategy === "incremental" ? "Incremental Migration" : "Parallel Operation"}</span>
                        </li>
                      </ul>
                    </GlassPanel>
                  </SlideUp>
                  
                  <div className="mt-8">
                    <Button 
                      className="gap-2" 
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          <span>Setting up migration...</span>
                        </>
                      ) : (
                        <>
                          Start Migration <ArrowRight size={16} />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
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
