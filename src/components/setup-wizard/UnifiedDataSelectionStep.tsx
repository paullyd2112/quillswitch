
import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { SetupFormData, CrmSystem } from "@/contexts/setup-wizard/types";
import { DATA_TYPE_OPTIONS, DATA_TYPE_CATEGORIES } from "@/config/dataTypes";
import RecordEstimator from "./RecordEstimator";

interface UnifiedDataSelectionStepProps {
  formData: SetupFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleCheckboxChange: (value: string) => void;
  handleCrmDataSelectionChange: (crmId: string, dataTypes: string[]) => void;
  handlePerCrmCustomMappingChange: (crmId: string, customMapping: string) => void;
  handleRadioChange: (value: string, field: string) => void;
  showPerCrmDataSelection: boolean;
  selectedSourceCrms: string[];
  sourceCrmOptions: CrmSystem[];
  customCrmNames: Record<string, string>;
}

const UnifiedDataSelectionStep: React.FC<UnifiedDataSelectionStepProps> = ({
  formData,
  handleChange,
  handleCheckboxChange,
  handleCrmDataSelectionChange,
  handlePerCrmCustomMappingChange,
  handleRadioChange,
  showPerCrmDataSelection,
  selectedSourceCrms,
  sourceCrmOptions,
  customCrmNames
}) => {
  const getCrmDataSelection = (crmId: string): string[] => {
    const selection = formData.crmDataSelections.find(selection => selection.crmId === crmId);
    return selection ? selection.dataTypes : [];
  };

  const getCrmCustomMapping = (crmId: string): string => {
    const selection = formData.crmDataSelections.find(selection => selection.crmId === crmId);
    return selection?.customMapping || "";
  };

  const handleDataTypeToggle = (crmId: string | null, dataTypeId: string) => {
    if (showPerCrmDataSelection && crmId) {
      // Per-CRM selection
      const currentSelection = getCrmDataSelection(crmId);
      const updatedSelection = currentSelection.includes(dataTypeId)
        ? currentSelection.filter(item => item !== dataTypeId)
        : [...currentSelection, dataTypeId];
      
      handleCrmDataSelectionChange(crmId, updatedSelection);
    } else {
      // Global selection
      handleCheckboxChange(dataTypeId);
    }
  };

  const renderDataTypeCheckboxes = (crmId: string | null = null) => {
    const selectedDataTypes = crmId ? getCrmDataSelection(crmId) : formData.dataTypes;
    
    return (
      <div className="space-y-4">
        {Object.entries(DATA_TYPE_CATEGORIES).map(([category, categoryName]) => {
          const categoryOptions = DATA_TYPE_OPTIONS.filter(option => option.category === category);
          
          return (
            <div key={category}>
              <h5 className="font-medium text-sm text-muted-foreground mb-3">{categoryName}</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                {categoryOptions.map((dataType) => (
                  <div key={dataType.id} className="flex items-start space-x-2">
                    <Checkbox
                      id={`${crmId || 'global'}-${dataType.id}`}
                      checked={selectedDataTypes.includes(dataType.id)}
                      onCheckedChange={() => handleDataTypeToggle(crmId, dataType.id)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <Label htmlFor={`${crmId || 'global'}-${dataType.id}`} className="font-medium cursor-pointer">
                        {dataType.name}
                      </Label>
                      <p className="text-xs text-muted-foreground">{dataType.description}</p>
                      {dataType.estimatedSize && (
                        <Badge variant="outline" className="text-xs mt-1">
                          {dataType.estimatedSize} dataset
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const hasCustomDataTypes = showPerCrmDataSelection
    ? formData.crmDataSelections.some(selection => selection.dataTypes.includes("custom"))
    : formData.dataTypes.includes("custom");

  // Get all selected data types across all CRMs for record estimation
  const allSelectedDataTypes = showPerCrmDataSelection
    ? formData.crmDataSelections.reduce((acc: string[], selection) => {
        selection.dataTypes.forEach(dataType => {
          if (!acc.includes(dataType)) {
            acc.push(dataType);
          }
        });
        return acc;
      }, [])
    : formData.dataTypes;

  return (
    <div>
      <h3 className="text-xl font-medium mb-4">Data Selection</h3>
      <p className="text-muted-foreground mb-6">
        Choose which data types you want to migrate from your current CRM to your new one.
      </p>
      
      <div className="space-y-6">
        {!showPerCrmDataSelection ? (
          // Single CRM data selection
          <div>
            <Label className="text-base font-medium">Data Types to Migrate</Label>
            <div className="mt-4">
              {renderDataTypeCheckboxes()}
            </div>
          </div>
        ) : (
          // Per-CRM data selection
          <div className="space-y-6">
            <Label className="text-base font-medium">Select Data Types for Each CRM</Label>
            {selectedSourceCrms.map(crmId => {
              const crmSystem = sourceCrmOptions.find(crm => crm.id === crmId);
              if (!crmSystem) return null;
              
              const crmDataTypes = getCrmDataSelection(crmId);
              const crmCustomMapping = getCrmCustomMapping(crmId);
              
              return (
                <Card key={crmId} className="border rounded-md">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      {crmSystem.name}
                      <Badge variant="outline">
                        {crmId === 'custom' ? customCrmNames[crmId] || 'Custom' : crmId}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {renderDataTypeCheckboxes(crmId)}
                    
                    {crmDataTypes.includes("custom") && (
                      <div className="mt-6 pt-4 border-t">
                        <Label htmlFor={`customMapping-${crmId}`} className="text-sm font-medium">
                          Custom Object Mapping for {crmSystem.name}
                        </Label>
                        <Textarea 
                          id={`customMapping-${crmId}`}
                          placeholder={`Describe your custom objects from ${crmSystem.name} and how they should be mapped...`}
                          value={crmCustomMapping}
                          onChange={(e) => handlePerCrmCustomMappingChange(crmId, e.target.value)}
                          className="min-h-20 mt-2"
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Record Estimator */}
        {allSelectedDataTypes.length > 0 && (
          <div className="mt-6">
            <Separator className="mb-6" />
            <RecordEstimator 
              selectedDataTypes={allSelectedDataTypes}
              className="mt-6"
            />
          </div>
        )}
        
        {/* Migration Strategy */}
        <div className="mt-6">
          <Separator className="mb-6" />
          <div className="space-y-4">
            <Label className="text-base font-medium">Migration Strategy</Label>
            <RadioGroup 
              value={formData.migrationStrategy} 
              onValueChange={(value) => handleRadioChange(value, "migrationStrategy")}
              className="grid grid-cols-1 gap-4"
            >
              <div className="border rounded-md p-4">
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="full" id="full" />
                  <div>
                    <Label htmlFor="full" className="font-medium cursor-pointer">Full Migration</Label>
                    <p className="text-sm text-muted-foreground">Migrate all selected data at once</p>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-md p-4">
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="incremental" id="incremental" />
                  <div>
                    <Label htmlFor="incremental" className="font-medium cursor-pointer">Incremental Migration</Label>
                    <p className="text-sm text-muted-foreground">Migrate in phases with testing between each phase</p>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-md p-4">
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="parallel" id="parallel" />
                  <div>
                    <Label htmlFor="parallel" className="font-medium cursor-pointer">Parallel Operation</Label>
                    <p className="text-sm text-muted-foreground">Run both CRMs in parallel with continuous syncing</p>
                  </div>
                </div>
              </div>
            </RadioGroup>
          </div>
        </div>
        
        {/* Global Custom Mapping (for single CRM mode) */}
        {!showPerCrmDataSelection && hasCustomDataTypes && (
          <div className="mt-6">
            <Separator className="mb-6" />
            <div className="space-y-2">
              <Label htmlFor="customMapping" className="text-base font-medium">Custom Object Mapping</Label>
              <Textarea 
                id="customMapping"
                name="customMapping"
                placeholder="Describe your custom objects and how they should be mapped between systems..."
                value={formData.customMapping}
                onChange={handleChange}
                className="min-h-32"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UnifiedDataSelectionStep;
