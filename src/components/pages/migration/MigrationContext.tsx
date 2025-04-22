
import React, { createContext, useContext, useState } from 'react';
import { FieldMapping, MigrationObjectType } from '@/integrations/supabase/migrationTypes';
import { CrmSource } from '@/components/migration/MultiSourceSelection';

interface MigrationContextType {
  sources: CrmSource[];
  setSources: (sources: CrmSource[]) => void;
  fieldMappings: FieldMapping[];
  setFieldMappings: (mappings: FieldMapping[]) => void;
  objectType: MigrationObjectType;
  isProcessing: boolean;
  setIsProcessing: (value: boolean) => void;
  errorMessage: string | null;
  setErrorMessage: (message: string | null) => void;
  errorType: 'api_key' | 'general' | null;
  setErrorType: (type: 'api_key' | 'general' | null) => void;
}

const MigrationContext = createContext<MigrationContextType | undefined>(undefined);

export const MigrationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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

  const [objectType] = useState<MigrationObjectType>({
    id: 'obj-123',
    name: 'Contact',
    project_id: 'proj-456',
    description: 'Contact object type for migration',
    status: 'in_progress',
    total_records: 5000,
    processed_records: 2500,
    failed_records: 50
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<'api_key' | 'general' | null>(null);

  return (
    <MigrationContext.Provider 
      value={{
        sources,
        setSources,
        fieldMappings,
        setFieldMappings,
        objectType,
        isProcessing,
        setIsProcessing,
        errorMessage,
        setErrorMessage,
        errorType,
        setErrorType
      }}
    >
      {children}
    </MigrationContext.Provider>
  );
};

export const useMigration = () => {
  const context = useContext(MigrationContext);
  if (context === undefined) {
    throw new Error('useMigration must be used within a MigrationProvider');
  }
  return context;
};
