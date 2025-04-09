
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  PauseCircle, 
  PlayCircle, 
  RefreshCw, 
  DownloadCloud
} from "lucide-react";
import { useDashboard } from "./context";
import NotificationsPanel from "../NotificationsPanel";

const DashboardHeader: React.FC = () => {
  const navigate = useNavigate();
  const { project, isProcessing, handleToggleMigrationStatus } = useDashboard();

  if (!project) return null;

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1"
            onClick={() => navigate("/migrations")}
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Button>
          <Badge className="bg-brand-100 text-brand-700 hover:bg-brand-200 dark:bg-brand-900/30 dark:text-brand-400 dark:hover:bg-brand-900/40">
            Migration
          </Badge>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          {project.company_name}
        </h1>
        <p className="text-muted-foreground mt-1">
          {project.source_crm} to {project.destination_crm} Migration
        </p>
      </div>
      
      <div className="flex flex-wrap items-center gap-2">
        <NotificationsPanel projectId={project.id} />
        
        <Button
          variant={project.status === "in_progress" ? "outline" : "default"}
          className="gap-2"
          onClick={handleToggleMigrationStatus}
          disabled={isProcessing || project.status === "completed" || project.status === "failed"}
        >
          {project.status === "in_progress" ? (
            <>
              <PauseCircle className="h-4 w-4" />
              <span>Pause Migration</span>
            </>
          ) : (
            <>
              <PlayCircle className="h-4 w-4" />
              <span>Resume Migration</span>
            </>
          )}
        </Button>
        <Button variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          <span>Refresh Data</span>
        </Button>
        <Button variant="outline" className="gap-2">
          <DownloadCloud className="h-4 w-4" />
          <span>Export Report</span>
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
