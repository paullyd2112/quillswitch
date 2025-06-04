
import React from 'react';
import { Button } from '@/components/ui/button';
import { Shield, Upload } from 'lucide-react';

interface MigrationActionsProps {
  onScan: () => void;
  onMigrate: () => void;
  isMigrating: boolean;
}

const MigrationActions: React.FC<MigrationActionsProps> = ({ 
  onScan, 
  onMigrate, 
  isMigrating 
}) => {
  return (
    <div className="flex gap-2">
      <Button onClick={onScan} variant="outline" className="flex-1">
        <Shield className="h-4 w-4 mr-2" />
        Scan for Credentials
      </Button>
      <Button onClick={onMigrate} disabled={isMigrating} className="flex-1">
        <Upload className="h-4 w-4 mr-2" />
        Start Migration
      </Button>
    </div>
  );
};

export default MigrationActions;
