
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ContentSection from "@/components/layout/ContentSection";
import FadeIn from "@/components/animations/FadeIn";
import { Button } from "@/components/ui/button";
import { PlusCircle, RefreshCw } from "lucide-react";
import MigrationCard from "./MigrationCard";
import MigrationsTable from "./MigrationsTable";
import { getMigrationProjects } from "@/services/migrationService";
import { MigrationProject } from "@/integrations/supabase/migrationTypes";
import BaseLayout from "@/components/layout/BaseLayout";

const MigrationsList = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState<MigrationProject[]>([]);

  useEffect(() => {
    fetchProjects();
  }, []);

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

  return (
    <BaseLayout className="bg-gradient-to-b from-background to-slate-50 dark:from-background dark:to-slate-900/50 hero-gradient">
      <section className="pt-16 pb-20 relative">
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
              <MigrationCard isCreateCard />
              <MigrationsTable 
                projects={projects} 
                isLoading={isLoading} 
              />
            </div>
          </FadeIn>
        </div>
      </section>
    </BaseLayout>
  );
};

export default MigrationsList;
