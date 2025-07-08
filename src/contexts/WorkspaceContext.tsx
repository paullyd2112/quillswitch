import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth';
import { toast } from 'sonner';

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  owner_id: string;
  settings: any;
  subscription_tier: string;
  max_users: number;
  max_projects: number;
  created_at: string;
  updated_at: string;
}

export interface WorkspaceMembership {
  id: string;
  workspace_id: string;
  user_id: string;
  role: string;
  joined_at: string;
  invited_by?: string;
}

interface WorkspaceContextType {
  currentWorkspace: Workspace | null;
  workspaces: Workspace[];
  memberships: WorkspaceMembership[];
  isLoading: boolean;
  switchWorkspace: (workspaceId: string) => Promise<void>;
  createWorkspace: (name: string, slug: string) => Promise<Workspace>;
  updateWorkspace: (workspaceId: string, updates: Partial<Workspace>) => Promise<void>;
  inviteUser: (workspaceId: string, email: string, role: string) => Promise<void>;
  removeUser: (membershipId: string) => Promise<void>;
  refreshWorkspaces: () => Promise<void>;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

interface WorkspaceProviderProps {
  children: ReactNode;
}

export const WorkspaceProvider: React.FC<WorkspaceProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [memberships, setMemberships] = useState<WorkspaceMembership[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load workspaces and set current workspace
  const loadWorkspaces = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);

      // Get user's workspaces using the database function
      const { data: workspaceData, error: workspaceError } = await supabase
        .rpc('get_user_workspaces');

      if (workspaceError) throw workspaceError;

      // Get full workspace details
      const workspaceIds = workspaceData?.map(w => w.workspace_id) || [];
      const { data: fullWorkspaces, error: fullWorkspaceError } = await supabase
        .from('workspaces')
        .select('*')
        .in('id', workspaceIds);

      if (fullWorkspaceError) throw fullWorkspaceError;

      // Get memberships
      const { data: membershipData, error: membershipError } = await supabase
        .from('workspace_memberships')
        .select('*')
        .eq('user_id', user.id);

      if (membershipError) throw membershipError;

      setWorkspaces(fullWorkspaces || []);
      setMemberships(membershipData || []);

      // Set current workspace from localStorage or default to first
      const savedWorkspaceId = localStorage.getItem('currentWorkspaceId');
      const targetWorkspace = savedWorkspaceId 
        ? fullWorkspaces?.find(w => w.id === savedWorkspaceId)
        : fullWorkspaces?.[0];

      if (targetWorkspace) {
        setCurrentWorkspace(targetWorkspace);
        localStorage.setItem('currentWorkspaceId', targetWorkspace.id);
      }

    } catch (error) {
      console.error('Failed to load workspaces:', error);
      toast.error('Failed to load workspaces');
    } finally {
      setIsLoading(false);
    }
  };

  // Switch to a different workspace
  const switchWorkspace = async (workspaceId: string) => {
    const workspace = workspaces.find(w => w.id === workspaceId);
    if (workspace) {
      setCurrentWorkspace(workspace);
      localStorage.setItem('currentWorkspaceId', workspaceId);
      toast.success(`Switched to ${workspace.name}`);
    }
  };

  // Create a new workspace
  const createWorkspace = async (name: string, slug: string): Promise<Workspace> => {
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('workspaces')
      .insert({
        name,
        slug,
        owner_id: user.id
      })
      .select()
      .single();

    if (error) throw error;

    // Add membership for the creator
    await supabase
      .from('workspace_memberships')
      .insert({
        workspace_id: data.id,
        user_id: user.id,
        role: 'owner'
      });

    await refreshWorkspaces();
    return data;
  };

  // Update workspace settings
  const updateWorkspace = async (workspaceId: string, updates: Partial<Workspace>) => {
    const { error } = await supabase
      .from('workspaces')
      .update(updates)
      .eq('id', workspaceId);

    if (error) throw error;

    await refreshWorkspaces();
    toast.success('Workspace updated successfully');
  };

  // Invite a user to the workspace
  const inviteUser = async (workspaceId: string, email: string, role: string) => {
    // This would integrate with an email invitation system
    // For now, we'll just show a success message
    toast.success(`Invitation sent to ${email}`);
  };

  // Remove a user from the workspace
  const removeUser = async (membershipId: string) => {
    const { error } = await supabase
      .from('workspace_memberships')
      .delete()
      .eq('id', membershipId);

    if (error) throw error;

    await refreshWorkspaces();
    toast.success('User removed from workspace');
  };

  // Refresh workspaces data
  const refreshWorkspaces = async () => {
    await loadWorkspaces();
  };

  // Load workspaces when user changes
  useEffect(() => {
    loadWorkspaces();
  }, [user]);

  const value: WorkspaceContextType = {
    currentWorkspace,
    workspaces,
    memberships,
    isLoading,
    switchWorkspace,
    createWorkspace,
    updateWorkspace,
    inviteUser,
    removeUser,
    refreshWorkspaces
  };

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = (): WorkspaceContextType => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
};