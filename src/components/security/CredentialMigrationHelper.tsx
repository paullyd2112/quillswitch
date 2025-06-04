
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  Upload, 
  CheckCircle, 
  AlertTriangle,
  Info,
  ArrowRight,
  Lock
} from 'lucide-react';
import { secureCredentialService } from '@/services/security/secureCredentialService';
import { enhancedSecurityAuditor } from '@/utils/security/enhancedSecurityAuditor';
import { toast } from 'sonner';

const CredentialMigrationHelper = () => {
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationStatus, setMigrationStatus] = useState<'idle' | 'scanning' | 'migrating' | 'complete'>('idle');
  const [foundCredentials, setFoundCredentials] = useState<string[]>([]);
  const [migrationResults, setMigrationResults] = useState<{
    migrated: number;
    errors: string[];
  } | null>(null);

  const scanForCredentials = () => {
    setMigrationStatus('scanning');
    
    // Scan localStorage for potential credentials
    const credentials: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (
        key.includes('api_key') || 
        key.includes('credential') || 
        key.includes('token') ||
        key.includes('secret')
      )) {
        // Skip legitimate auth tokens
        if (key.includes('auth-token') || key.includes('supabase')) continue;
        credentials.push(key);
      }
    }
    
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

  const resetMigration = () => {
    setMigrationStatus('idle');
    setFoundCredentials([]);
    setMigrationResults(null);
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
            
            <div className="flex gap-2">
              <Button onClick={scanForCredentials} variant="outline" className="flex-1">
                <Shield className="h-4 w-4 mr-2" />
                Scan for Credentials
              </Button>
              <Button onClick={handleMigration} disabled={isMigrating} className="flex-1">
                <Upload className="h-4 w-4 mr-2" />
                Start Migration
              </Button>
            </div>
          </div>
        )}

        {migrationStatus === 'scanning' && (
          <div className="text-center py-8">
            <Shield className="h-8 w-8 animate-pulse mx-auto mb-4" />
            <p className="text-lg font-medium">Scanning for credentials...</p>
          </div>
        )}

        {migrationStatus === 'migrating' && (
          <div className="space-y-4">
            <div className="text-center">
              <Upload className="h-8 w-8 animate-bounce mx-auto mb-4" />
              <p className="text-lg font-medium">Migrating credentials to secure storage...</p>
              <p className="text-sm text-muted-foreground">This may take a moment</p>
            </div>
            <Progress value={50} className="w-full" />
          </div>
        )}

        {migrationStatus === 'complete' && migrationResults && (
          <div className="space-y-4">
            <div className="text-center">
              <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-4" />
              <p className="text-lg font-medium">Migration Complete!</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{migrationResults.migrated}</div>
                  <div className="text-sm text-muted-foreground">Credentials Migrated</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-red-600">{migrationResults.errors.length}</div>
                  <div className="text-sm text-muted-foreground">Errors</div>
                </CardContent>
              </Card>
            </div>

            {migrationResults.errors.length > 0 && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-1">
                    <p>Some items couldn't be migrated:</p>
                    {migrationResults.errors.slice(0, 3).map((error, index) => (
                      <p key={index} className="text-xs">• {error}</p>
                    ))}
                    {migrationResults.errors.length > 3 && (
                      <p className="text-xs">... and {migrationResults.errors.length - 3} more</p>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
            )}

            <Button onClick={resetMigration} variant="outline" className="w-full">
              <ArrowRight className="h-4 w-4 mr-2" />
              Run Another Scan
            </Button>
          </div>
        )}

        {/* Found Credentials Display */}
        {foundCredentials.length > 0 && migrationStatus === 'idle' && (
          <div className="space-y-3">
            <h4 className="font-medium">Found Potential Credentials:</h4>
            <div className="grid gap-2">
              {foundCredentials.map((key, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-orange-500" />
                    <span className="font-mono text-sm">{key}</span>
                  </div>
                  <Badge variant="outline">
                    {key.includes('api_key') ? 'API Key' : 
                     key.includes('token') ? 'Token' : 
                     key.includes('secret') ? 'Secret' : 'Credential'}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Security Benefits */}
        <div className="border-t pt-4">
          <h4 className="font-medium mb-3">Security Benefits:</h4>
          <div className="grid gap-2 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Server-side encryption using pgsodium</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Row-level security with user isolation</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Audit logging for all credential access</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Automatic expiry tracking and alerts</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CredentialMigrationHelper;
