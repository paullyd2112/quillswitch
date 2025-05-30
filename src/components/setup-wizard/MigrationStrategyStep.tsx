
import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SetupFormData } from "@/contexts/setup-wizard/types";

interface MigrationStrategyStepProps {
  formData: SetupFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleRadioChange: (value: string, field: string) => void;
}

const MigrationStrategyStep: React.FC<MigrationStrategyStepProps> = ({
  formData,
  handleChange,
  handleRadioChange
}) => {
  return (
    <div>
      <h3 className="text-xl font-medium mb-4">Migration Strategy</h3>
      <p className="text-muted-foreground mb-6">
        Choose how you want to approach your CRM migration based on your business needs.
      </p>
      
      <div className="space-y-6">
        <div className="space-y-2">
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

export default MigrationStrategyStep;
