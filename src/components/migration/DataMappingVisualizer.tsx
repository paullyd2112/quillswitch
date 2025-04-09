
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldMapping, MigrationObjectType } from "@/integrations/supabase/migrationTypes";
import { Badge } from "@/components/ui/badge";
import FieldMappingsTable from "./data-mapping/FieldMappingsTable";
import EmptyMappingState from "./data-mapping/EmptyMappingState";
import MappingPreviewDialog from "./data-mapping/MappingPreviewDialog";

interface DataMappingVisualizerProps {
  objectType: MigrationObjectType;
  fieldMappings: FieldMapping[];
  onUpdateMapping?: (mappingId: string, updates: Partial<FieldMapping>) => void;
}

const DataMappingVisualizer: React.FC<DataMappingVisualizerProps> = ({ 
  objectType, 
  fieldMappings,
  onUpdateMapping 
}) => {
  const handleUpdateMapping = (mappingId: string, updates: Partial<FieldMapping>) => {
    if (onUpdateMapping) {
      onUpdateMapping(mappingId, updates);
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="bg-slate-50 dark:bg-slate-900/50 border-b">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <span className="text-xl">{objectType.name} Field Mapping</span>
            <Badge variant="outline" className="ml-2">
              {fieldMappings.length} Fields
            </Badge>
          </CardTitle>
          <div className="flex items-center gap-2">
            <MappingPreviewDialog objectType={objectType} fieldMappings={fieldMappings} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {fieldMappings.length > 0 ? (
          <FieldMappingsTable 
            fieldMappings={fieldMappings} 
            onUpdateMapping={handleUpdateMapping} 
          />
        ) : (
          <EmptyMappingState />
        )}
      </CardContent>
    </Card>
  );
};

export default DataMappingVisualizer;
