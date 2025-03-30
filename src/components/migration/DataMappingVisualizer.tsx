
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { FieldMapping, MigrationObjectType } from "@/integrations/supabase/migrationTypes";
import { ArrowRight, Check, X } from "lucide-react";

interface DataMappingVisualizerProps {
  objectType: MigrationObjectType;
  fieldMappings: FieldMapping[];
}

const DataMappingVisualizer: React.FC<DataMappingVisualizerProps> = ({ objectType, fieldMappings }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{objectType.name} Field Mapping</CardTitle>
          <div className="text-xs font-medium text-muted-foreground">
            {fieldMappings.length} Mapped Fields
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {fieldMappings.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Source Field</TableHead>
                  <TableHead className="w-1/12 text-center"></TableHead>
                  <TableHead>Destination Field</TableHead>
                  <TableHead>Transformation</TableHead>
                  <TableHead className="text-center">Required</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fieldMappings.map((mapping) => (
                  <TableRow key={mapping.id}>
                    <TableCell className="font-medium">{mapping.source_field}</TableCell>
                    <TableCell className="text-center">
                      <ArrowRight className="h-4 w-4 mx-auto text-muted-foreground" />
                    </TableCell>
                    <TableCell>{mapping.destination_field}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {mapping.transformation_rule || <span className="text-muted-foreground text-sm">None</span>}
                    </TableCell>
                    <TableCell className="text-center">
                      {mapping.is_required ? (
                        <Check className="h-4 w-4 mx-auto text-green-500" />
                      ) : (
                        <X className="h-4 w-4 mx-auto text-muted-foreground" />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="py-6 text-center">
            <p className="text-muted-foreground">No field mappings configured</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DataMappingVisualizer;
