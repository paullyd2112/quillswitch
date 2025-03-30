
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import ContentSection from "@/components/layout/ContentSection";
import FadeIn from "@/components/animations/FadeIn";
import GlassPanel from "@/components/ui-elements/GlassPanel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Pause,
  RefreshCw,
  PanelRight,
  BarChart
} from "lucide-react";
import { MigrationProject } from "@/integrations/supabase/migrationTypes";
import { getMigrationProjects, getProjectProgress } from "@/services/migrationService";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";

const MigrationsList = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [projects, setProjects] = useState<MigrationProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      const data = await getMigrationProjects();
      setProjects(data);
      setIsLoading(false);
    };

    fetchProjects();
  }, [toast]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "in_progress":
        return <RefreshCw className="h-5 w-5 text-blue-500" />;
      case "pending":
        return <Clock className="h-5 w-5 text-gray-500" />;
      case "failed":
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case "paused":
        return <Pause className="h-5 w-5 text-amber-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Completed";
      case "in_progress":
        return "In Progress";
      case "pending":
        return "Pending";
      case "failed":
        return "Failed";
      case "paused":
        return "Paused";
      default:
        return "Unknown";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "in_progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "pending":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case "paused":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM d, yyyy");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-slate-50 dark:from-background dark:to-slate-900/50 hero-gradient">
      <Navbar />
      
      <section className="pt-32 pb-8 md:pt-40 md:pb-10 relative">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <FadeIn>
              <Badge className="mb-4 bg-brand-100 text-brand-700 hover:bg-brand-200 dark:bg-brand-900/30 dark:text-brand-400 dark:hover:bg-brand-900/40">
                Migration Hub
              </Badge>
            </FadeIn>
            <FadeIn delay="100">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
                CRM Migration Projects
              </h1>
            </FadeIn>
            <FadeIn delay="200">
              <p className="text-xl text-muted-foreground mb-8">
                Manage and monitor all your CRM migration projects from a single dashboard
              </p>
            </FadeIn>
          </div>
        </div>
      </section>
      
      <ContentSection className="py-8 pb-32">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Your Migration Projects</h2>
          <Button onClick={() => navigate("/setup")}>
            <Plus className="h-4 w-4 mr-2" />
            New Migration
          </Button>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="h-8 w-8 animate-spin text-brand-500" />
            <span className="ml-2 text-lg">Loading projects...</span>
          </div>
        ) : projects.length > 0 ? (
          <div className="space-y-4">
            {projects.map((project) => (
              <GlassPanel key={project.id} className="hover:bg-muted/50 transition-colors">
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold">{project.company_name}</h3>
                        <div className={`px-2.5 py-0.5 rounded-full text-xs font-medium inline-flex items-center ${getStatusColor(project.status)}`}>
                          {getStatusIcon(project.status)}
                          <span className="ml-1">{getStatusText(project.status)}</span>
                        </div>
                      </div>
                      
                      <p className="text-muted-foreground">
                        {project.source_crm} to {project.destination_crm} Migration
                      </p>
                      
                      <p className="text-sm text-muted-foreground">
                        Created on {formatDate(project.created_at)}
                      </p>
                    </div>
                    
                    <div className="w-full md:w-64">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>{getProjectProgress(project)}%</span>
                      </div>
                      <Progress value={getProjectProgress(project)} className="h-2" />
                    </div>
                    
                    <div className="flex gap-2 mt-4 md:mt-0">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/migrations/reports/${project.id}`)}
                      >
                        <BarChart className="h-4 w-4 mr-1" />
                        Reports
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => navigate(`/migrations/${project.id}`)}
                      >
                        <PanelRight className="h-4 w-4 mr-1" />
                        Dashboard
                      </Button>
                    </div>
                  </div>
                </div>
              </GlassPanel>
            ))}
          </div>
        ) : (
          <GlassPanel className="p-8 text-center">
            <div className="max-w-md mx-auto">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                <PanelRight className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-medium mb-2">No Migration Projects Yet</h3>
              <p className="text-muted-foreground mb-6">
                You haven't created any CRM migration projects. Start your first migration to track 
                its progress and monitor the results.
              </p>
              <Button onClick={() => navigate("/setup")}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Migration
              </Button>
            </div>
          </GlassPanel>
        )}
      </ContentSection>
    </div>
  );
};

export default MigrationsList;
