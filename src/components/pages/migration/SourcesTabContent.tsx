
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MultiSourceSelection } from '@/components/migration';
import { CrmSource } from '@/components/migration/MultiSourceSelection';

interface SourcesTabContentProps {
  sources: CrmSource[];
  onSourcesChange: (sources: CrmSource[]) => void;
}

const SourcesTabContent: React.FC<SourcesTabContentProps> = ({ 
  sources, 
  onSourcesChange 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>CRM Data Sources</CardTitle>
      </CardHeader>
      <CardContent>
        <MultiSourceSelection 
          sources={sources} 
          onSourcesChange={onSourcesChange} 
        />
      </CardContent>
    </Card>
  );
};

export default SourcesTabContent;
