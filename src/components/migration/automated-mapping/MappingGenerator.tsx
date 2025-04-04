
import React from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Wand2 } from "lucide-react";

interface MappingGeneratorProps {
  isLoading: boolean;
  onGenerate: () => void;
}

const MappingGenerator: React.FC<MappingGeneratorProps> = ({ isLoading, onGenerate }) => {
  return (
    <div className="text-center py-6">
      <Wand2 className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
      <h3 className="text-lg font-medium mb-2">Generate Mapping Suggestions</h3>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        Our system can analyze your source and destination fields to suggest the most likely mappings based on field names and common patterns.
      </p>
      <Button 
        onClick={onGenerate} 
        disabled={isLoading}
        className="gap-2"
      >
        {isLoading ? "Generating..." : "Generate Suggestions"} 
        {!isLoading && <Wand2 className="h-4 w-4" />}
      </Button>
      {isLoading && (
        <div className="mt-6">
          <Progress value={45} className="mb-2" />
          <p className="text-sm text-muted-foreground">Analyzing field patterns...</p>
        </div>
      )}
    </div>
  );
};

export default MappingGenerator;
