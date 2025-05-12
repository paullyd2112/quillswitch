
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BackupRestorePanel } from "@/components/vault/backup/BackupRestorePanel";
import { Button } from "@/components/ui/button";
import { Shield, RefreshCw, AlertTriangle, Cloud } from "lucide-react";
import { toast } from "sonner";
import CloudSecretsManager from "@/components/vault/CloudSecretsManager";

interface VaultSettingsProps {
  onRefreshVault?: () => Promise<void>;
}

export const VaultSettings: React.FC<VaultSettingsProps> = ({ onRefreshVault }) => {
  const handleBackupCreated = () => {
    // Optionally handle post-backup actions
  };
  
  const handleRestoreComplete = async () => {
    toast.success("Vault restored successfully");
    // Refresh the vault data after restore
    if (onRefreshVault) {
      await onRefreshVault();
    }
  };
  
  const handleSecurityCheck = () => {
    toast.info("Security check initiated", {
      description: "Scanning credentials for security issues...",
      duration: 3000
    });
    
    // Simulate a security check (in a real app, this would check for expired credentials, etc.)
    setTimeout(() => {
      toast.success("Security check completed", {
        description: "No security issues found in your credentials vault.",
        duration: 5000
      });
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Vault Settings</h2>
        <p className="text-muted-foreground">
          Manage your credentials vault security, backups, and preferences
        </p>
      </div>
      
      <Tabs defaultValue="backup" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-4">
          <TabsTrigger value="backup">Backup & Restore</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="cloud">Cloud Integration</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>
        
        <TabsContent value="backup">
          <BackupRestorePanel 
            onBackupCreated={handleBackupCreated}
            onRestoreComplete={handleRestoreComplete}
          />
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Configure security options for your credentials vault
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-medium">Security Scan</h3>
                  <p className="text-sm text-muted-foreground">
                    Check for expired or vulnerable credentials
                  </p>
                </div>
                <Button 
                  onClick={handleSecurityCheck} 
                  variant="outline"
                  size="sm"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Run Security Check
                </Button>
              </div>
              
              <div className="border-t pt-4">
                <h3 className="text-sm font-medium mb-2">Automatic Backups</h3>
                <p className="text-sm text-muted-foreground">
                  Automatic backups are created daily when you access the vault
                </p>
              </div>
              
              <Card className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
                <CardContent className="p-4 flex gap-3 items-start">
                  <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium mb-1">Credential Security</h4>
                    <p className="text-sm text-muted-foreground">
                      Remember to rotate your credentials regularly and remove unused API keys to maintain security.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="cloud">
          <CloudSecretsManager />
        </TabsContent>
        
        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>Vault Preferences</CardTitle>
              <CardDescription>
                Customize how you interact with the credentials vault
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-medium">Refresh Vault Data</h3>
                  <p className="text-sm text-muted-foreground">
                    Manually refresh all credentials from the database
                  </p>
                </div>
                <Button 
                  onClick={onRefreshVault} 
                  variant="outline"
                  size="sm"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh Data
                </Button>
              </div>
              
              {/* Additional preference options can be added here */}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VaultSettings;
