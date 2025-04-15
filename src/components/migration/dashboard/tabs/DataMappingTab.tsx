
import React, { useState } from "react";
import FadeIn from "@/components/animations/FadeIn";
import GlassPanel from "@/components/ui-elements/GlassPanel";
import { Button } from "@/components/ui/button";
import { Database, Filter, Settings, Plus } from "lucide-react";
import { useDashboard } from "../context";
import DataMappingVisualizer from "../../DataMappingVisualizer";
import { AutomatedMappingPanel } from "../../automated-mapping";
import { FieldMapping } from "@/integrations/supabase/migrationTypes";
import { toast } from "sonner";
import { updateFieldMapping } from "@/services/migration/fieldMappingService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UnmappedFieldsPanel from "../../data-mapping/UnmappedFieldsPanel";

const DataMappingTab: React.FC = () => {
  const { 
    objectTypes, 
    selectedObjectTypeId, 
    fieldMappings, 
    projectId,
    handleObjectTypeSelect,
    refreshFieldMappings,
    isProcessing
  } = useDashboard();
  
  const [activeTab, setActiveTab] = useState("mapped");
  const [isUpdating, setIsUpdating] = useState(false);
  
  const selectedObjectType = objectTypes.find(obj => obj.id === selectedObjectTypeId);

  const handleUpdateMapping = async (mappingId: string, updates: Partial<FieldMapping>) => {
    setIsUpdating(true);
    try {
      await updateFieldMapping(mappingId, updates);
      toast.success("Field mapping updated successfully");
      refreshFieldMappings();
    } catch (error) {
      console.error("Error updating field mapping:", error);
      toast.error("Failed to update field mapping");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <FadeIn>
      <div className="space-y-6">
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
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-1" />
                      Filter Fields
                    </Button>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-1" />
                      Advanced Options
                    </Button>
                  </div>
                  
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Create Custom Mapping
                  </Button>
                </div>
              )}
            </div>
          </div>
        </GlassPanel>
        
        {selectedObjectType && (
          <div className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="flex justify-between items-center mb-4">
                <TabsList>
                  <TabsTrigger value="mapped">
                    Mapped Fields ({fieldMappings.length})
                  </TabsTrigger>
                  <TabsTrigger value="unmapped">
                    Unmapped Fields
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="mapped" className="mt-0">
                <DataMappingVisualizer 
                  objectType={selectedObjectType} 
                  fieldMappings={fieldMappings}
                  onUpdateMapping={handleUpdateMapping}
                />
              </TabsContent>
              
              <TabsContent value="unmapped" className="mt-0">
                <UnmappedFieldsPanel 
                  objectType={selectedObjectType}
                  mappedFields={fieldMappings}
                  onMappingsCreated={refreshFieldMappings}
                />
              </TabsContent>
            </Tabs>
            
            <AutomatedMappingPanel
              objectTypeId={selectedObjectTypeId}
              projectId={projectId}
              sourceFields={[]}  // These would come from your API in a real implementation
              destinationFields={[]}  // These would come from your API in a real implementation
              onMappingsApplied={refreshFieldMappings}
              isProcessing={isProcessing}
            />
          </div>
        )}
      </div>
    </FadeIn>
  );
};

export default DataMappingTab;
