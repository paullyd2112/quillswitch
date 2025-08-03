import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useSessionContext } from '@supabase/auth-helpers-react';
import { useToast } from "@/hooks/use-toast";
import { SyncProject, SyncMap, SyncConflict } from "@/services/quill-sync/types";
import { QuillSyncEngine } from "@/services/quill-sync/syncEngine";

export const useQuillSync = () => {
  const { session } = useSessionContext();
  const { toast } = useToast();
  
  const [syncProjects, setSyncProjects] = useState<SyncProject[]>([]);
  const [activeSyncProject, setActiveSyncProject] = useState<SyncProject | null>(null);
  const [syncConflicts, setSyncConflicts] = useState<SyncConflict[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    if (session?.user) {
      loadSyncProjects();
      loadSyncConflicts();
    }
  }, [session]);

  const loadSyncProjects = async () => {
    if (!session?.user) return;

    try {
      const { data, error } = await supabase
        .from('sync_projects')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setSyncProjects((data || []) as SyncProject[]);
      
      // Find active project
      const active = (data || []).find(p => p.sync_status === 'active');
      setActiveSyncProject((active as SyncProject) || null);
    } catch (error) {
      console.error('Failed to load sync projects:', error);
      toast({
        title: "Error",
        description: "Failed to load sync projects",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadSyncConflicts = async () => {
    if (!session?.user) return;

    try {
      const { data, error } = await supabase
        .from('sync_conflicts')
        .select(`
          *,
          sync_projects!inner(user_id)
        `)
        .eq('sync_projects.user_id', session.user.id)
        .eq('status', 'pending_review')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setSyncConflicts((data || []) as unknown as SyncConflict[]);
    } catch (error) {
      console.error('Failed to load sync conflicts:', error);
    }
  };

  const createSyncProject = async (
    projectName: string,
    sourceCrmId: string,
    destinationCrmId: string,
    syncMaps: Omit<SyncMap, 'id' | 'sync_project_id' | 'created_at' | 'updated_at'>[]
  ): Promise<string | null> => {
    if (!session?.user) return null;

    try {
      // Create the sync project
      const { data: project, error: projectError } = await supabase
        .from('sync_projects')
        .insert({
          user_id: session.user.id,
          project_name: projectName,
          source_crm_id: sourceCrmId,
          destination_crm_id: destinationCrmId,
          sync_status: 'initializing',
          sync_settings: {}
        })
        .select()
        .single();

      if (projectError) throw projectError;

      // Create sync mappings
      const mappingsWithProjectId = syncMaps.map(map => ({
        ...map,
        sync_project_id: project.id
      }));

      const { error: mapsError } = await supabase
        .from('sync_maps')
        .insert(mappingsWithProjectId);

      if (mapsError) throw mapsError;

      toast({
        title: "Sync Project Created",
        description: `Successfully created "${projectName}" sync project`,
      });

      await loadSyncProjects();
      return project.id;
    } catch (error) {
      console.error('Failed to create sync project:', error);
      toast({
        title: "Error",
        description: "Failed to create sync project",
        variant: "destructive"
      });
      return null;
    }
  };

  const startSync = async (projectId: string): Promise<void> => {
    setIsSyncing(true);

    try {
      const engine = new QuillSyncEngine(projectId);
      await engine.initialize();
      await engine.runSyncCycle();

      toast({
        title: "Sync Completed",
        description: "Data synchronization completed successfully",
      });

      await loadSyncProjects();
      await loadSyncConflicts();
    } catch (error) {
      console.error('Sync failed:', error);
      toast({
        title: "Sync Failed",
        description: error instanceof Error ? error.message : "Synchronization failed",
        variant: "destructive"
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const pauseSync = async (projectId: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('sync_projects')
        .update({ sync_status: 'paused' })
        .eq('id', projectId);

      if (error) throw error;

      toast({
        title: "Sync Paused",
        description: "Synchronization has been paused",
      });

      await loadSyncProjects();
    } catch (error) {
      console.error('Failed to pause sync:', error);
      toast({
        title: "Error",
        description: "Failed to pause synchronization",
        variant: "destructive"
      });
    }
  };

  const resolveConflict = async (
    conflictId: string,
    resolution: 'accept_source' | 'accept_destination' | 'ignore'
  ): Promise<void> => {
    try {
      const { error } = await supabase
        .from('sync_conflicts')
        .update({
          status: 'manual_resolved',
          resolution_rule: resolution,
          resolved_at: new Date().toISOString(),
          resolved_by: session?.user?.id
        })
        .eq('id', conflictId);

      if (error) throw error;

      toast({
        title: "Conflict Resolved",
        description: "Conflict has been resolved successfully",
      });

      await loadSyncConflicts();
    } catch (error) {
      console.error('Failed to resolve conflict:', error);
      toast({
        title: "Error",
        description: "Failed to resolve conflict",
        variant: "destructive"
      });
    }
  };

  return {
    syncProjects,
    activeSyncProject,
    syncConflicts,
    isLoading,
    isSyncing,
    createSyncProject,
    startSync,
    pauseSync,
    resolveConflict,
    loadSyncProjects,
    loadSyncConflicts
  };
};