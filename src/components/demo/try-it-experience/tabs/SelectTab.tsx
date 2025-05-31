
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { DataType } from "../types";

interface SelectTabProps {
  dataTypes: DataType[];
  selectedDataTypes: string[];
  sourceCrm: string;
  targetCrm: string;
  onToggleDataType: (id: string) => void;
  onNext: () => void;
  onBack: () => void;
  isComplete: boolean;
}

const SelectTab: React.FC<SelectTabProps> = ({
  dataTypes,
  selectedDataTypes,
  sourceCrm,
  targetCrm,
  onToggleDataType,
  onNext,
  onBack,
  isComplete
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-slate-100 dark:bg-slate-800/50 rounded-lg p-6">
        <h3 className="text-lg font-medium mb-4">Select Data Types to Migrate</h3>
        
        <p className="text-muted-foreground mb-4">
          Choose the types of data you want to migrate from {sourceCrm} to {targetCrm}.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dataTypes.map(dataType => (
            <div
              key={dataType.id}
              className={`p-3 rounded-md cursor-pointer transition-colors ${
                selectedDataTypes.includes(dataType.id)
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-slate-100 dark:hover:bg-slate-800/80"
              }`}
              onClick={() => onToggleDataType(dataType.id)}
            >
              <div className="flex items-center justify-between">
                <div className="font-medium">{dataType.name}</div>
                <div className="text-sm text-muted-foreground">{dataType.count.toLocaleString()}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-between">
        <Button 
          variant="outline"
          onClick={onBack}
        >
          Back: Connect CRMs
        </Button>
        <Button 
          onClick={onNext}
          disabled={!isComplete}
        >
          Next: Map Fields <ArrowRight className="ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default SelectTab;
