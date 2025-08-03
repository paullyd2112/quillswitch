import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useSessionContext } from '@supabase/auth-helpers-react';
import { CleansingJob, DuplicateMatch, CleansingResult } from '@/types/quillCleanse';

export const useQuillCleanse = () => {
  const { toast } = useToast();
  const { session } = useSessionContext();
  const [isProcessing, setIsProcessing] = useState(false);
  const [cleansingJobs, setCleansingJobs] = useState<CleansingJob[]>([]);
  const [currentJob, setCurrentJob] = useState<CleansingJob | null>(null);
  const [duplicateMatches, setDuplicateMatches] = useState<DuplicateMatch[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const startCleansing = useCallback(async (
    sourceData: any[],
    targetData: any[] = [],
    confidenceThreshold: number = 0.75,
    migrationProjectId?: string
  ) => {
    if (!session?.user) {
      toast({
        title: "Authentication required",
        description: "Please log in to use QuillCleanse",
        variant: "destructive"
      });
      return null;
    }

    setIsProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke('quill-cleanse', {
        body: {
          sourceData,
          targetData,
          confidenceThreshold,
          migrationProjectId
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      const result = data as CleansingResult;
      
      if (result.success) {
        toast({
          title: "QuillCleanse completed successfully!",
          description: `Found ${result.summary.duplicatesFound} potential duplicates`,
        });
        
        // Refresh jobs list
        await loadCleansingJobs();
        
        return result;
      } else {
        throw new Error('Cleansing failed');
      }
    } catch (error) {
      console.error('QuillCleanse error:', error);
      toast({
        title: "QuillCleanse failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, [session, toast]);

  const loadCleansingJobs = useCallback(async () => {
    if (!session?.user) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('cleansing_jobs')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCleansingJobs((data || []) as CleansingJob[]);
    } catch (error) {
      console.error('Error loading cleansing jobs:', error);
      toast({
        title: "Error",
        description: "Failed to load cleansing jobs",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [session, toast]);

  const loadDuplicateMatches = useCallback(async (jobId: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('duplicate_matches')
        .select('*')
        .eq('cleansing_job_id', jobId)
        .order('confidence_score', { ascending: false });

      if (error) throw error;
      setDuplicateMatches((data || []) as DuplicateMatch[]);
    } catch (error) {
      console.error('Error loading duplicate matches:', error);
      toast({
        title: "Error",
        description: "Failed to load duplicate matches",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const updateMatchAction = useCallback(async (
    matchId: string, 
    action: 'approved' | 'rejected' | 'modified'
  ) => {
    try {
      const { error } = await supabase
        .from('duplicate_matches')
        .update({ user_action: action })
        .eq('id', matchId);

      if (error) throw error;

      // Update local state
      setDuplicateMatches(prev => 
        prev.map(match => 
          match.id === matchId 
            ? { ...match, user_action: action }
            : match
        )
      );

      toast({
        title: "Action updated",
        description: `Match ${action} successfully`
      });
    } catch (error) {
      console.error('Error updating match action:', error);
      toast({
        title: "Error",
        description: "Failed to update match action",
        variant: "destructive"
      });
    }
  }, [toast]);

  const getJobById = useCallback(async (jobId: string) => {
    try {
      const { data, error } = await supabase
        .from('cleansing_jobs')
        .select('*')
        .eq('id', jobId)
        .single();

      if (error) throw error;
      return data as CleansingJob;
    } catch (error) {
      console.error('Error loading job:', error);
      return null;
    }
  }, []);

  return {
    isProcessing,
    cleansingJobs,
    currentJob,
    duplicateMatches,
    isLoading,
    startCleansing,
    loadCleansingJobs,
    loadDuplicateMatches,
    updateMatchAction,
    getJobById,
    setCurrentJob
  };
};