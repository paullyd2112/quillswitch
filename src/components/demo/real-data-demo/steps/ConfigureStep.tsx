import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
import { DataTypeOption, AccessInfo } from "../types";

interface ConfigureStepProps {
  dataTypeOptions: DataTypeOption[];
  selectedDataTypes: string[];
  accessInfo: AccessInfo | null;
  onToggleDataType: (dataTypeId: string) => void;
  onBack: () => void;
  onStartDemo: () => void;
}

const ConfigureStep: React.FC<ConfigureStepProps> = ({
  dataTypeOptions,
  selectedDataTypes,
  accessInfo,
  onToggleDataType,
  onBack,
  onStartDemo
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Configure Your Demo</h2>
        <p className="text-muted-foreground">
          Select the types of data you want to extract for the migration demo.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Data Types to Extract</CardTitle>
          <CardDescription>
            We'll extract up to {accessInfo?.recordLimit || 100} total records across all selected types
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dataTypeOptions.map((dataType) => {
              const Icon = dataType.icon;
              const isSelected = selectedDataTypes.includes(dataType.id);
              
              return (
                <Button
                  key={dataType.id}
                  variant={isSelected ? "default" : "outline"}
                  className="h-auto p-4 flex flex-col items-start"
                  onClick={() => onToggleDataType(dataType.id)}
                >
                  <div className="flex items-center w-full mb-2">
                    <Icon className="mr-2 h-5 w-5" />
                    <span className="font-medium">{dataType.name}</span>
                  </div>
                  <span className="text-sm text-muted-foreground text-left">
                    {dataType.description}
                  </span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button 
          onClick={onStartDemo}
          disabled={selectedDataTypes.length === 0}
        >
          <Zap className="mr-2 h-4 w-4" />
          Start Real Data Extraction
        </Button>
      </div>
    </div>
  );
};

export default ConfigureStep;