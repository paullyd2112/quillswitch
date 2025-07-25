
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Database, Users, ArrowUpRight, Activity, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useSessionContext } from '@supabase/auth-helpers-react';
import EnhancedContentSection from "@/components/layout/enhanced-content-section";
import MetricCard from "@/components/ui/metric-card";
import { EnhancedCard, CardContent, CardHeader, CardTitle } from "@/components/ui/enhanced-card";
import ProgressRing from "@/components/ui/progress-ring";
import StatusBadge from "@/components/ui/status-badge";
import DataTable from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { useDashboardFormatting } from "@/hooks/useDashboardFormatting";
import { SystemTestDashboard } from "@/components/testing/SystemTestDashboard";

const Dashboard = () => {
  const { session } = useSessionContext();
  const [realData, setRealData] = useState({
    migration_projects: [],
    migration_stages: [],
    migration_object_types: [],
    migration_errors: [],
    user_activities: []
  });
  const [isLoading, setIsLoading] = useState(true);

  // Load real user data instead of mock data
  useEffect(() => {
    const loadUserData = async () => {
      if (!session?.user) {
        setIsLoading(false);
        return;
      }

      try {
        // Load user's actual migration projects
        const { data: projects, error: projectsError } = await supabase
          .from('migration_projects')
          .select('*')
          .eq('user_id', session.user.id);

        if (projectsError) throw projectsError;

        // Load user's migration stages
        const { data: stages, error: stagesError } = await supabase
          .from('migration_stages')
          .select('*');

        if (stagesError) throw stagesError;

        // Load user's migration object types
        const { data: objectTypes, error: objectTypesError } = await supabase
          .from('migration_object_types')
          .select('*');

        if (objectTypesError) throw objectTypesError;

        // Load user's migration errors
        const { data: errors, error: errorsError } = await supabase
          .from('migration_errors')
          .select('*');

        if (errorsError) throw errorsError;

        // Load user's activities
        const { data: activities, error: activitiesError } = await supabase
          .from('user_activities')
          .select('*')
          .eq('user_id', session.user.id);

        if (activitiesError) throw activitiesError;

        setRealData({
          migration_projects: projects || [],
          migration_stages: stages || [],
          migration_object_types: objectTypes || [],
          migration_errors: errors || [],
          user_activities: activities || []
        });
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [session]);

  const { stats, projects } = useDashboardFormatting(realData);

  const recentProjects = projects.slice(0, 5);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const projectColumns = [
    {
      key: "name",
      label: "Project Name",
      render: (value: string) => (
        <div className="font-medium">{value}</div>
      )
    },
    {
      key: "status",
      label: "Status",
      render: (value: string, row: any) => (
        <StatusBadge status={row.statusColor}>
          {row.formattedStatus}
        </StatusBadge>
      )
    },
    {
      key: "progressPercentage",
      label: "Progress", 
      render: (value: number) => (
        <div className="flex items-center gap-2">
          <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${value}%` }}
            />
          </div>
          <span className="text-sm font-medium">{value}%</span>
        </div>
      )
    },
    {
      key: "formattedTotalRecords",
      label: "Records",
    },
    {
      key: "formattedCreatedAt",
      label: "Created",
      render: (value: string) => (
        <span className="text-sm text-muted-foreground">{value}</span>
      )
    }
  ];

  return (
    <>
      <Helmet>
        <title>Dashboard | QuillSwitch</title>
        <meta name="description" content="Monitor your CRM migration progress and performance" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <EnhancedContentSection
          title="Migration Dashboard"
          description="Monitor your CRM migration progress and performance in real-time"
          maxWidth="full"
          headerAction={
            <Button>
              <ArrowUpRight className="h-4 w-4 mr-2" />
              New Migration
            </Button>
          }
        >
          {/* Metrics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard
              title="Total Projects"
              value={stats.overview.totalProjects}
              description="All migration projects"
              icon={<Database className="h-5 w-5" />}
            />
            <MetricCard
              title="Active Migrations"
              value={stats.overview.activeProjects}
              description="Currently running"
              icon={<Activity className="h-5 w-5" />}
              trend={{ value: 12, isPositive: true }}
            />
            <MetricCard
              title="Success Rate"
              value={stats.overview.completionRate}
              description="Overall completion rate"
              icon={<TrendingUp className="h-5 w-5" />}
            />
            <MetricCard
              title="Records Migrated"
              value={stats.records.migrated}
              description="Total data transferred"
              icon={<Users className="h-5 w-5" />}
            />
          </div>

          {/* Progress Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <EnhancedCard className="p-6" variant="glass">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Migration Progress</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <ProgressRing 
                  progress={0} 
                  size={120}
                  color="hsl(var(--primary))"
                />
                <div className="mt-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    {realData.migration_projects.length === 0 
                      ? "No migrations started yet" 
                      : "No active migrations"
                    }
                  </p>
                </div>
              </CardContent>
            </EnhancedCard>

            <EnhancedCard className="p-6" variant="elevated">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-center py-8">
                <p className="text-sm text-muted-foreground">
                  {realData.user_activities.length === 0 
                    ? "No activity yet - start your first migration!" 
                    : "No recent activity"
                  }
                </p>
              </CardContent>
            </EnhancedCard>

            <EnhancedCard className="p-6" variant="gradient">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <Database className="h-4 w-4 mr-2" />
                  Start New Migration
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  Connect CRM System
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Activity className="h-4 w-4 mr-2" />
                  View Reports
                </Button>
              </CardContent>
            </EnhancedCard>
          </div>

          {/* System Test Dashboard */}
          <div className="mb-8">
            <SystemTestDashboard />
          </div>

          {/* Recent Projects Table */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Recent Projects</h2>
              <Button variant="outline">View All Projects</Button>
            </div>
            
            <DataTable
              data={recentProjects}
              columns={projectColumns}
              emptyMessage="No migration projects found. Connect a CRM and start your first migration to get started."
            />
          </div>
        </EnhancedContentSection>
      </div>
    </>
  );
};

export default Dashboard;
