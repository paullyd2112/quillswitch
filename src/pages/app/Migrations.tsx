
import React from "react";
import { Helmet } from "react-helmet";
import { Plus, Download, Filter, Search } from "lucide-react";
import EnhancedContentSection from "@/components/layout/enhanced-content-section";
import { EnhancedCard, CardContent, CardHeader, CardTitle } from "@/components/ui/enhanced-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import StatusBadge from "@/components/ui/status-badge";
import DataTable from "@/components/ui/data-table";
import ProgressRing from "@/components/ui/progress-ring";

const Migrations = () => {
  const migrations = [
    {
      id: "1",
      name: "Salesforce to HubSpot Migration",
      source: "Salesforce",
      destination: "HubSpot", 
      status: "in_progress",
      progress: 75,
      totalRecords: 15000,
      migratedRecords: 11250,
      startDate: "2024-01-15",
      estimatedCompletion: "2024-01-18"
    },
    {
      id: "2",
      name: "Pipedrive to Salesforce Migration", 
      source: "Pipedrive",
      destination: "Salesforce",
      status: "completed",
      progress: 100,
      totalRecords: 8500,
      migratedRecords: 8500,
      startDate: "2024-01-10",
      estimatedCompletion: "2024-01-12"
    },
    {
      id: "3",
      name: "HubSpot to Monday.com Migration",
      source: "HubSpot", 
      destination: "Monday.com",
      status: "pending",
      progress: 0,
      totalRecords: 5200,
      migratedRecords: 0,
      startDate: "2024-01-20",
      estimatedCompletion: "2024-01-22"
    }
  ];

  const migrationColumns = [
    {
      key: "name",
      label: "Migration Name",
      render: (value: string, row: any) => (
        <div>
          <div className="font-medium">{value}</div>
          <div className="text-sm text-muted-foreground">
            {row.source} → {row.destination}
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
          'error': 'error'
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
      render: (value: number, row: any) => (
        <div className="flex items-center gap-3">
          <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${value}%` }}
            />
          </div>
          <span className="text-sm font-medium min-w-[3rem]">{value}%</span>
        </div>
      )
    },
    {
      key: "migratedRecords",
      label: "Records",
      render: (value: number, row: any) => (
        <div className="text-sm">
          <div className="font-medium">{value.toLocaleString()}</div>
          <div className="text-muted-foreground">of {row.totalRecords.toLocaleString()}</div>
        </div>
      )
    },
    {
      key: "startDate",
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
          <Button variant="outline" size="sm">View</Button>
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
            <Button>
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
                      <CardTitle className="text-xl">{activeMigration.name}</CardTitle>
                      <p className="text-muted-foreground">Currently running migration</p>
                    </div>
                    <StatusBadge status="active">In Progress</StatusBadge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex flex-col items-center">
                      <ProgressRing 
                        progress={activeMigration.progress}
                        size={100}
                        showPercentage={true}
                      />
                      <p className="text-sm text-muted-foreground mt-2">Overall Progress</p>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Records Migrated</p>
                        <p className="text-2xl font-bold">
                          {activeMigration.migratedRecords.toLocaleString()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          of {activeMigration.totalRecords.toLocaleString()} total
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Estimated Completion</p>
                        <p className="text-lg font-semibold">
                          {new Date(activeMigration.estimatedCompletion).toLocaleDateString()}
                        </p>
                      </div>
                      <Button className="w-full">View Details</Button>
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
            emptyMessage="No migrations found. Start your first migration to get started."
          />
        </EnhancedContentSection>
      </div>
    </>
  );
};

export default Migrations;
