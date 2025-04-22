
import React from 'react';
import { Container } from '@/components/ui/container';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MigrationProvider } from '@/components/pages/migration/MigrationContext';
import { SourcesTab } from '@/components/pages/migration/tabs/SourcesTab';
import { MappingTab } from '@/components/pages/migration/tabs/MappingTab';
import { AutomatedTab } from '@/components/pages/migration/tabs/AutomatedTab';
import { ErrorDisplay } from '@/components/pages/migration';

const MigrationPage: React.FC = () => {
  return (
    <MigrationProvider>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8">
        <Container>
          <ErrorDisplay />
          
          <Tabs defaultValue="sources" className="mt-8">
            <TabsList className="mb-4">
              <TabsTrigger value="sources">Sources</TabsTrigger>
              <TabsTrigger value="mapping">Field Mapping</TabsTrigger>
              <TabsTrigger value="automated">Automated Mapping</TabsTrigger>
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
          </Tabs>
        </Container>
      </div>
    </MigrationProvider>
  );
};

export default MigrationPage;
