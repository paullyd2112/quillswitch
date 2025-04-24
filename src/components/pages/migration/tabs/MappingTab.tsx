
import React from 'react';
import { useMigration } from '../MigrationContext';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DataMappingVisualizer from '@/components/migration/DataMappingVisualizer';
import FieldMappingsTable from '@/components/migration/data-mapping/FieldMappingsTable';
import CrmArchitectureDiagram from '@/components/migration/CrmArchitectureDiagram';
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
    <div className="space-y-6">
      <Tabs defaultValue="mapping">
        <TabsList className="mb-4">
          <TabsTrigger value="mapping">Field Mapping</TabsTrigger>
          <TabsTrigger value="architecture">Architecture View</TabsTrigger>
        </TabsList>
        
        <TabsContent value="mapping">
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
        </TabsContent>
        
        <TabsContent value="architecture">
          <CrmArchitectureDiagram 
            sourceCrm="Salesforce"
            destinationCrm="HubSpot"
            connectedTools={[
              { name: "Mailchimp", category: "marketing" },
              { name: "Zendesk", category: "support" },
              { name: "Tableau", category: "analytics" }
            ]}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
