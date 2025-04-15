
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import { XCircle, FileText, BarChart2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardProvider } from "@/components/migration/dashboard/context";
import DashboardHeader from "@/components/migration/dashboard/DashboardHeader";
import DashboardTabs from "@/components/migration/dashboard/DashboardTabs";
import { Card, CardContent } from "@/components/ui/card";
import { Container } from "@/components/ui/container";

const MigrationDashboard = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  if (!id) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-slate-50 dark:from-background dark:to-slate-900/50 hero-gradient">
        <Navbar />
        <Container className="px-4 pt-32 pb-20 flex items-center justify-center">
          <Card className="max-w-md w-full">
            <CardContent className="pt-6">
              <div className="text-center">
                <XCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
                <h2 className="text-xl font-medium">Migration project not found</h2>
                <p className="mt-2 text-muted-foreground">The migration project you're looking for doesn't exist or has been removed.</p>
                <Button className="mt-6" onClick={() => navigate("/migrations")}>
                  Back to Migrations
                </Button>
              </div>
            </CardContent>
          </Card>
        </Container>
      </div>
    );
  }

  return (
    <DashboardProvider projectId={id}>
      <div className="min-h-screen bg-gradient-to-b from-background to-slate-50 dark:from-background dark:to-slate-900/50 hero-gradient">
        <Navbar />
        
        <section className="pt-20 pb-8 md:pt-24 md:pb-10 relative">
          <Container className="px-4 md:px-6">
            <DashboardHeader />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
              <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                <CardContent className="flex items-center p-4">
                  <div className="rounded-full bg-green-100 dark:bg-green-800/30 p-2 mr-4">
                    <FileText className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-green-800 dark:text-green-300">Processed Records</p>
                    <p className="text-2xl font-bold text-green-900 dark:text-green-200">12,458</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                <CardContent className="flex items-center p-4">
                  <div className="rounded-full bg-blue-100 dark:bg-blue-800/30 p-2 mr-4">
                    <BarChart2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-800 dark:text-blue-300">Current Rate</p>
                    <p className="text-2xl font-bold text-blue-900 dark:text-blue-200">2,145/min</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
                <CardContent className="flex items-center p-4">
                  <div className="rounded-full bg-amber-100 dark:bg-amber-800/30 p-2 mr-4">
                    <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-amber-800 dark:text-amber-300">Validation Issues</p>
                    <p className="text-2xl font-bold text-amber-900 dark:text-amber-200">26</p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <DashboardTabs activeTab={activeTab} setActiveTab={setActiveTab} />
          </Container>
        </section>
      </div>
    </DashboardProvider>
  );
};

export default MigrationDashboard;
