
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Info } from 'lucide-react';
import { secureCredentialService } from '@/services/security/secureCredentialService';
import { enhancedSecurityAuditor } from '@/utils/security/enhancedSecurityAuditor';
import { toast } from 'sonner';
import { useMigrationState } from './hooks/useMigrationState';
import { useCredentialScanner } from './hooks/useCredentialScanner';
import MigrationStatusDisplay from './components/MigrationStatusDisplay';
import MigrationActions from './components/MigrationActions';
import FoundCredentialsList from './components/FoundCredentialsList';
import MigrationResults from './components/MigrationResults';
import SecurityBenefits from './components/SecurityBenefits';

const CredentialMigrationHelper = () => {
  const {
    isMigrating,
    setIsMigrating,
    migrationStatus,
    setMigrationStatus,
    foundCredentials,
    setFoundCredentials,
    migrationResults,
    setMigrationResults,
    resetMigration,
  } = useMigrationState();

  const { scanForCredentials } = useCredentialScanner();

  const handleScan = () => {
    setMigrationStatus('scanning');
    const credentials = scanForCredentials();
    setFoundCredentials(credentials);
    setTimeout(() => setMigrationStatus('idle'), 1000);
  };

  const handleMigration = async () => {
    setIsMigrating(true);
    setMigrationStatus('migrating');
    
    try {
      // First, clean up demo data
      enhancedSecurityAuditor.cleanupDemoData();
      
      // Then migrate legitimate credentials
      const result = await secureCredentialService.migrateLocalStorageCredentials();
      setMigrationResults(result);
      
      if (result.success) {
        setMigrationStatus('complete');
        toast.success(`Migration completed! ${result.migrated} credentials secured.`);
      } else {
        toast.error('Migration failed. Please check the logs.');
      }
    } catch (error) {
      console.error('Migration error:', error);
      toast.error('An error occurred during migration');
    } finally {
      setIsMigrating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Credential Security Migration
        </CardTitle>
        <CardDescription>
          Migrate your credentials from localStorage to secure encrypted storage
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Migration Status */}
        {migrationStatus === 'idle' && (
          <div className="space-y-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                This tool helps you move any credentials stored in your browser's localStorage 
                to our secure, encrypted server-side storage system.
              </AlertDescription>
            </Alert>
            
            <MigrationActions
              onScan={handleScan}
              onMigrate={handleMigration}
              isMigrating={isMigrating}
            />
          </div>
        )}

        <MigrationStatusDisplay status={migrationStatus} />

        {migrationStatus === 'complete' && migrationResults && (
          <MigrationResults results={migrationResults} onReset={resetMigration} />
        )}

        {/* Found Credentials Display */}
        {foundCredentials.length > 0 && migrationStatus === 'idle' && (
          <FoundCredentialsList credentials={foundCredentials} />
        )}

        {/* Security Benefits */}
        <SecurityBenefits />
      </CardContent>
    </Card>
  );
};

export default CredentialMigrationHelper;
