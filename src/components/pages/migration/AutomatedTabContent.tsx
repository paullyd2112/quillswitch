
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AutomatedMappingPanel } from '@/components/migration/automated-mapping';

interface AutomatedTabContentProps {
  objectTypeId: string;
  projectId: string;
  sourceFields: string[];
  destinationFields: string[];
  onMappingsApplied: () => void;
  isProcessing: boolean;
}

const AutomatedTabContent: React.FC<AutomatedTabContentProps> = ({
  objectTypeId,
  projectId,
  sourceFields,
  destinationFields,
  onMappingsApplied,
  isProcessing
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Automated Mapping Tools</CardTitle>
      </CardHeader>
      <CardContent>
        <AutomatedMappingPanel 
          objectTypeId={objectTypeId}
          projectId={projectId}
          sourceFields={sourceFields}
          destinationFields={destinationFields}
          onMappingsApplied={onMappingsApplied}
          isProcessing={isProcessing}
        />
      </CardContent>
    </Card>
  );
};

export default AutomatedTabContent;
