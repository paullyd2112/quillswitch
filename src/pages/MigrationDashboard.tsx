
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardProvider } from "@/components/migration/dashboard/context";
import DashboardHeader from "@/components/migration/dashboard/DashboardHeader";
import DashboardTabs from "@/components/migration/dashboard/DashboardTabs";

const MigrationDashboard = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  if (!projectId) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-slate-50 dark:from-background dark:to-slate-900/50 hero-gradient">
        <Navbar />
        <div className="container px-4 pt-32 pb-20 flex items-center justify-center">
          <div className="text-center">
            <XCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
            <h2 className="text-xl font-medium">Migration project not found</h2>
            <p className="mt-2 text-muted-foreground">The migration project you're looking for doesn't exist or has been removed.</p>
            <Button className="mt-6" onClick={() => navigate("/migrations")}>
              Back to Migrations
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <DashboardProvider projectId={projectId}>
      <div className="min-h-screen bg-gradient-to-b from-background to-slate-50 dark:from-background dark:to-slate-900/50 hero-gradient">
        <Navbar />
        
        <section className="pt-32 pb-8 md:pt-40 md:pb-10 relative">
          <div className="container px-4 md:px-6">
            <DashboardHeader />
            <DashboardTabs activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>
        </section>
      </div>
    </DashboardProvider>
  );
};

export default MigrationDashboard;
