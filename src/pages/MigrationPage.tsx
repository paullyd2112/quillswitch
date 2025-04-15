
import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
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
import { AlertCircle, Key } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { apiClient } from '@/services/migration/apiClient';

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

  // Helper function to check API key validity
  const validateApiKeys = async () => {
    try {
      // Get current API key from apiClient
      const currentApiKey = apiClient.getApiKey();
      
      // Simple validation - in a real app, this would call a validation endpoint
      if (currentApiKey === 'demo_api_key_123456') {
        return { valid: false, message: "Invalid API key detected" };
      }
      
      return { valid: true };
    } catch (error) {
      console.error("API key validation error:", error);
      return { valid: false, message: "Error validating API keys" };
    }
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
        <PageHeader 
          heading="Migration Tools" 
          subheading="Configure and test your data migration settings"
        />
        
        {errorMessage && (
          <Alert 
            variant="destructive" 
            className={`mb-6 ${errorType === 'api_key' ? 'border-amber-500 dark:border-amber-700' : ''}`}
          >
            {errorType === 'api_key' ? (
              <Key className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <AlertTitle>
              {errorType === 'api_key' ? 'API Key Error' : 'Error'}
            </AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
            {errorType === 'api_key' && (
              <div className="mt-2 text-sm">
                Please verify your API credentials in the Settings page or contact support for assistance.
              </div>
            )}
          </Alert>
        )}
        
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
                  isProcessing={isProcessing}
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
