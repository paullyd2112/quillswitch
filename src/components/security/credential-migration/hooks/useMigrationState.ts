
import { useState } from 'react';

export type MigrationStatus = 'idle' | 'scanning' | 'migrating' | 'complete';

export interface MigrationResults {
  migrated: number;
  errors: string[];
}

export const useMigrationState = () => {
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationStatus, setMigrationStatus] = useState<MigrationStatus>('idle');
  const [foundCredentials, setFoundCredentials] = useState<string[]>([]);
  const [migrationResults, setMigrationResults] = useState<MigrationResults | null>(null);

  const resetMigration = () => {
    setMigrationStatus('idle');
    setFoundCredentials([]);
    setMigrationResults(null);
  };

  return {
    isMigrating,
    setIsMigrating,
    migrationStatus,
    setMigrationStatus,
    foundCredentials,
    setFoundCredentials,
    migrationResults,
    setMigrationResults,
    resetMigration,
  };
};
