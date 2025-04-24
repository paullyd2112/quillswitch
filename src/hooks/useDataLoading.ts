
import { useState, useCallback, useEffect } from 'react';
import { DataLoadingService } from '@/services/dataLoading/DataLoadingService';
import { supabase } from '@/integrations/supabase/client';
import { DataQualityMetrics } from '@/components/DataLoading/DataQualityMetrics';

export function useDataLoading(sourceType: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);
  const [progress, setProgress] = useState({
    total: 0,
    processed: 0,
    valid: 0,
    errors: 0,
    duplicates: 0
  });

  // Initialize data loading service
  const service = new DataLoadingService(sourceType);

  // Subscribe to job updates when jobId changes
  useEffect(() => {
    if (!jobId) return;
    
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
            total: payload.new.total_records || 0,
            processed: payload.new.processed_records || 0,
            valid: payload.new.validated_records || 0,
            errors: payload.new.error_count || 0,
            duplicates: payload.new.duplicate_records || 0
          });
          
          // If job status is completed, completed_with_errors, or failed, set loading to false
          if (['completed', 'completed_with_errors', 'failed'].includes(payload.new.status)) {
            setIsLoading(false);
          }
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [jobId]);

  const processData = useCallback(async (records: any[]) => {
    setIsLoading(true);
    try {
      // Initialize the job to get the job ID
      const jobData = await service.initializeJob();
      setJobId(jobData.id);
      
      // Process records
      return await service.processRecords(records);
    } finally {
      // Note: We don't set isLoading to false here because the channel subscription will handle it
      // This ensures we don't prematurely end the loading state if the job is still running
    }
  }, [sourceType, service]);

  const getDataQualityMetrics = useCallback(async () => {
    return await service.getDataQualityMetrics(jobId || undefined);
  }, [jobId, service]);

  return {
    processData,
    isLoading,
    progress,
    jobId,
    getDataQualityMetrics
  };
}
