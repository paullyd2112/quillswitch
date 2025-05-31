
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import ProgressCard from "../components/ProgressCard";

interface MapTabProps {
  sourceCrm: string;
  targetCrm: string;
  mappingProgress: number;
  isFieldMappingComplete: boolean;
  onStartFieldMapping: () => void;
  onNext: () => void;
  onBack: () => void;
  isComplete: boolean;
}

const MapTab: React.FC<MapTabProps> = ({
  sourceCrm,
  targetCrm,
  mappingProgress,
  isFieldMappingComplete,
  onStartFieldMapping,
  onNext,
  onBack,
  isComplete
}) => {
  return (
    <div className="space-y-6">
      <ProgressCard
        title="Map Fields"
        description="Simulate field mapping between"
        progress={mappingProgress}
        isComplete={isFieldMappingComplete}
        buttonText="Start Automatic Field Mapping"
        onStart={onStartFieldMapping}
        sourceCrm={sourceCrm}
        targetCrm={targetCrm}
      />
      
      <div className="flex justify-between">
        <Button 
          variant="outline"
          onClick={onBack}
        >
          Back: Select Data
        </Button>
        <Button 
          onClick={onNext}
          disabled={!isComplete}
        >
          Next: Validate <ArrowRight className="ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default MapTab;
