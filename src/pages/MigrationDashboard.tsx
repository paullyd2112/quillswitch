
import React, { Suspense } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardProvider } from "@/components/migration/dashboard/context";
import DashboardHeader from "@/components/migration/dashboard/DashboardHeader";
import DashboardTabs from "@/components/migration/dashboard/DashboardTabs";
import { UserPresenceIndicator } from "@/components/realtime/UserPresenceIndicator";
import { RealtimeMigrationProgress } from "@/components/realtime/RealtimeMigrationProgress";
import { LoadingFallback } from "@/components/pages/migration";
import ProgressIndicator from "@/components/connection-hub/ProgressIndicator";

const MigrationDashboard = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Handle case when ID is missing
  if (!id) {
    return (
      <LoadingFallback 
        error={new Error("Migration ID is missing")} 
        onRetry={() => navigate("/migrations")} 
      />
    );
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
      <DashboardProvider projectId={id}>
        <div className="min-h-screen bg-gradient-to-b from-background to-slate-50 dark:from-background dark:to-slate-900/50 hero-gradient">
          <div className="container px-4 pt-8 pb-20">
            <div className="flex items-center justify-between mb-8">
              <DashboardHeader />
              <UserPresenceIndicator 
                projectId={id} 
                showCount={true}
                maxVisible={5}
              />
            </div>
            
            <div className="grid gap-6">
              <RealtimeMigrationProgress projectId={id} />
              <ProgressIndicator />
            </div>
            
            <div className="mt-8">
              <DashboardTabs activeTab="overview" setActiveTab={() => {}} />
            </div>
          </div>
        </div>
      </DashboardProvider>
    </Suspense>
  );
};

export default MigrationDashboard;
