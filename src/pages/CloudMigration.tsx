
import React, { useState } from 'react';
import { Container } from '@/components/ui/container';
import CloudMigrationSetup from '@/components/migration/CloudMigrationSetup';
import CloudMigrationDashboard from '@/components/migration/CloudMigrationDashboard';
import { CloudMigrationRequest } from '@/services/cloud/CloudMigrationService';

const CloudMigration: React.FC = () => {
  const [migrationConfig, setMigrationConfig] = useState<CloudMigrationRequest | null>(null);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);

  const handleSetupComplete = (config: CloudMigrationRequest & { schedule?: any }) => {
    setMigrationConfig(config);
    setCurrentProjectId(config.projectId);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8">
      <Container>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            Cloud Migration Platform
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Run your CRM migrations completely in the cloud - independent, reliable, and always available
          </p>
        </div>

        {!migrationConfig ? (
          <CloudMigrationSetup onSetupComplete={handleSetupComplete} />
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Migration Dashboard</h2>
              <button
                onClick={() => {
                  setMigrationConfig(null);
                  setCurrentProjectId(null);
                }}
                className="text-primary hover:underline"
              >
                Start New Migration
              </button>
            </div>
            
            <CloudMigrationDashboard
              projectId={currentProjectId!}
              migrationConfig={migrationConfig}
              workspaceId="default-workspace" // You would get this from user context
            />
          </div>
        )}
      </Container>
    </div>
  );
};

export default CloudMigration;
