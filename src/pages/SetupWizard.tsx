
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
  Settings
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
import { useToast } from "@/hooks/use-toast";
import { createDefaultMigrationProject } from "@/services/migrationService";

interface WizardStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const SetupWizard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    sourceCrm: "salesforce",
    destinationCrm: "hubspot",
    salesforceApiKey: "",
    hubspotApiKey: "",
    dataTypes: [] as string[],
    customMapping: "",
    migrationStrategy: "full",
  });
  
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
      // Create a migration project in Supabase and initialize tracking
      const project = await createDefaultMigrationProject(formData);
      
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
        if (formData.sourceCrm === "salesforce") {
          return formData.salesforceApiKey.trim() !== "";
        }
        return true;
      case 2: // Destination CRM
        if (formData.destinationCrm === "hubspot") {
          return formData.hubspotApiKey.trim() !== "";
        }
        return true;
      case 3: // Data Selection
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
                    <div className="space-y-2">
                      <Label>Source CRM Platform</Label>
                      <RadioGroup 
                        value={formData.sourceCrm} 
                        onValueChange={(value) => handleRadioChange(value, "sourceCrm")}
                        className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="salesforce" id="salesforce" />
                          <Label htmlFor="salesforce">Salesforce</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="dynamics" id="dynamics" />
                          <Label htmlFor="dynamics">Microsoft Dynamics</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="zoho" id="zoho" />
                          <Label htmlFor="zoho">Zoho CRM</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    {formData.sourceCrm === "salesforce" && (
                      <div className="space-y-2">
                        <Label htmlFor="salesforceApiKey">Salesforce API Key</Label>
                        <Input 
                          id="salesforceApiKey"
                          name="salesforceApiKey"
                          placeholder="Enter your Salesforce API key"
                          value={formData.salesforceApiKey}
                          onChange={handleChange}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Your API key can be found in Salesforce Setup &gt; Apps &gt; App Manager &gt; Your Connected App &gt; Manage Consumer Details
                        </p>
                      </div>
                    )}
                    
                    {formData.sourceCrm === "dynamics" && (
                      <div className="p-4 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 rounded-md">
                        Microsoft Dynamics integration guides will be provided after setup.
                      </div>
                    )}
                    
                    {formData.sourceCrm === "zoho" && (
                      <div className="p-4 bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400 rounded-md">
                        Zoho CRM integration guides will be provided after setup.
                      </div>
                    )}
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
                      <RadioGroup 
                        value={formData.destinationCrm} 
                        onValueChange={(value) => handleRadioChange(value, "destinationCrm")}
                        className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="hubspot" id="hubspot" />
                          <Label htmlFor="hubspot">HubSpot</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="pipedrive" id="pipedrive" />
                          <Label htmlFor="pipedrive">Pipedrive</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="monday" id="monday" />
                          <Label htmlFor="monday">Monday Sales CRM</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    {formData.destinationCrm === "hubspot" && (
                      <div className="space-y-2">
                        <Label htmlFor="hubspotApiKey">HubSpot API Key</Label>
                        <Input 
                          id="hubspotApiKey"
                          name="hubspotApiKey"
                          placeholder="Enter your HubSpot API key"
                          value={formData.hubspotApiKey}
                          onChange={handleChange}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Your API key can be found in HubSpot &gt; Settings &gt; Integrations &gt; API Keys
                        </p>
                      </div>
                    )}
                    
                    {formData.destinationCrm === "pipedrive" && (
                      <div className="p-4 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 rounded-md">
                        Pipedrive integration guides will be provided after setup.
                      </div>
                    )}
                    
                    {formData.destinationCrm === "monday" && (
                      <div className="p-4 bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400 rounded-md">
                        Monday Sales CRM integration guides will be provided after setup.
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
                          <span className="font-medium">{formData.sourceCrm === "salesforce" ? "Salesforce" : formData.sourceCrm === "dynamics" ? "Microsoft Dynamics" : "Zoho CRM"}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Destination CRM:</span>
                          <span className="font-medium">{formData.destinationCrm === "hubspot" ? "HubSpot" : formData.destinationCrm === "pipedrive" ? "Pipedrive" : "Monday Sales CRM"}</span>
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
