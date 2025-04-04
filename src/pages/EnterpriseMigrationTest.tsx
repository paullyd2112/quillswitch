
import React from "react";
import { Helmet } from "react-helmet";
import Navbar from "@/components/layout/Navbar";
import ContentSection from "@/components/layout/ContentSection";
import FadeIn from "@/components/animations/FadeIn";
import EnterpriseMigrationCapabilityTest from "@/components/migration/EnterpriseMigrationCapabilityTest";
import { ArrowLeft, Cpu, Database, Server } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const EnterpriseMigrationTest = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-slate-50 dark:from-background dark:to-slate-900/50 hero-gradient">
      <Helmet>
        <title>Enterprise Migration Capability Test | CRM Migration Platform</title>
      </Helmet>
      
      <Navbar />
      
      <ContentSection className="pt-32 pb-20">
        <div className="container px-4">
          <FadeIn>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1 mb-2"
                  onClick={() => navigate("/migrations")}
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to Migrations</span>
                </Button>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                  Enterprise Migration Testing
                </h1>
                <p className="text-muted-foreground mt-1">
                  Test and validate the system's capabilities for enterprise-scale migrations
                </p>
              </div>
            </div>
          </FadeIn>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <FadeIn delay="100">
              <div className="bg-card/60 p-6 rounded-lg border shadow-sm">
                <Cpu className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Performance Testing</h3>
                <p className="text-muted-foreground">
                  Measure throughput, memory usage, and processing capabilities under various loads
                </p>
              </div>
            </FadeIn>
            
            <FadeIn delay="150">
              <div className="bg-card/60 p-6 rounded-lg border shadow-sm">
                <Database className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Data Volume Limits</h3>
                <p className="text-muted-foreground">
                  Determine maximum data volumes that can be processed within time constraints
                </p>
              </div>
            </FadeIn>
            
            <FadeIn delay="200">
              <div className="bg-card/60 p-6 rounded-lg border shadow-sm">
                <Server className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Resource Utilization</h3>
                <p className="text-muted-foreground">
                  Analyze system resource utilization and identify potential bottlenecks
                </p>
              </div>
            </FadeIn>
          </div>
          
          <FadeIn delay="250">
            <EnterpriseMigrationCapabilityTest />
          </FadeIn>
        </div>
      </ContentSection>
    </div>
  );
};

export default EnterpriseMigrationTest;
