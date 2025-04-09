
import React from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody } from "@/components/ui/table";
import { FieldMapping, MigrationObjectType } from "@/integrations/supabase/migrationTypes";
import FieldMappingRow from "./FieldMappingRow";

interface FieldMappingsTableProps {
  fieldMappings: FieldMapping[];
  onUpdateMapping: (mappingId: string, updates: Partial<FieldMapping>) => void;
}

const FieldMappingsTable: React.FC<FieldMappingsTableProps> = ({ 
  fieldMappings,
  onUpdateMapping
}) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader className="bg-slate-50/50 dark:bg-slate-900/20">
          <TableRow>
            <TableHead>Source Field</TableHead>
            <TableHead className="w-1/12 text-center"></TableHead>
            <TableHead>Destination Field</TableHead>
            <TableHead>Data Type</TableHead>
            <TableHead>Transformation</TableHead>
            <TableHead className="text-center">Required</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {fieldMappings.map((mapping) => (
            <FieldMappingRow 
              key={mapping.id} 
              mapping={mapping} 
              onUpdateMapping={onUpdateMapping} 
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default FieldMappingsTable;
