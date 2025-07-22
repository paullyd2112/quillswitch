import React from "react";
import { useDashboard } from "@/components/migration/dashboard/context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle, Clock, AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const MigrationDashboardContent = () => {
  const { project, isLoading } = useDashboard();
  const navigate = useNavigate();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default' as const;
      case 'in_progress':
        return 'secondary' as const;
      case 'failed':
        return 'destructive' as const;
      default:
        return 'outline' as const;
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-8 w-64" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    );
  }

  // Remove error handling for now since it's not in the context

  if (!project) {
    return (
      <div className="container mx-auto p-6">
        <Card className="border-slate-800 bg-slate-900">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold text-white mb-2">Migration Not Found</h3>
            <p className="text-slate-400 mb-4">The requested migration project could not be found.</p>
            <Button 
              variant="outline"
              onClick={() => navigate('/app/migrations')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Migrations
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/app/migrations')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Migrations
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-white">{project.company_name}</h1>
            <p className="text-slate-400">
              {project.source_crm} → {project.destination_crm}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {getStatusIcon(project.status)}
          <Badge variant={getStatusVariant(project.status)}>
            {project.status.replace('_', ' ')}
          </Badge>
        </div>
      </div>

      {/* Migration Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-slate-800 bg-slate-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Total Objects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {project.total_objects || 0}
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Migrated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {project.migrated_objects || 0}
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Failed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {project.failed_objects || 0}
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">
              {project.total_objects 
                ? Math.round(((project.migrated_objects || 0) / project.total_objects) * 100)
                : 0
              }%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Migration Details */}
      <Card className="border-slate-800 bg-slate-900">
        <CardHeader>
          <CardTitle className="text-white">Migration Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-slate-400">Strategy</p>
              <p className="text-white">{project.migration_strategy}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Created</p>
              <p className="text-white">
                {new Date(project.created_at).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Last Updated</p>
              <p className="text-white">
                {new Date(project.updated_at).toLocaleDateString()}
              </p>
            </div>
            {project.completed_at && (
              <div>
                <p className="text-sm text-slate-400">Completed</p>
                <p className="text-white">
                  {new Date(project.completed_at).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};