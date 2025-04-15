
import React, { Suspense } from "react";
import { useParams } from "react-router-dom";
import { DashboardProvider } from "@/components/migration/dashboard/context";
import DashboardHeader from "@/components/migration/dashboard/DashboardHeader";
import DashboardTabs from "@/components/migration/dashboard/DashboardTabs";
import Navbar from "@/components/layout/Navbar";
import { Skeleton } from "@/components/ui/skeleton";
import { LoadingFallback } from "@/components/pages/migration";

const MigrationDashboard = () => {
  const { id } = useParams<{ id: string }>();
  
  if (!id) {
    return <LoadingFallback error={new Error("Migration ID is missing")} />;
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
      <DashboardProvider projectId={id}>
        <div className="min-h-screen bg-gradient-to-b from-background to-slate-50 dark:from-background dark:to-slate-900/50 hero-gradient">
          <Navbar />
          <div className="container px-4 pt-32 pb-20">
            <DashboardHeader />
            <div className="mt-8">
              <DashboardTabs />
            </div>
          </div>
        </div>
      </DashboardProvider>
    </Suspense>
  );
};

export default MigrationDashboard;
