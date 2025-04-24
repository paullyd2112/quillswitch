
import React, { useState } from 'react';
import { useMigration } from '../MigrationContext';
import FadeIn from "@/components/animations/FadeIn";
import GlassPanel from "@/components/ui-elements/GlassPanel";
import { Button } from "@/components/ui/button";
import { Database, Filter, Settings, Plus } from "lucide-react";
import DataMappingVisualizer from "../../DataMappingVisualizer";
import { AutomatedMappingPanel } from "../../automated-mapping";
import { FieldMapping } from "@/integrations/supabase/migrationTypes";
import { toast } from "sonner";
import { updateFieldMapping } from "@/services/migration/fieldMappingService";

export const MappingTab = () => {
  const { objectType, fieldMappings, setFieldMappings, projectId, isProcessing } = useMigration();
  const [isUpdating, setIsUpdating] = useState(false);
  
  const handleUpdateMapping = async (mappingId: string, updates: Partial<FieldMapping>) => {
    setIsUpdating(true);
    try {
      await updateFieldMapping(mappingId, updates);
      toast.success("Field mapping updated successfully");
      
      // Update local state
      const updatedMappings = fieldMappings.map(mapping => 
        mapping.id === mappingId ? { ...mapping, ...updates } : mapping
      );
      setFieldMappings(updatedMappings);
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
            </div>
          </div>
        </GlassPanel>
        
        <div className="space-y-6">
          <DataMappingVisualizer 
            objectType={objectType} 
            fieldMappings={fieldMappings}
            onUpdateMapping={handleUpdateMapping}
          />
          
          <AutomatedMappingPanel
            objectTypeId={objectType.id}
            projectId={projectId}
            sourceFields={[]}  // These would come from your API
            destinationFields={[]}  // These would come from your API
            onMappingsApplied={() => {
              // Implement mapping application logic
              toast.success("Field mappings have been applied");
            }}
            isProcessing={isProcessing}
          />
        </div>
      </div>
    </FadeIn>
  );
};
