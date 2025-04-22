
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MigrationProject } from "@/integrations/supabase/migrationTypes";
import MigrationStatus from "./MigrationStatus";
import { format } from "date-fns";

interface MigrationsTableProps {
  projects: MigrationProject[];
  isLoading: boolean;
}

const MigrationsTable = ({ projects, isLoading }: MigrationsTableProps) => {
  const navigate = useNavigate();

  if (isLoading) {
    return Array.from({ length: 3 }).map((_, index) => (
      <Card key={`skeleton-${index}`} className="relative cursor-pointer hover:shadow-md transition-shadow duration-200">
        <CardContent className="p-6">
          <div className="h-7 w-3/4 bg-muted animate-pulse rounded"></div>
          <div className="h-5 w-1/2 bg-muted animate-pulse rounded mt-2"></div>
          <div className="flex justify-between mb-4 mt-4">
            <div className="h-6 w-1/3 bg-muted animate-pulse rounded"></div>
            <div className="h-6 w-1/4 bg-muted animate-pulse rounded"></div>
          </div>
          <div className="h-4 w-5/6 bg-muted animate-pulse rounded mb-2"></div>
          <div className="h-4 w-4/6 bg-muted animate-pulse rounded"></div>
        </CardContent>
      </Card>
    ));
  }

  if (projects.length === 0) {
    return (
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
            <Database className="h-4 w-4" />
            <span>Start Migration Project</span>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {projects.map((project) => (
        <Card 
          key={project.id}
          className="relative overflow-hidden cursor-pointer hover:shadow-md transition-shadow duration-200"
          onClick={() => navigate(`/migrations/${project.id}`)}
        >
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-medium text-lg">{project.company_name}</h3>
                <p className="text-sm text-muted-foreground">
                  {project.source_crm} to {project.destination_crm}
                </p>
              </div>
              <MigrationStatus status={project.status} />
            </div>
            
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
              
              <div className="pt-4 mt-4 border-t flex justify-between items-center text-sm text-muted-foreground">
                <span>Created: {format(new Date(project.created_at), "MMM d, yyyy")}</span>
                <Button size="sm" variant="ghost" className="gap-1">View Details</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
};

export default MigrationsTable;
