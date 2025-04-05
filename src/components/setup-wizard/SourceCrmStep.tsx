
import React from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { CrmSystem, SetupFormData } from "@/types/setupWizard";

interface SourceCrmStepProps {
  formData: SetupFormData;
  multiCrmEnabled: boolean;
  setMultiCrmEnabled: (enabled: boolean) => void;
  selectedSourceCrms: string[];
  handleSourceCrmToggle: (crmId: string) => void;
  handleApiKeyChange: (crmId: string, value: string) => void;
  handleCustomCrmNameChange: (crmId: string, value: string) => void;
  customCrmNames: Record<string, string>;
  sourceCrmOptions: CrmSystem[];
}

const SourceCrmStep: React.FC<SourceCrmStepProps> = ({
  formData,
  multiCrmEnabled,
  setMultiCrmEnabled,
  selectedSourceCrms,
  handleSourceCrmToggle,
  handleApiKeyChange,
  handleCustomCrmNameChange,
  customCrmNames,
  sourceCrmOptions
}) => {
  
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
  );
};

export default SourceCrmStep;
