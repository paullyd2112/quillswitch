import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import ContentSection from "@/components/layout/ContentSection";
import FadeIn from "@/components/animations/FadeIn";
import { Button } from "@/components/ui/button";
import { 
  PlusCircle, 
  Database, 
  ArrowRightCircle, 
  RefreshCw,
  Settings,
  Calendar,
  BadgeCheck,
  PauseCircle,
  AlertTriangle,
  Play,
  Server
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { MigrationProject } from "@/integrations/supabase/migrationTypes";
import { getMigrationProjects } from "@/services/migrationService";
import { format } from "date-fns";

const MigrationsList = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState<MigrationProject[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        const data = await getMigrationProjects();
        setProjects(data);
      } catch (error) {
        console.error("Error fetching migration projects:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <BadgeCheck className="h-5 w-5 text-green-500" />;
      case "in_progress":
        return <Play className="h-5 w-5 text-blue-500" />;
      case "paused":
        return <PauseCircle className="h-5 w-5 text-amber-500" />;
      case "failed":
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <Calendar className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Completed";
      case "in_progress":
        return "In Progress";
      case "paused":
        return "Paused";
      case "failed":
        return "Failed";
      default:
        return "Pending";
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "in_progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "paused":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-slate-50 dark:from-background dark:to-slate-900/50 hero-gradient">
      <Navbar />
      
      <section className="pt-32 pb-20 md:pt-40 relative">
        <div className="container px-4 md:px-6">
          <FadeIn>
            <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                  CRM Migrations
                </h1>
                <p className="text-muted-foreground mt-1">
                  Manage and monitor your CRM migration projects
                </p>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button 
                  onClick={() => navigate("/migrations/setup")}
                  className="gap-2"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>Start New Migration</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="gap-2"
                  onClick={() => navigate("/migrations/enterprise-test")}
                >
                  <Server className="h-4 w-4" />
                  <span>Enterprise Test</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="gap-2"
                  onClick={() => setIsLoading(true)}
                >
                  <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                  <span>Refresh</span>
                </Button>
              </div>
            </div>
          </FadeIn>
          
          <FadeIn delay="100">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Create new migration card */}
              <Card className="relative overflow-hidden group cursor-pointer hover:shadow-md transition-shadow duration-200"
                    onClick={() => navigate("/migrations/setup")}>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/20 opacity-50"></div>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PlusCircle className="h-5 w-5 text-primary" />
                    Create New Migration
                  </CardTitle>
                  <CardDescription>
                    Set up a new CRM data migration project
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center py-8">
                    <Database className="h-16 w-16 text-muted-foreground/50 group-hover:text-primary transition-colors duration-200" />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div></div>
                  <Button variant="ghost" className="gap-2 group-hover:text-primary transition-colors duration-200">
                    <span>Get Started</span>
                    <ArrowRightCircle className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
              
              {/* Enterprise capability test card */}
              <Card className="relative overflow-hidden group cursor-pointer hover:shadow-md transition-shadow duration-200"
                    onClick={() => navigate("/migrations/enterprise-test")}>
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/20 opacity-50"></div>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Server className="h-5 w-5 text-primary" />
                    Enterprise Capability Test
                  </CardTitle>
                  <CardDescription>
                    Test system capacity for large migrations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center py-8">
                    <Settings className="h-16 w-16 text-muted-foreground/50 group-hover:text-primary transition-colors duration-200" />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div></div>
                  <Button variant="ghost" className="gap-2 group-hover:text-primary transition-colors duration-200">
                    <span>Run Test</span>
                    <ArrowRightCircle className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
              
              {/* Existing migrations */}
              {isLoading ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <Card key={`skeleton-${index}`} className="relative cursor-pointer hover:shadow-md transition-shadow duration-200">
                    <CardHeader>
                      <div className="h-7 w-3/4 bg-muted animate-pulse rounded"></div>
                      <div className="h-5 w-1/2 bg-muted animate-pulse rounded mt-2"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between mb-4">
                        <div className="h-6 w-1/3 bg-muted animate-pulse rounded"></div>
                        <div className="h-6 w-1/4 bg-muted animate-pulse rounded"></div>
                      </div>
                      <div className="h-4 w-5/6 bg-muted animate-pulse rounded mb-2"></div>
                      <div className="h-4 w-4/6 bg-muted animate-pulse rounded"></div>
                    </CardContent>
                    <CardFooter>
                      <div className="h-9 w-full bg-muted animate-pulse rounded"></div>
                    </CardFooter>
                  </Card>
                ))
              ) : projects.length > 0 ? (
                projects.map((project) => (
                  <Card 
                    key={project.id} 
                    className="relative overflow-hidden cursor-pointer hover:shadow-md transition-shadow duration-200"
                    onClick={() => navigate(`/migrations/${project.id}`)}
                  >
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle>{project.company_name}</CardTitle>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1 ${getStatusClass(project.status)}`}>
                          {getStatusIcon(project.status)}
                          {getStatusText(project.status)}
                        </span>
                      </div>
                      <CardDescription>
                        {project.source_crm} to {project.destination_crm}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Strategy:</span>
                          <span className="font-medium">{project.migration_strategy}</span>
                        </div>
                        
                        <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              project.status === "completed" 
                                ? "bg-green-500" 
                                : project.status === "failed" 
                                ? "bg-red-500"
                                : "bg-blue-500"
                            }`}
                            style={{ 
                              width: `${project.total_objects ? Math.floor((project.migrated_objects / project.total_objects) * 100) : 0}%` 
                            }}
                          ></div>
                        </div>
                        
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            {project.migrated_objects.toLocaleString()} of {project.total_objects.toLocaleString()} objects
                          </span>
                          <span className="font-medium">
                            {project.total_objects 
                              ? Math.floor((project.migrated_objects / project.total_objects) * 100) 
                              : 0}%
                          </span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <div className="w-full flex justify-between items-center text-sm text-muted-foreground">
                        <span>Created: {format(new Date(project.created_at), "MMM d, yyyy")}</span>
                        <Button size="sm" variant="ghost" className="gap-1">
                          <span>View Details</span>
                          <ArrowRightCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <Card className="md:col-span-3">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Database className="h-16 w-16 text-muted-foreground/30 mb-4" />
                    <h3 className="text-xl font-medium">No Migration Projects</h3>
                    <p className="text-muted-foreground mt-2 mb-6 text-center max-w-md">
                      You haven't created any migration projects yet. Start by creating your first CRM migration.
                    </p>
                    <Button 
                      onClick={() => navigate("/migrations/setup")}
                      className="gap-2"
                    >
                      <PlusCircle className="h-4 w-4" />
                      <span>Start Migration Project</span>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
};

export default MigrationsList;
