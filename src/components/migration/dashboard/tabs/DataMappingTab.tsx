
import React from "react";
import FadeIn from "@/components/animations/FadeIn";
import GlassPanel from "@/components/ui-elements/GlassPanel";
import { Button } from "@/components/ui/button";
import { Database } from "lucide-react";
import { useDashboard } from "../DashboardContext";
import DataMappingVisualizer from "../../DataMappingVisualizer";

const DataMappingTab: React.FC = () => {
  const { objectTypes, selectedObjectTypeId, fieldMappings, handleObjectTypeSelect } = useDashboard();
  
  const selectedObjectType = objectTypes.find(obj => obj.id === selectedObjectTypeId);

  return (
    <FadeIn>
      <GlassPanel className="mb-6">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Data Mapping Configuration</h2>
          <p className="text-muted-foreground mb-6">
            Review and configure how data fields are mapped between your source and destination CRMs.
          </p>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Select Object Type</label>
              <div className="flex flex-wrap gap-2">
                {objectTypes.map((objectType) => (
                  <Button
                    key={objectType.id}
                    variant={selectedObjectTypeId === objectType.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleObjectTypeSelect(objectType.id)}
                  >
                    <Database className="h-4 w-4 mr-2" />
                    {objectType.name}
                  </Button>
                ))}
              </div>
            </div>
            
            {selectedObjectType && (
              <DataMappingVisualizer 
                objectType={selectedObjectType} 
                fieldMappings={fieldMappings} 
              />
            )}
          </div>
        </div>
      </GlassPanel>
    </FadeIn>
  );
};

export default DataMappingTab;
