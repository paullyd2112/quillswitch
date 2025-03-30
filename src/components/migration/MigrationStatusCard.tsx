
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Clock, CheckCircle, XCircle, Pause, Play } from "lucide-react";
import { MigrationProject } from "@/integrations/supabase/migrationTypes";
import { getProjectProgress } from "@/services/migrationService";

interface MigrationStatusCardProps {
  project: MigrationProject;
}

const MigrationStatusCard: React.FC<MigrationStatusCardProps> = ({ project }) => {
  const progress = getProjectProgress(project);
  
  const getStatusIcon = () => {
    switch (project.status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "failed":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "paused":
        return <Pause className="h-5 w-5 text-amber-500" />;
      case "in_progress":
        return <Play className="h-5 w-5 text-blue-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };
  
  const getStatusText = () => {
    switch (project.status) {
      case "completed":
        return "Completed";
      case "failed":
        return "Failed";
      case "paused":
        return "Paused";
      case "in_progress":
        return "In Progress";
      default:
        return "Pending";
    }
  };

  const getStatusColor = () => {
    switch (project.status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case "paused":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
      case "in_progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">Migration Status</CardTitle>
          <div className={`px-3 py-1 rounded-full text-xs font-medium inline-flex items-center ${getStatusColor()}`}>
            {getStatusIcon()}
            <span className="ml-1">{getStatusText()}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          
          <div className="grid grid-cols-3 gap-3 pt-3">
            <div className="text-center">
              <p className="text-2xl font-semibold">{project.total_objects}</p>
              <p className="text-xs text-muted-foreground">Total Objects</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-semibold text-green-500">{project.migrated_objects}</p>
              <p className="text-xs text-muted-foreground">Migrated</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-semibold text-red-500">{project.failed_objects}</p>
              <p className="text-xs text-muted-foreground">Failed</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MigrationStatusCard;
