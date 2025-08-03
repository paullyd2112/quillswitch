import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  ArrowRight,
  Database,
  Calendar
} from "lucide-react";
import { useQuillSync } from "@/hooks/useQuillSync";
import { SyncConflict } from "@/services/quill-sync/types";

const getConflictIcon = (status: SyncConflict['status']) => {
  switch (status) {
    case 'pending_review':
      return <AlertTriangle className="h-4 w-4 text-amber-500" />;
    case 'auto_resolved':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'manual_resolved':
      return <CheckCircle className="h-4 w-4 text-blue-500" />;
    case 'ignored':
      return <Clock className="h-4 w-4 text-gray-500" />;
    default:
      return <AlertTriangle className="h-4 w-4 text-amber-500" />;
  }
};

const getStatusBadgeVariant = (status: SyncConflict['status']) => {
  switch (status) {
    case 'pending_review':
      return 'destructive' as const;
    case 'auto_resolved':
      return 'default' as const;
    case 'manual_resolved':
      return 'secondary' as const;
    case 'ignored':
      return 'outline' as const;
    default:
      return 'destructive' as const;
  }
};

const ConflictCard: React.FC<{
  conflict: SyncConflict;
  onResolve: (id: string, resolution: 'accept_source' | 'accept_destination' | 'ignore') => void;
}> = ({ conflict, onResolve }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const conflictDetails = conflict.conflict_details as any;
  const conflictingFields = conflictDetails?.conflicting_fields || [];

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getConflictIcon(conflict.status)}
            <CardTitle className="text-lg">Record: {conflict.record_id}</CardTitle>
          </div>
          <Badge variant={getStatusBadgeVariant(conflict.status)} className="capitalize">
            {conflict.status.replace('_', ' ')}
          </Badge>
        </div>
        <CardDescription className="flex items-center space-x-2">
          <Calendar className="h-4 w-4" />
          <span>Detected: {formatDate(conflict.created_at)}</span>
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Conflicting Fields */}
        <div>
          <p className="font-medium text-sm mb-2">Conflicting Fields ({conflictingFields.length})</p>
          <div className="flex flex-wrap gap-1">
            {conflictingFields.slice(0, 5).map((field: string) => (
              <Badge key={field} variant="outline" className="text-xs">
                {field}
              </Badge>
            ))}
            {conflictingFields.length > 5 && (
              <Badge variant="outline" className="text-xs">
                +{conflictingFields.length - 5} more
              </Badge>
            )}
          </div>
        </div>

        {/* Source vs Destination */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex items-center space-x-1">
              <Database className="h-3 w-3" />
              <span className="font-medium">Source System</span>
            </div>
            <p className="text-muted-foreground">
              Updated: {formatDate(conflictDetails?.source_updated_at || '')}
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-1">
              <Database className="h-3 w-3" />
              <span className="font-medium">Destination System</span>
            </div>
            <p className="text-muted-foreground">
              Updated: {formatDate(conflictDetails?.destination_updated_at || '')}
            </p>
          </div>
        </div>

        {/* Resolution Actions */}
        {conflict.status === 'pending_review' && (
          <div className="flex space-x-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onResolve(conflict.id, 'accept_source')}
              className="flex-1"
            >
              Accept Source
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onResolve(conflict.id, 'accept_destination')}
              className="flex-1"
            >
              Accept Destination
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onResolve(conflict.id, 'ignore')}
            >
              Ignore
            </Button>
          </div>
        )}

        {/* Resolution Info */}
        {conflict.status !== 'pending_review' && conflict.resolution_rule && (
          <div className="text-sm text-muted-foreground">
            <span className="font-medium">Resolution:</span> {conflict.resolution_rule.replace('_', ' ')}
            {conflict.resolved_at && (
              <span> • {formatDate(conflict.resolved_at)}</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const ConflictsDashboard: React.FC = () => {
  const { syncConflicts, isLoading, resolveConflict } = useQuillSync();

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading conflicts...</p>
          </div>
        </div>
      </div>
    );
  }

  const pendingConflicts = syncConflicts.filter(c => c.status === 'pending_review');
  const resolvedConflicts = syncConflicts.filter(c => c.status !== 'pending_review');

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Sync Conflicts</h1>
        <p className="text-muted-foreground">
          Review and resolve data conflicts from bidirectional synchronization
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Review</p>
                <p className="text-2xl font-bold text-amber-600">{pendingConflicts.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Auto Resolved</p>
                <p className="text-2xl font-bold text-green-600">
                  {resolvedConflicts.filter(c => c.status === 'auto_resolved').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Manual Resolved</p>
                <p className="text-2xl font-bold text-blue-600">
                  {resolvedConflicts.filter(c => c.status === 'manual_resolved').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Conflicts */}
      {pendingConflicts.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4 text-amber-700">
            Pending Review ({pendingConflicts.length})
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {pendingConflicts.map(conflict => (
              <ConflictCard
                key={conflict.id}
                conflict={conflict}
                onResolve={resolveConflict}
              />
            ))}
          </div>
        </div>
      )}

      {/* Resolved Conflicts */}
      {resolvedConflicts.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">
            Resolved Conflicts ({resolvedConflicts.length})
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {resolvedConflicts.slice(0, 6).map(conflict => (
              <ConflictCard
                key={conflict.id}
                conflict={conflict}
                onResolve={resolveConflict}
              />
            ))}
          </div>
          {resolvedConflicts.length > 6 && (
            <div className="text-center mt-4">
              <Button variant="outline">
                Load More Resolved Conflicts
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {syncConflicts.length === 0 && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center space-y-4">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
              <div>
                <h3 className="text-lg font-medium">No Conflicts Detected</h3>
                <p className="text-muted-foreground">
                  Your sync projects are running smoothly without any data conflicts.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ConflictsDashboard;