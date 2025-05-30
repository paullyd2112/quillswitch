
import React from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { SetupFormData, CrmSystem } from "@/types/setupWizard";

interface DataTypesStepProps {
  formData: SetupFormData;
  handleCheckboxChange: (value: string) => void;
  handleCrmDataSelectionChange: (crmId: string, dataTypes: string[]) => void;
  showPerCrmDataSelection: boolean;
  selectedSourceCrms: string[];
  sourceCrmOptions: CrmSystem[];
}

const DataTypesStep: React.FC<DataTypesStepProps> = ({
  formData,
  handleCheckboxChange,
  handleCrmDataSelectionChange,
  showPerCrmDataSelection,
  selectedSourceCrms,
  sourceCrmOptions
}) => {
  const dataTypeOptions = [
    { id: "contacts", label: "Contacts & Leads", description: "All contact and lead information" },
    { id: "accounts", label: "Accounts & Companies", description: "Organization information" },
    { id: "opportunities", label: "Opportunities & Deals", description: "Sales pipeline and deals" },
    { id: "cases", label: "Cases & Tickets", description: "Support cases and tickets" },
    { id: "activities", label: "Activities & Tasks", description: "Call logs, emails, and tasks" },
    { id: "custom", label: "Custom Objects", description: "Your custom data objects" }
  ];

  return (
    <div>
      <h3 className="text-xl font-medium mb-4">Data Types Selection</h3>
      <p className="text-muted-foreground mb-6">
        Choose which data types you want to migrate from your current CRM to your new one.
      </p>
      
      <div className="space-y-6">
        {!showPerCrmDataSelection ? (
          <div className="space-y-3">
            <Label>Data Types to Migrate</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {dataTypeOptions.map((dataType) => (
                <div key={dataType.id} className="flex items-start space-x-2">
                  <Checkbox
                    id={`data-${dataType.id}`}
                    checked={formData.dataTypes.includes(dataType.id)}
                    onCheckedChange={() => handleCheckboxChange(dataType.id)}
                    className="mt-1"
                  />
                  <div>
                    <Label htmlFor={`data-${dataType.id}`} className="font-medium cursor-pointer">
                      {dataType.label}
                    </Label>
                    <p className="text-xs text-muted-foreground">{dataType.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <Label>Select Data Types for Each CRM</Label>
            {selectedSourceCrms.map((crmId) => {
              const crm = sourceCrmOptions.find(c => c.id === crmId);
              const crmSelection = formData.crmDataSelections.find(s => s.crmId === crmId);
              const selectedDataTypes = crmSelection?.dataTypes || [];
              
              return (
                <div key={crmId} className="border rounded-md p-4">
                  <h4 className="font-medium mb-3">{crm?.name || crmId}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {dataTypeOptions.map((dataType) => (
                      <div key={dataType.id} className="flex items-start space-x-2">
                        <Checkbox
                          id={`${crmId}-${dataType.id}`}
                          checked={selectedDataTypes.includes(dataType.id)}
                          onCheckedChange={(checked) => {
                            const newDataTypes = checked
                              ? [...selectedDataTypes, dataType.id]
                              : selectedDataTypes.filter(dt => dt !== dataType.id);
                            handleCrmDataSelectionChange(crmId, newDataTypes);
                          }}
                          className="mt-1"
                        />
                        <div>
                          <Label htmlFor={`${crmId}-${dataType.id}`} className="font-medium cursor-pointer">
                            {dataType.label}
                          </Label>
                          <p className="text-xs text-muted-foreground">{dataType.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DataTypesStep;
