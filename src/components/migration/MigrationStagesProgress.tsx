
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock, AlertCircle, Play, Pause } from "lucide-react";
import { MigrationStage } from "@/integrations/supabase/migrationTypes";

interface MigrationStagesProgressProps {
  stages: MigrationStage[];
}

const MigrationStagesProgress: React.FC<MigrationStagesProgressProps> = ({ stages }) => {
  const getStageIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "failed":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case "paused":
        return <Pause className="h-5 w-5 text-amber-500" />;
      case "in_progress":
        return <Play className="h-5 w-5 text-blue-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getConnectorClass = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "failed":
        return "bg-red-500";
      case "paused":
        return "bg-amber-500";
      case "in_progress":
        return "bg-blue-500";
      default:
        return "bg-gray-300 dark:bg-gray-700";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Migration Pipeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          {stages.map((stage, index) => (
            <div key={stage.id} className="relative">
              <div className="flex items-center">
                <div className={`z-10 flex items-center justify-center w-8 h-8 rounded-full ${
                  stage.status === "completed"
                    ? "bg-green-100 dark:bg-green-900/30"
                    : stage.status === "in_progress"
                    ? "bg-blue-100 dark:bg-blue-900/30"
                    : stage.status === "failed"
                    ? "bg-red-100 dark:bg-red-900/30"
                    : stage.status === "paused"
                    ? "bg-amber-100 dark:bg-amber-900/30"
                    : "bg-gray-100 dark:bg-gray-900/30"
                }`}>
                  {getStageIcon(stage.status)}
                </div>
                <div className="flex-1 ml-4">
                  <h3 className="text-base font-medium">{stage.name}</h3>
                  <p className="text-sm text-muted-foreground">{stage.description}</p>
                  {stage.status === "in_progress" && (
                    <div className="mt-1 bg-gray-200 dark:bg-gray-700 h-1.5 w-full rounded-full overflow-hidden">
                      <div 
                        className="bg-blue-500 h-1.5 rounded-full" 
                        style={{ width: `${stage.percentage_complete}%` }}
                      />
                    </div>
                  )}
                </div>
                <div className="ml-auto text-right">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    stage.status === "completed"
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                      : stage.status === "in_progress"
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                      : stage.status === "failed"
                      ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                      : stage.status === "paused"
                      ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                      : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
                  }`}>
                    {stage.status === "in_progress" ? `${stage.percentage_complete}%` : stage.status}
                  </span>
                </div>
              </div>
              
              {index < stages.length - 1 && (
                <div className="absolute left-4 top-8 -ml-0.5 w-0.5 h-10">
                  <div className={`h-full w-0.5 ${getConnectorClass(stage.status)}`}></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MigrationStagesProgress;
