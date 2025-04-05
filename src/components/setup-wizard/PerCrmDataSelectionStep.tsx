
import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CrmSystem, SetupFormData, CrmDataSelection } from "@/types/setupWizard";

interface PerCrmDataSelectionStepProps {
  formData: SetupFormData;
  handleCrmDataSelectionChange: (crmId: string, dataTypes: string[]) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleRadioChange: (value: string, field: string) => void;
  selectedSourceCrms: string[];
  sourceCrmOptions: CrmSystem[];
}

const PerCrmDataSelectionStep: React.FC<PerCrmDataSelectionStepProps> = ({
  formData,
  handleCrmDataSelectionChange,
  handleChange,
  handleRadioChange,
  selectedSourceCrms,
  sourceCrmOptions
}) => {
  const dataTypeOptions = [
    { id: "contacts", name: "Contacts & Leads", description: "All contact and lead information" },
    { id: "accounts", name: "Accounts & Companies", description: "Organization information" },
    { id: "opportunities", name: "Opportunities & Deals", description: "Sales pipeline and deals" },
    { id: "cases", name: "Cases & Tickets", description: "Support cases and tickets" },
    { id: "activities", name: "Activities & Tasks", description: "Call logs, emails, and tasks" },
    { id: "custom", name: "Custom Objects", description: "Your custom data objects" }
  ];

  const getCrmDataSelection = (crmId: string): string[] => {
    const selection = formData.crmDataSelections.find(selection => selection.crmId === crmId);
    return selection ? selection.dataTypes : [];
  };

  const handleCheckboxChange = (crmId: string, dataTypeId: string) => {
    const currentSelection = getCrmDataSelection(crmId);
    const updatedSelection = currentSelection.includes(dataTypeId)
      ? currentSelection.filter(item => item !== dataTypeId)
      : [...currentSelection, dataTypeId];
    
    handleCrmDataSelectionChange(crmId, updatedSelection);
  };

  return (
    <div>
      <h3 className="text-xl font-medium mb-4">Data Selection Per CRM</h3>
      <p className="text-muted-foreground mb-6">
        Choose which data types you want to migrate from each of your CRM systems.
      </p>
      
      <div className="space-y-6">
        {selectedSourceCrms.map(crmId => {
          const crmSystem = sourceCrmOptions.find(crm => crm.id === crmId);
          if (!crmSystem) return null;
          
          const crmDataTypes = getCrmDataSelection(crmId);
          
          return (
            <Card key={crmId} className="border rounded-md">
              <div className="p-4 bg-muted/20 border-b flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">{crmSystem.name}</h4>
                  <Badge variant="outline">{crmId === 'custom' ? customCrmNames?.[crmId] || 'Custom' : crmId}</Badge>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  {dataTypeOptions.map(dataType => (
                    <div key={`${crmId}-${dataType.id}`} className="flex items-start space-x-2">
                      <input 
                        type="checkbox" 
                        id={`data-${crmId}-${dataType.id}`} 
                        className="rounded border-gray-300 text-brand-500 mt-1"
                        checked={crmDataTypes.includes(dataType.id)}
                        onChange={() => handleCheckboxChange(crmId, dataType.id)}
                      />
                      <div>
                        <Label htmlFor={`data-${crmId}-${dataType.id}`} className="font-medium">
                          {dataType.name}
                        </Label>
                        <p className="text-xs text-muted-foreground">{dataType.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                {crmDataTypes.includes("custom") && (
                  <div className="space-y-2 pt-4 border-t">
                    <Label htmlFor={`customMapping-${crmId}`}>Custom Object Mapping for {crmSystem.name}</Label>
                    <Textarea 
                      id={`customMapping-${crmId}`}
                      name={`customMapping-${crmId}`}
                      placeholder={`Describe your custom objects from ${crmSystem.name} and how they should be mapped...`}
                      value={formData.customMapping}
                      onChange={handleChange}
                      className="min-h-20"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
        
        <div className="space-y-2 pt-4 border-t">
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
      </div>
    </div>
  );
};

export default PerCrmDataSelectionStep;
