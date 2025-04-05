
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { CrmSystem, SetupFormData } from "@/types/setupWizard";

interface DestinationCrmStepProps {
  formData: SetupFormData;
  handleRadioChange: (value: string, field: string) => void;
  handleApiKeyChange: (crmId: string, value: string) => void;
  handleCustomCrmNameChange: (crmId: string, value: string) => void;
  customCrmNames: Record<string, string>;
  destinationCrmOptions: CrmSystem[];
}

const DestinationCrmStep: React.FC<DestinationCrmStepProps> = ({
  formData,
  handleRadioChange,
  handleApiKeyChange,
  handleCustomCrmNameChange,
  customCrmNames,
  destinationCrmOptions
}) => {
  return (
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
  );
};

export default DestinationCrmStep;
