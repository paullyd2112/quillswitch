
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import BaseLayout from '@/components/layout/BaseLayout';
import { Link } from 'react-router-dom';
import MigrationsTable from './MigrationsTable';

// Mock data for migrations
const mockMigrations = [
  {
    id: '1',
    name: 'HubSpot to Salesforce',
    status: 'completed',
    progress: 100,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'ActiveCampaign to MailChimp',
    status: 'in-progress',
    progress: 65,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '3',
    name: 'Zoho to HubSpot',
    status: 'failed',
    progress: 30,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  }
];

const MigrationsList = () => {
  return (
    <BaseLayout>
      <div className="container px-4 py-8 mx-auto max-w-7xl space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Your Migrations</h1>
          <Link to="/migrations/setup">
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
    </BaseLayout>
  );
};

export default MigrationsList;
