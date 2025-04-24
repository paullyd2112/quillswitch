
import { useState, useCallback } from 'react';
import { DataLoadingService } from '@/services/dataLoading/DataLoadingService';
import { supabase } from '@/integrations/supabase/client';

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
      
      // Initialize the job to get the job ID
      const jobData = await service.initializeJob();
      const jobId = jobData.id;
      
      // Subscribe to job updates using channels
      const channel = supabase
        .channel(`job-${jobId}`)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'data_loading_jobs',
            filter: `id=eq.${jobId}`
          },
          payload => {
            setProgress({
              total: payload.new.total_records,
              processed: payload.new.processed_records,
              valid: payload.new.validated_records,
              errors: payload.new.error_count,
              duplicates: payload.new.duplicate_records
            });
          }
        )
        .subscribe();

      // Process records
      const result = await service.processRecords(records);
      
      // Clean up subscription
      supabase.removeChannel(channel);
      
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
