import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Play, 
  Pause, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Settings,
  ArrowRightLeft
} from "lucide-react";
import { useQuillSync } from "@/hooks/useQuillSync";
import { useNavigate } from "react-router-dom";
import { SyncProject } from "@/services/quill-sync/types";

const getStatusIcon = (status: SyncProject['sync_status']) => {
  switch (status) {
    case 'active':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'paused':
      return <Pause className="h-4 w-4 text-blue-500" />;
    case 'error':
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    case 'initializing':
      return <Clock className="h-4 w-4 text-yellow-500" />;
    default:
      return <Clock className="h-4 w-4 text-gray-500" />;
  }
};

const getStatusBadgeVariant = (status: SyncProject['sync_status']) => {
  switch (status) {
    case 'active':
      return 'default' as const;
    case 'paused':
      return 'secondary' as const;
    case 'error':
      return 'destructive' as const;
    case 'initializing':
      return 'outline' as const;
    default:
      return 'outline' as const;
  }
};

const SyncProjectCard: React.FC<{
  project: SyncProject;
  onStart: (id: string) => void;
  onPause: (id: string) => void;
  isLoading: boolean;
}> = ({ project, onStart, onPause, isLoading }) => {
  const navigate = useNavigate();

  const getLastSyncText = () => {
    if (!project.last_sync_run) return 'Never';
    const date = new Date(project.last_sync_run);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours > 24) {
      return `${Math.floor(diffHours / 24)} days ago`;
    } else if (diffHours > 0) {
      return `${diffHours}h ${diffMinutes}m ago`;
    } else {
      return `${diffMinutes}m ago`;
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getStatusIcon(project.sync_status)}
            <CardTitle className="text-lg">{project.project_name}</CardTitle>
          </div>
          <Badge variant={getStatusBadgeVariant(project.sync_status)} className="capitalize">
            {project.sync_status}
          </Badge>
        </div>
        <CardDescription className="flex items-center space-x-2">
          <span className="font-medium">Bidirectional Sync</span>
          <ArrowRightLeft className="h-3 w-3" />
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          <div className="flex justify-between">
            <span>Last sync:</span>
            <span>{getLastSyncText()}</span>
          </div>
        </div>

        {project.sync_status === 'active' && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Sync Progress</span>
              <span>Running...</span>
            </div>
            <Progress value={75} className="h-2" />
          </div>
        )}

        <div className="flex space-x-2">
          {project.sync_status === 'active' ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPause(project.id)}
              disabled={isLoading}
              className="flex-1"
            >
              <Pause className="h-4 w-4 mr-1" />
              Pause
            </Button>
          ) : (
            <Button
              variant="default"
              size="sm"
              onClick={() => onStart(project.id)}
              disabled={isLoading || project.sync_status === 'error'}
              className="flex-1"
            >
              <Play className="h-4 w-4 mr-1" />
              Start Sync
            </Button>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/app/quill-sync/conflicts/${project.id}`)}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const QuillSyncDashboard: React.FC = () => {
  const {
    syncProjects,
    activeSyncProject,
    syncConflicts,
    isLoading,
    isSyncing,
    startSync,
    pauseSync
  } = useQuillSync();

  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading sync projects...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">QuillSync Pro Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor and manage your bidirectional CRM synchronization projects
          </p>
        </div>
        <Button onClick={() => navigate('/app/quill-sync/create')}>
          Create New Sync Project
        </Button>
      </div>

      {/* Active Sync Alert */}
      {activeSyncProject && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-blue-500" />
              <CardTitle className="text-blue-700">Active Sync Running</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-blue-600">
              "{activeSyncProject.project_name}" is currently syncing data between your CRMs.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Projects</p>
                <p className="text-2xl font-bold">{syncProjects.length}</p>
              </div>
              <ArrowRightLeft className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Syncs</p>
                <p className="text-2xl font-bold text-green-600">
                  {syncProjects.filter(p => p.sync_status === 'active').length}
                </p>
              </div>
              <Play className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Conflicts</p>
                <p className="text-2xl font-bold text-amber-600">{syncConflicts.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Error Projects</p>
                <p className="text-2xl font-bold text-red-600">
                  {syncProjects.filter(p => p.sync_status === 'error').length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Conflicts Alert */}
      {syncConflicts.length > 0 && (
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                <CardTitle className="text-amber-700">
                  {syncConflicts.length} Conflict{syncConflicts.length > 1 ? 's' : ''} Need Review
                </CardTitle>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/app/quill-sync/conflicts')}
              >
                Review Conflicts
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-amber-600">
              Data conflicts detected during synchronization require manual review.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Sync Projects Grid */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Sync Projects</h2>
        {syncProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {syncProjects.map(project => (
              <SyncProjectCard
                key={project.id}
                project={project}
                onStart={startSync}
                onPause={pauseSync}
                isLoading={isSyncing}
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12">
              <div className="text-center space-y-4">
                <ArrowRightLeft className="h-12 w-12 text-muted-foreground mx-auto" />
                <div>
                  <h3 className="text-lg font-medium">No Sync Projects Yet</h3>
                  <p className="text-muted-foreground">
                    Create your first bidirectional sync project to get started.
                  </p>
                </div>
                <Button onClick={() => navigate('/app/quill-sync/create')}>
                  Create Sync Project
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default QuillSyncDashboard;