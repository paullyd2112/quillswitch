
import React from 'react';
import { useMigration } from '../MigrationContext';
import { Card, CardContent } from '@/components/ui/card';
import DataMappingVisualizer from '@/components/migration/DataMappingVisualizer';
import FieldMappingsTable from '@/components/migration/data-mapping/FieldMappingsTable';
import { FieldMapping } from '@/integrations/supabase/migrationTypes';

export const MappingTab = () => {
  const { objectType, fieldMappings, setFieldMappings } = useMigration();

  const handleUpdateMapping = (mappingId: string, updates: Partial<FieldMapping>) => {
    // Create a new array with the updated mapping
    const updatedMappings = fieldMappings.map(mapping => 
      mapping.id === mappingId ? { ...mapping, ...updates } : mapping
    );
    
    // Set the new array directly
    setFieldMappings(updatedMappings);
  };

  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        <DataMappingVisualizer 
          objectType={objectType} 
          fieldMappings={fieldMappings}
          onUpdateMapping={handleUpdateMapping}
        />
        <FieldMappingsTable
          fieldMappings={fieldMappings}
          onUpdateMapping={handleUpdateMapping}
        />
      </CardContent>
    </Card>
  );
};
