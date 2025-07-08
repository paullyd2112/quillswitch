import React, { useState } from 'react';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Building2, ChevronDown, Plus, Settings } from 'lucide-react';
import { toast } from 'sonner';

const WorkspaceSwitcher: React.FC = () => {
  const { 
    currentWorkspace, 
    workspaces, 
    switchWorkspace, 
    createWorkspace,
    isLoading 
  } = useWorkspace();
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [newWorkspaceSlug, setNewWorkspaceSlug] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateWorkspace = async () => {
    if (!newWorkspaceName.trim() || !newWorkspaceSlug.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsCreating(true);
    try {
      await createWorkspace(newWorkspaceName, newWorkspaceSlug);
      setIsCreateOpen(false);
      setNewWorkspaceName('');
      setNewWorkspaceSlug('');
      toast.success('Workspace created successfully');
    } catch (error) {
      console.error('Failed to create workspace:', error);
      toast.error('Failed to create workspace');
    } finally {
      setIsCreating(false);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50);
  };

  const handleNameChange = (name: string) => {
    setNewWorkspaceName(name);
    if (!newWorkspaceSlug) {
      setNewWorkspaceSlug(generateSlug(name));
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2">
        <Building2 className="h-4 w-4" />
        <span className="text-sm">Loading...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-[240px] justify-between">
            <div className="flex items-center space-x-2">
              <Building2 className="h-4 w-4" />
              <span className="truncate">
                {currentWorkspace?.name || 'Select Workspace'}
              </span>
              {currentWorkspace?.subscription_tier && (
                <Badge variant="secondary" className="text-xs">
                  {currentWorkspace.subscription_tier}
                </Badge>
              )}
            </div>
            <ChevronDown className="h-4 w-4 shrink-0" />
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent className="w-[240px]" align="start">
          <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {workspaces.map((workspace) => (
            <DropdownMenuItem
              key={workspace.id}
              onClick={() => switchWorkspace(workspace.id)}
              className="flex items-center justify-between"
            >
              <div className="flex items-center space-x-2">
                <Building2 className="h-4 w-4" />
                <span className="truncate">{workspace.name}</span>
              </div>
              {workspace.id === currentWorkspace?.id && (
                <Badge variant="default" className="text-xs">
                  Current
                </Badge>
              )}
            </DropdownMenuItem>
          ))}
          
          <DropdownMenuSeparator />
          
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <Plus className="h-4 w-4 mr-2" />
                Create Workspace
              </DropdownMenuItem>
            </DialogTrigger>
            
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Workspace</DialogTitle>
                <DialogDescription>
                  Create a new workspace to organize your migration projects.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="workspace-name">Workspace Name</Label>
                  <Input
                    id="workspace-name"
                    value={newWorkspaceName}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="My Company Workspace"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="workspace-slug">Workspace Slug</Label>
                  <Input
                    id="workspace-slug"
                    value={newWorkspaceSlug}
                    onChange={(e) => setNewWorkspaceSlug(e.target.value)}
                    placeholder="my-company-workspace"
                  />
                  <p className="text-xs text-muted-foreground">
                    This will be used in URLs and must be unique.
                  </p>
                </div>
              </div>
              
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleCreateWorkspace}
                  disabled={isCreating}
                >
                  {isCreating ? 'Creating...' : 'Create Workspace'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <DropdownMenuItem>
            <Settings className="h-4 w-4 mr-2" />
            Workspace Settings
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default WorkspaceSwitcher;