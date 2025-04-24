
import { useState, useCallback } from 'react';
import { DataLoadingService } from '@/services/dataLoading/DataLoadingService';

export function useDataLoading(sourceType: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState({
    total: 0,
    processed: 0,
    valid: 0,
    errors: 0,
    duplicates: 0
  });

  const processData = useCallback(async (records: any[]) => {
    setIsLoading(true);
    try {
      const service = new DataLoadingService(sourceType);
      
      // Subscribe to job updates
      const subscription = supabase
        .from('data_loading_jobs')
        .on('UPDATE', payload => {
          setProgress({
            total: payload.new.total_records,
            processed: payload.new.processed_records,
            valid: payload.new.validated_records,
            errors: payload.new.error_count,
            duplicates: payload.new.duplicate_records
          });
        })
        .subscribe();

      // Process records
      const result = await service.processRecords(records);
      
      // Clean up subscription
      subscription.unsubscribe();
      
      return result;
    } finally {
      setIsLoading(false);
    }
  }, [sourceType]);

  return {
    processData,
    isLoading,
    progress
  };
}
