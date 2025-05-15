
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BaseLayout from '@/components/layout/BaseLayout';
import ContentSection from '@/components/layout/ContentSection';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { mockMigrations } from "@/assets/mockData";
import MigrationsTable from '@/components/migrations/MigrationsTable';

const MigrationsList = () => {
  const navigate = useNavigate();
  const [migrations] = useState(mockMigrations);

  const handleCreateMigration = () => {
    navigate('/app/migrations/setup');
  };

  return (
    <BaseLayout>
      <div className="container px-4 py-8">
        <ContentSection>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold">Your Migrations</h1>
              <p className="text-muted-foreground">
                Manage and monitor your CRM migration projects
              </p>
            </div>
            <Button onClick={handleCreateMigration} className="gap-2">
              <Plus size={16} />
              New Migration
            </Button>
          </div>

          <MigrationsTable 
            projects={migrations}
            isLoading={false}
          />
        </ContentSection>
      </div>
    </BaseLayout>
  );
};

export default MigrationsList;
