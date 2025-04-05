
import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SetupFormData } from "@/types/setupWizard";

interface DataSelectionStepProps {
  formData: SetupFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleCheckboxChange: (value: string) => void;
  handleRadioChange: (value: string, field: string) => void;
}

const DataSelectionStep: React.FC<DataSelectionStepProps> = ({
  formData,
  handleChange,
  handleCheckboxChange,
  handleRadioChange
}) => {
  return (
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
  );
};

export default DataSelectionStep;
