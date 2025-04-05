
import React from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { CrmSystem, SetupFormData } from "@/contexts/setup-wizard/types";

interface DestinationCrmStepProps {
  formData: SetupFormData;
  handleRadioChange: (value: string, field: string) => void;
  handleApiKeyChange: (crmId: string, value: string) => void;
  handleCustomCrmNameChange: (crmId: string, value: string) => void;
  customCrmNames: Record<string, string>;
  destinationCrmOptions: CrmSystem[];
  multiDestinationEnabled: boolean;
  setMultiDestinationEnabled: (enabled: boolean) => void;
  selectedDestinationCrms: string[];
  handleDestinationCrmToggle: (crmId: string) => void;
}

const DestinationCrmStep: React.FC<DestinationCrmStepProps> = ({
  formData,
  handleRadioChange,
  handleApiKeyChange,
  handleCustomCrmNameChange,
  customCrmNames,
  destinationCrmOptions,
  multiDestinationEnabled,
  setMultiDestinationEnabled,
  selectedDestinationCrms,
  handleDestinationCrmToggle
}) => {
  
  const renderDestinationCrmOptions = () => {
    const popularOptions = destinationCrmOptions.filter(crm => crm.popular);
    const otherOptions = destinationCrmOptions.filter(crm => !crm.popular);
    
    return (
      <>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
          {popularOptions.map(crm => (
            <div 
              key={crm.id}
              className={`border rounded-md p-3 cursor-pointer transition-colors ${
                multiDestinationEnabled 
                  ? selectedDestinationCrms.includes(crm.id) ? "bg-brand-50 border-brand-200 dark:bg-brand-900/20 dark:border-brand-800" : ""
                  : formData.destinationCrm === crm.id ? "bg-brand-50 border-brand-200 dark:bg-brand-900/20 dark:border-brand-800" : ""
              }`}
              onClick={() => handleDestinationCrmToggle(crm.id)}
            >
              <div className="flex items-start gap-2">
                {multiDestinationEnabled ? (
                  <Checkbox 
                    checked={selectedDestinationCrms.includes(crm.id)} 
                    onCheckedChange={() => handleDestinationCrmToggle(crm.id)}
                    className="mt-1"
                  />
                ) : (
                  <RadioGroup value={formData.destinationCrm} onValueChange={(value) => handleRadioChange(value, "destinationCrm")}>
                    <RadioGroupItem 
                      value={crm.id} 
                      id={`dest-${crm.id}`} 
                      className="mt-1"
                    />
                  </RadioGroup>
                )}
                <div>
                  <Label htmlFor={`dest-${crm.id}`} className="font-medium cursor-pointer">
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
                      multiDestinationEnabled 
                        ? selectedDestinationCrms.includes(crm.id) ? "bg-brand-50 border-brand-200 dark:bg-brand-900/20 dark:border-brand-800" : ""
                        : formData.destinationCrm === crm.id ? "bg-brand-50 border-brand-200 dark:bg-brand-900/20 dark:border-brand-800" : ""
                    }`}
                    onClick={() => handleDestinationCrmToggle(crm.id)}
                  >
                    <div className="flex items-start gap-2">
                      {multiDestinationEnabled ? (
                        <Checkbox 
                          checked={selectedDestinationCrms.includes(crm.id)} 
                          onCheckedChange={() => handleDestinationCrmToggle(crm.id)}
                          className="mt-1"
                        />
                      ) : (
                        <RadioGroup value={formData.destinationCrm} onValueChange={(value) => handleRadioChange(value, "destinationCrm")}>
                          <RadioGroupItem 
                            value={crm.id} 
                            id={`dest-${crm.id}`} 
                            className="mt-1"
                          />
                        </RadioGroup>
                      )}
                      <div>
                        <Label htmlFor={`dest-${crm.id}`} className="font-medium cursor-pointer">
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
    const selectedCrms = multiDestinationEnabled 
      ? selectedDestinationCrms 
      : [formData.destinationCrm];
    
    return (
      <div className="space-y-4 mt-6">
        {selectedCrms.map(crmId => {
          const crmOption = destinationCrmOptions.find(c => c.id === crmId);
          
          if (!crmOption) return null;
          
          return (
            <div key={crmId} className="space-y-2 border p-4 rounded-md">
              <div className="flex justify-between items-center">
                <Label className="font-medium">{crmOption.name} Configuration</Label>
                {multiDestinationEnabled && (
                  <Badge variant="outline">{crmOption.name}</Badge>
                )}
              </div>
              
              {crmId === 'custom' ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`custom-dest-name-${crmId}`}>Custom CRM Name</Label>
                    <Input 
                      id={`custom-dest-name-${crmId}`}
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
                  <Label htmlFor={`api-key-${crmId}`}>{crmOption.apiKeyLabel || `${crmOption.name} API Key`}</Label>
                  <Input 
                    id={`api-key-${crmId}`}
                    placeholder={`Enter your ${crmOption.name} API key`}
                    value={formData.apiKeys[crmId] || ''}
                    onChange={(e) => handleApiKeyChange(crmId, e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    {crmOption.apiKeyHelp || `Your API key can be found in your ${crmOption.name} account settings`}
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
      <h3 className="text-xl font-medium mb-4">Destination CRM Configuration</h3>
      <p className="text-muted-foreground mb-6">
        Configure access to the CRM system(s) you want to migrate to.
      </p>
      
      <div className="space-y-6">
        <div className="flex items-start space-x-2 p-3 bg-muted/40 rounded-md">
          <Checkbox 
            id="multi-destination" 
            checked={multiDestinationEnabled}
            onCheckedChange={(checked) => setMultiDestinationEnabled(checked === true)}
          />
          <div>
            <Label htmlFor="multi-destination" className="font-medium">Do you need to migrate to multiple CRMs?</Label>
            <p className="text-xs text-muted-foreground">Enable this to select and configure multiple destination CRMs</p>
          </div>
        </div>

        <div className="space-y-2">
          <Label>{multiDestinationEnabled ? "Select Destination CRMs" : "Destination CRM Platform"}</Label>
          {renderDestinationCrmOptions()}
        </div>
        
        {renderApiKeyInputs()}
      </div>
    </div>
  );
};

export default DestinationCrmStep;
