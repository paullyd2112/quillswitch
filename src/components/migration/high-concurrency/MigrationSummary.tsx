
import React from 'react';
import { Database } from 'lucide-react';
import { CrmSource } from '../MultiSourceSelection';

interface MigrationSummaryProps {
  totalContacts: number;
  totalAccounts: number;
  totalOpportunities: number;
  totalCustomObjects: number;
  totalConcurrency: number;
  selectedSourcesCount: number;
}

const MigrationSummary: React.FC<MigrationSummaryProps> = ({
  totalContacts,
  totalAccounts,
  totalOpportunities,
  totalCustomObjects,
  totalConcurrency,
  selectedSourcesCount
}) => {
  return (
    <div>
      <h4 className="text-lg font-medium mb-4 flex items-center gap-2">
        <Database className="h-5 w-5 text-primary" />
        <span>Migration Summary</span>
      </h4>
      
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div className="bg-accent/30 p-4 rounded-md">
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-sm">Total Contacts:</span>
              <span className="font-medium">{totalContacts.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Total Accounts:</span>
              <span className="font-medium">{totalAccounts.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Total Opportunities:</span>
              <span className="font-medium">{totalOpportunities.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Total Custom Objects:</span>
              <span className="font-medium">{totalCustomObjects.toLocaleString()}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-accent/30 p-4 rounded-md">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold">Total Concurrent Integrations</span>
            <span className="font-bold text-primary">{totalConcurrency}</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Testing with this configuration will simulate running {totalConcurrency} 
            integrations simultaneously across different tiers.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MigrationSummary;
