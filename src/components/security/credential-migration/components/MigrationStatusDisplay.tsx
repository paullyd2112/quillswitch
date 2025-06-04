
import React from 'react';
import { Shield, Upload, CheckCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import type { MigrationStatus } from '../hooks/useMigrationState';

interface MigrationStatusDisplayProps {
  status: MigrationStatus;
}

const MigrationStatusDisplay: React.FC<MigrationStatusDisplayProps> = ({ status }) => {
  if (status === 'scanning') {
    return (
      <div className="text-center py-8">
        <Shield className="h-8 w-8 animate-pulse mx-auto mb-4" />
        <p className="text-lg font-medium">Scanning for credentials...</p>
      </div>
    );
  }

  if (status === 'migrating') {
    return (
      <div className="space-y-4">
        <div className="text-center">
          <Upload className="h-8 w-8 animate-bounce mx-auto mb-4" />
          <p className="text-lg font-medium">Migrating credentials to secure storage...</p>
          <p className="text-sm text-muted-foreground">This may take a moment</p>
        </div>
        <Progress value={50} className="w-full" />
      </div>
    );
  }

  if (status === 'complete') {
    return (
      <div className="text-center">
        <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-4" />
        <p className="text-lg font-medium">Migration Complete!</p>
      </div>
    );
  }

  return null;
};

export default MigrationStatusDisplay;
