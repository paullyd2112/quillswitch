
import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Container } from '@/components/ui/container';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FieldMapping, MigrationObjectType } from '@/integrations/supabase/migrationTypes';
import { CrmSource } from '@/components/migration/MultiSourceSelection';
import { 
  MigrationHeader, 
  ErrorDisplay, 
  SourcesTabContent, 
  MappingTabContent, 
  AutomatedTabContent,
  validateApiKeys
} from '@/components/pages/migration';

const MigrationPage: React.FC = () => {
  const { toast } = useToast();
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

  // Sample data for DataMappingVisualizer - fixed to match MigrationObjectType
  const objectType: MigrationObjectType = {
    id: 'obj-123',
    name: 'Contact',
    project_id: 'proj-456',
    description: 'Contact object type for migration',
    status: 'in_progress',
    total_records: 5000,
    processed_records: 2500,
    failed_records: 50
  };

  // Sample data for FieldMappingsTable - fixed to match FieldMapping
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

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<'api_key' | 'general' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

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
  const handleMappingsApplied = async () => {
    setErrorMessage(null);
    setErrorType(null);
    setIsProcessing(true);
    
    // First validate API keys
    const keyValidation = await validateApiKeys();
    
    if (!keyValidation.valid) {
      setIsProcessing(false);
      setErrorType('api_key');
      setErrorMessage("Non-functional migration: Invalid API Keys. Please update your credentials in Settings.");
      
      toast({
        title: "Migration Error",
        description: "Invalid API keys detected. Migration cannot proceed.",
        variant: "destructive"
      });
      return;
    }
    
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      
      // For demo purposes, show an error to simulate API validation failure
      setErrorType('general');
      setErrorMessage("Migration validation failed. Please check your configuration and try again.");
      
      toast({
        title: "Migration Error",
        description: "Migration validation failed. Please check your configuration and try again.",
        variant: "destructive"
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8">
      <Container>
        <MigrationHeader />
        
        <ErrorDisplay 
          errorMessage={errorMessage} 
          errorType={errorType} 
        />
        
        <Tabs defaultValue="sources" className="mt-8">
          <TabsList className="mb-4">
            <TabsTrigger value="sources">Sources</TabsTrigger>
            <TabsTrigger value="mapping">Field Mapping</TabsTrigger>
            <TabsTrigger value="automated">Automated Mapping</TabsTrigger>
          </TabsList>
          
          <TabsContent value="sources">
            <SourcesTabContent 
              sources={sources} 
              onSourcesChange={handleSourcesChange} 
            />
          </TabsContent>
          
          <TabsContent value="mapping">
            <MappingTabContent 
              objectType={objectType} 
              fieldMappings={fieldMappings}
              onUpdateMapping={handleUpdateMapping}
            />
          </TabsContent>
          
          <TabsContent value="automated">
            <AutomatedTabContent 
              objectTypeId={objectType.id}
              projectId={objectType.project_id}
              sourceFields={['FirstName', 'LastName', 'Email', 'Phone', 'Title']}
              destinationFields={['first_name', 'last_name', 'email', 'phone', 'job_title']}
              onMappingsApplied={handleMappingsApplied}
              isProcessing={isProcessing}
            />
          </TabsContent>
        </Tabs>
      </Container>
    </div>
  );
};

export default MigrationPage;
