import React from "react";
import { useParams } from "react-router-dom";
import { DashboardProvider } from "@/components/migration/dashboard/context";
import { MigrationDashboardContent } from "@/components/migration/dashboard/MigrationDashboardContent";

const MigrationDashboard = () => {
  const { id } = useParams<{ id: string }>();
  
  if (!id) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-2">Migration Not Found</h1>
          <p className="text-slate-400">The migration project ID is missing.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <DashboardProvider projectId={id}>
        <MigrationDashboardContent />
      </DashboardProvider>
    </div>
  );
};

export default MigrationDashboard;
