
import React, { useState } from 'react';
import { Container } from '@/components/ui/container';
import { PageHeader } from '@/components/ui/page-header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  MultiSourceSelection,
  DataMappingVisualizer, 
  FieldMappingsTable,
  AutomatedMappingPanel
} from '@/components/migration';
import { CrmSource } from '@/components/migration/MultiSourceSelection';
import { FieldMapping, MigrationObjectType } from '@/integrations/supabase/migrationTypes';

const MigrationPage: React.FC = () => {
  // Sample data for MultiSourceSelection
  const [sources, setSources] = useState<CrmSource[]>([
    {
      id: '1',
      name: 'Salesforce',
      type: 'salesforce',
      recordCounts: {
        contacts: 5000,
        accounts: 1200,
        opportunities: 800,
        customObjects: 300
      },
      complexity: 'medium',
      selected: true
    },
    {
      id: '2',
      name: 'HubSpot',
      type: 'hubspot',
      recordCounts: {
        contacts: 3000,
        accounts: 800,
        opportunities: 500,
        customObjects: 100
      },
      complexity: 'simple',
      selected: false
    }
  ]);

  // Sample data for DataMappingVisualizer
  const objectType: MigrationObjectType = {
    id: 'obj-123',
    name: 'Contact',
    project_id: 'proj-456',
    status: 'in_progress',
    // Remove created_at as it doesn't exist in the MigrationObjectType
    description: null,
    total_records: 0,
    processed_records: 0,
    failed_records: 0
  };

  // Sample data for FieldMappingsTable
  const [fieldMappings, setFieldMappings] = useState<FieldMapping[]>([
    {
      id: 'map-1',
      project_id: 'proj-456',
      object_type_id: 'obj-123',
      source_field: 'FirstName',
      destination_field: 'first_name',
      is_required: true,
      transformation_rule: null
    },
    {
      id: 'map-2',
      project_id: 'proj-456',
      object_type_id: 'obj-123',
      source_field: 'LastName',
      destination_field: 'last_name',
      is_required: true,
      transformation_rule: null
    },
    {
      id: 'map-3',
      project_id: 'proj-456',
      object_type_id: 'obj-123',
      source_field: 'Email',
      destination_field: 'email',
      is_required: false,
      transformation_rule: null
    }
  ]);

  const handleSourcesChange = (updatedSources: CrmSource[]) => {
    setSources(updatedSources);
    console.log('Sources updated:', updatedSources);
  };

  const handleUpdateMapping = (mappingId: string, updates: Partial<FieldMapping>) => {
    setFieldMappings(prevMappings => 
      prevMappings.map(mapping => 
        mapping.id === mappingId ? { ...mapping, ...updates } : mapping
      )
    );
    console.log(`Mapping ${mappingId} updated:`, updates);
  };

  // Helper function to simulate the mapping application
  const handleMappingsApplied = () => {
    console.log('Mappings applied');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8">
      <Container>
        <PageHeader 
          heading="Migration Tools" 
          subheading="Configure and test your data migration settings"
        />
        
        <Tabs defaultValue="sources" className="mt-8">
          <TabsList className="mb-4">
            <TabsTrigger value="sources">Sources</TabsTrigger>
            <TabsTrigger value="mapping">Field Mapping</TabsTrigger>
            <TabsTrigger value="automated">Automated Mapping</TabsTrigger>
          </TabsList>
          
          <TabsContent value="sources">
            <Card>
              <CardHeader>
                <CardTitle>CRM Data Sources</CardTitle>
              </CardHeader>
              <CardContent>
                <MultiSourceSelection 
                  sources={sources} 
                  onSourcesChange={handleSourcesChange} 
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="mapping">
            <Card>
              <CardHeader>
                <CardTitle>Field Mapping Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <DataMappingVisualizer 
                  objectType={objectType} 
                  fieldMappings={fieldMappings}
                  onUpdateMapping={handleUpdateMapping}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="automated">
            <Card>
              <CardHeader>
                <CardTitle>Automated Mapping Tools</CardTitle>
              </CardHeader>
              <CardContent>
                <AutomatedMappingPanel 
                  objectTypeId={objectType.id}
                  projectId={objectType.project_id}
                  sourceFields={['FirstName', 'LastName', 'Email', 'Phone', 'Title']}
                  destinationFields={['first_name', 'last_name', 'email', 'phone', 'job_title']}
                  onMappingsApplied={handleMappingsApplied}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </Container>
    </div>
  );
};

export default MigrationPage;
