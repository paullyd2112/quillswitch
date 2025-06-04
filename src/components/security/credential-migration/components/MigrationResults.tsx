
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, ArrowRight } from 'lucide-react';
import type { MigrationResults as MigrationResultsType } from '../hooks/useMigrationState';

interface MigrationResultsProps {
  results: MigrationResultsType;
  onReset: () => void;
}

const MigrationResults: React.FC<MigrationResultsProps> = ({ results, onReset }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{results.migrated}</div>
            <div className="text-sm text-muted-foreground">Credentials Migrated</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{results.errors.length}</div>
            <div className="text-sm text-muted-foreground">Errors</div>
          </CardContent>
        </Card>
      </div>

      {results.errors.length > 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-1">
              <p>Some items couldn't be migrated:</p>
              {results.errors.slice(0, 3).map((error, index) => (
                <p key={index} className="text-xs">• {error}</p>
              ))}
              {results.errors.length > 3 && (
                <p className="text-xs">... and {results.errors.length - 3} more</p>
              )}
            </div>
          </AlertDescription>
        </Alert>
      )}

      <Button onClick={onReset} variant="outline" className="w-full">
        <ArrowRight className="h-4 w-4 mr-2" />
        Run Another Scan
      </Button>
    </div>
  );
};

export default MigrationResults;
