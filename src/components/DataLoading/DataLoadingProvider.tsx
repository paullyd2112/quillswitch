
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useDataLoading } from '@/hooks/useDataLoading';
import { ValidationIssue } from '@/services/dataLoading/types';

interface DataLoadingContextType {
  isLoading: boolean;
  progress: {
    total: number;
    processed: number;
    valid: number;
    errors: number;
    duplicates: number;
  };
  validationIssues: ValidationIssue[];
  sourceType: string;
  setSourceType: (type: string) => void;
  processData: (records: any[]) => Promise<any>;
  loadValidationIssues: () => Promise<void>;
}

const DataLoadingContext = createContext<DataLoadingContextType | undefined>(undefined);

export function useDataLoadingContext() {
  const context = useContext(DataLoadingContext);
  if (!context) {
    throw new Error('useDataLoadingContext must be used within a DataLoadingProvider');
  }
  return context;
}

interface DataLoadingProviderProps {
  children: ReactNode;
  initialSourceType?: string;
}

export function DataLoadingProvider({ 
  children, 
  initialSourceType = 'contacts' 
}: DataLoadingProviderProps) {
  const [sourceType, setSourceType] = useState<string>(initialSourceType);
  const [validationIssues, setValidationIssues] = useState<ValidationIssue[]>([]);
  
  const { processData, isLoading, progress } = useDataLoading(sourceType);
  
  const handleProcessData = async (records: any[]) => {
    const result = await processData(records);
    
    // Load validation issues after processing
    if (result?.jobId) {
      await loadValidationIssues(result.jobId);
    }
    
    return result;
  };
  
  const loadValidationIssues = async (jobId?: string) => {
    try {
      const dataLoadingService = new DataLoadingService(sourceType);
      
      // If a job ID is provided, use it; otherwise, use the last job
      const issues = await dataLoadingService.getValidationIssues(jobId);
      setValidationIssues(issues || []);
    } catch (error) {
      console.error("Failed to load validation issues:", error);
      setValidationIssues([]);
    }
  };
  
  const value = {
    isLoading,
    progress,
    validationIssues,
    sourceType,
    setSourceType,
    processData: handleProcessData,
    loadValidationIssues: () => loadValidationIssues(),
  };
  
  return (
    <DataLoadingContext.Provider value={value}>
      {children}
    </DataLoadingContext.Provider>
  );
}

// Import at the end to avoid circular dependency
import { DataLoadingService } from '@/services/dataLoading/DataLoadingService';
