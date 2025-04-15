
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataMappingVisualizer } from '@/components/migration';
import { FieldMapping, MigrationObjectType } from '@/integrations/supabase/migrationTypes';

interface MappingTabContentProps {
  objectType: MigrationObjectType;
  fieldMappings: FieldMapping[];
  onUpdateMapping: (mappingId: string, updates: Partial<FieldMapping>) => void;
}

const MappingTabContent: React.FC<MappingTabContentProps> = ({
  objectType,
  fieldMappings,
  onUpdateMapping
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Field Mapping Configuration</CardTitle>
      </CardHeader>
      <CardContent>
        <DataMappingVisualizer 
          objectType={objectType} 
          fieldMappings={fieldMappings}
          onUpdateMapping={onUpdateMapping}
        />
      </CardContent>
    </Card>
  );
};

export default MappingTabContent;
