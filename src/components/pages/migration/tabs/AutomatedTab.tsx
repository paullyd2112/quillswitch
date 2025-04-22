
import React from 'react';
import { useMigration } from '../MigrationContext';
import { Card, CardContent } from '@/components/ui/card';
import AutomatedMappingPanel from '@/components/migration/AutomatedMappingPanel';
import { validateApiKeys } from '@/components/pages/migration';
import { toast } from 'sonner';

export const AutomatedTab = () => {
  const { 
    objectType,
    isProcessing,
    setIsProcessing,
    setErrorType,
    setErrorMessage
  } = useMigration();

  const handleMappingsApplied = async () => {
    setErrorMessage(null);
    setErrorType(null);
    setIsProcessing(true);
    
    const keyValidation = await validateApiKeys();
    
    if (!keyValidation.valid) {
      setIsProcessing(false);
      setErrorType('api_key');
      setErrorMessage("Non-functional migration: Invalid API Keys. Please update your credentials in Settings.");
      
      toast({
        description: "Invalid API keys detected. Migration cannot proceed.",
        variant: "destructive"
      });
      return;
    }
    
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      setErrorType('general');
      setErrorMessage("Migration validation failed. Please check your configuration and try again.");
      
      toast({
        description: "Migration validation failed. Please check your configuration and try again.",
        variant: "destructive"
      });
    }, 2000);
  };

  return (
    <Card>
      <CardContent className="p-6">
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
  );
};
