
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import BaseLayout from '@/components/layout/BaseLayout';
import { Link } from 'react-router-dom';
import MigrationsTable from './MigrationsTable';
import { MigrationProject } from '@/integrations/supabase/migrationTypes';
import { getMigrationProjects } from '@/services/migration/projectService';

// Mock data for migrations with the correct shape to match MigrationProject type
const mockMigrations: MigrationProject[] = [
  {
    id: '1',
    user_id: 'user-1',
    company_name: 'Acme Corp',
    source_crm: 'HubSpot',
    destination_crm: 'Salesforce',
    migration_strategy: 'Full Migration',
    status: "completed",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    completed_at: new Date().toISOString(),
    total_objects: 100,
    migrated_objects: 100,
    failed_objects: 0
  },
  {
    id: '2',
    user_id: 'user-1',
    company_name: 'Beta Inc',
    source_crm: 'ActiveCampaign',
    destination_crm: 'MailChimp',
    migration_strategy: 'Selective Migration',
    status: "in_progress",
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
    completed_at: null,
    total_objects: 200,
    migrated_objects: 130,
    failed_objects: 0
  },
  {
    id: '3',
    user_id: 'user-1',
    company_name: 'Gamma LLC',
    source_crm: 'Zoho',
    destination_crm: 'HubSpot',
    migration_strategy: 'Incremental Migration',
    status: "failed",
    created_at: new Date(Date.now() - 172800000).toISOString(),
    updated_at: new Date(Date.now() - 172800000).toISOString(),
    completed_at: null,
    total_objects: 150,
    migrated_objects: 45,
    failed_objects: 10
  }
];

const MigrationsList = () => {
  return (
    <div className="container px-4 py-8 mx-auto max-w-7xl space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Your Migrations</h1>
        <Link to="/app/migrations/setup">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Migration
          </Button>
        </Link>
      </div>
      
      <MigrationsTable 
        projects={mockMigrations}
        isLoading={false}
      />
    </div>
  );
};

export default MigrationsList;
