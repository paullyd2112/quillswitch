
import React from 'react';
import { Container } from '@/components/ui/container';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MigrationProvider, useMigration } from '@/components/pages/migration/MigrationContext';
import { SourcesTab } from '@/components/pages/migration/tabs/SourcesTab';
import { MappingTab } from '@/components/pages/migration/tabs/MappingTab';
import { AutomatedTab } from '@/components/pages/migration/tabs/AutomatedTab';
import { ErrorDisplay } from '@/components/pages/migration';
import AIEnhancedDataPreview from '@/components/ai-enhancements/AIEnhancedDataPreview';

const MigrationPage: React.FC = () => {
  return (
    <MigrationProvider>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8">
        <Container>
          <MigrationErrorDisplay />
          
          <Tabs defaultValue="sources" className="mt-8">
            <TabsList className="mb-4">
              <TabsTrigger value="sources">Sources</TabsTrigger>
              <TabsTrigger value="mapping">Field Mapping</TabsTrigger>
              <TabsTrigger value="automated">Automated Mapping</TabsTrigger>
              <TabsTrigger value="ai-analysis">AI Analysis</TabsTrigger>
            </TabsList>
            
            <TabsContent value="sources">
              <SourcesTab />
            </TabsContent>
            
            <TabsContent value="mapping">
              <MappingTab />
            </TabsContent>
            
            <TabsContent value="automated">
              <AutomatedTab />
            </TabsContent>
            
            <TabsContent value="ai-analysis">
              <AIAnalysisTab />
            </TabsContent>
          </Tabs>
        </Container>
      </div>
    </MigrationProvider>
  );
};

// Create wrapper components to access context values
const MigrationErrorDisplay = () => {
  const { errorMessage, errorType } = useMigration();
  return <ErrorDisplay errorMessage={errorMessage} errorType={errorType} />;
};

const AIAnalysisTab = () => {
  const { sources } = useMigration();
  
  // Create sample extracted data from sources for AI analysis
  const extractedData = sources.map(source => ({
    recordId: `${source.type}-${source.id}`,
    sourceSystem: source.type,
    objectType: 'contact',
    fields: [
      { name: 'firstName', value: 'Sample', type: 'string' as const },
      { name: 'lastName', value: 'Contact', type: 'string' as const },
      { name: 'email', value: 'sample@company.com', type: 'string' as const },
      { name: 'phone', value: '+1-555-0123', type: 'string' as const }
    ],
    metadata: {
      source: source.type,
      extractedAt: new Date().toISOString()
    }
  }));

  const migrationContext = {
    sourceSystem: sources.find(s => s.selected)?.type || 'salesforce',
    destinationSystem: 'hubspot',
    objectType: 'contact',
    recordCount: extractedData.length,
    fieldMappings: [
      { source: 'firstName', destination: 'firstname' },
      { source: 'lastName', destination: 'lastname' },
      { source: 'email', destination: 'email' },
      { source: 'phone', destination: 'phone' }
    ]
  };

  return (
    <AIEnhancedDataPreview 
      data={extractedData}
      migrationContext={migrationContext}
      onAnalysisComplete={(results) => {
        console.log('AI Analysis completed:', results);
      }}
    />
  );
};

export default MigrationPage;
