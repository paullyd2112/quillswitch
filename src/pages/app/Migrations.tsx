
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Plus, Download, Filter, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import EnhancedContentSection from "@/components/layout/enhanced-content-section";
import { EnhancedCard, CardContent, CardHeader, CardTitle } from "@/components/ui/enhanced-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import StatusBadge from "@/components/ui/status-badge";
import DataTable from "@/components/ui/data-table";
import ProgressRing from "@/components/ui/progress-ring";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Migrations = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Fetch migrations from the database
  const { data: migrations = [], isLoading, error } = useQuery({
    queryKey: ['migration-projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('migration_projects')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  // Show error if query failed
  useEffect(() => {
    if (error) {
      toast({
        title: "Error loading migrations",
        description: error.message,
        variant: "destructive"
      });
    }
  }, [error, toast]);

  const migrationColumns = [
    {
      key: "company_name",
      label: "Company & Migration",
      render: (value: string, row: any) => (
        <div>
          <div className="font-medium">{value || 'Unnamed Project'}</div>
          <div className="text-sm text-muted-foreground">
            {row.source_crm} → {row.destination_crm}
          </div>
        </div>
      )
    },
    {
      key: "status",
      label: "Status",
      render: (value: string) => {
        const statusMap: Record<string, any> = {
          'in_progress': 'active',
          'completed': 'success',
          'pending': 'pending',
          'failed': 'error'
        };
        return (
          <StatusBadge status={statusMap[value] || 'inactive'}>
            {value.replace('_', ' ')}
          </StatusBadge>
        );
      }
    },
    {
      key: "progress",
      label: "Progress",
      render: (value: number, row: any) => {
        const progress = row.total_objects > 0 
          ? Math.round((row.migrated_objects / row.total_objects) * 100)
          : 0;
        
        return (
          <div className="flex items-center gap-3">
            <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-sm font-medium min-w-[3rem]">{progress}%</span>
          </div>
        );
      }
    },
    {
      key: "migrated_objects",
      label: "Records",
      render: (value: number, row: any) => (
        <div className="text-sm">
          <div className="font-medium">{(value || 0).toLocaleString()}</div>
          <div className="text-muted-foreground">of {(row.total_objects || 0).toLocaleString()}</div>
        </div>
      )
    },
    {
      key: "created_at",
      label: "Start Date",
      render: (value: string) => (
        <span className="text-sm">{new Date(value).toLocaleDateString()}</span>
      )
    },
    {
      key: "actions",
      label: "Actions",
      render: (value: any, row: any) => (
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate(`/app/migrations/${row.id}`)}
          >
            View
          </Button>
          {row.status === 'completed' && (
            <Button variant="outline" size="sm">
              <Download className="h-3 w-3" />
            </Button>
          )}
        </div>
      )
    }
  ];

  const activeMigration = migrations.find(m => m.status === 'in_progress');

  return (
    <>
      <Helmet>
        <title>Migrations | QuillSwitch</title>
        <meta name="description" content="Monitor and manage your CRM data migrations" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <EnhancedContentSection
          title="Migration Management"
          description="Monitor, manage, and track all your CRM data migrations in one place"
          maxWidth="full"
          headerAction={
            <Button onClick={() => navigate('/app/setup')}>
              <Plus className="h-4 w-4 mr-2" />
              New Migration
            </Button>
          }
        >
          {/* Active Migration Status */}
          {activeMigration && (
            <div className="mb-8">
              <EnhancedCard variant="gradient" className="border-l-4 border-l-primary">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">
                        {activeMigration.company_name || 'Active Migration'}
                      </CardTitle>
                      <p className="text-muted-foreground">Currently running migration</p>
                    </div>
                    <StatusBadge status="active">In Progress</StatusBadge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex flex-col items-center">
                      <ProgressRing 
                        progress={activeMigration.total_objects > 0 
                          ? Math.round((activeMigration.migrated_objects / activeMigration.total_objects) * 100)
                          : 0
                        }
                        size={100}
                        showPercentage={true}
                      />
                      <p className="text-sm text-muted-foreground mt-2">Overall Progress</p>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Records Migrated</p>
                        <p className="text-2xl font-bold">
                          {(activeMigration.migrated_objects || 0).toLocaleString()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          of {(activeMigration.total_objects || 0).toLocaleString()} total
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Migration Type</p>
                        <p className="text-lg font-semibold">
                          {activeMigration.migration_strategy || 'Standard'}
                        </p>
                      </div>
                      <Button 
                        className="w-full"
                        onClick={() => navigate(`/app/migrations/${activeMigration.id}`)}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </EnhancedCard>
            </div>
          )}

          {/* Search and Filters */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search migrations..."
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </div>

          {/* Migrations Table */}
          <DataTable
            data={migrations}
            columns={migrationColumns}
            loading={isLoading}
            emptyMessage="No migrations found. Start your first migration to get started."
          />

          {/* Empty State for new users */}
          {!isLoading && migrations.length === 0 && (
            <div className="mt-8">
              <EnhancedCard className="p-12 text-center">
                <div className="max-w-md mx-auto">
                  <div className="mb-4">
                    <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Plus className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No migrations yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Get started by creating your first CRM migration project.
                  </p>
                  <Button 
                    onClick={() => navigate('/app/setup')}
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Start Your First Migration
                  </Button>
                </div>
              </EnhancedCard>
            </div>
          )}
        </EnhancedContentSection>
      </div>
    </>
  );
};

export default Migrations;
