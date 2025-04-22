
import React from 'react';
import { useMigration } from '../MigrationContext';
import { Card, CardContent } from '@/components/ui/card';
import MultiSourceSelection from '@/components/migration/MultiSourceSelection';

export const SourcesTab = () => {
  const { sources, setSources } = useMigration();

  return (
    <Card>
      <CardContent className="p-6">
        <MultiSourceSelection 
          sources={sources} 
          onSourcesChange={setSources} 
        />
      </CardContent>
    </Card>
  );
};
