
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Download, Upload, AlertTriangle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import useVaultBackup from "@/hooks/useVaultBackup";

interface BackupRestorePanelProps {
  onBackupCreated?: () => void;
  onRestoreComplete?: () => void;
}

export const BackupRestorePanel: React.FC<BackupRestorePanelProps> = ({
  onBackupCreated,
  onRestoreComplete
}) => {
  const {
    backups,
    isLoading,
    selectedBackupId,
    setSelectedBackupId,
    loadBackups,
    createBackup,
    restoreBackup
  } = useVaultBackup();

  const [conflictStrategy, setConflictStrategy] = useState<'replace' | 'skip' | 'merge'>('skip');
  const [showRestoreDialog, setShowRestoreDialog] = useState(false);

  // Load backups on component mount
  useEffect(() => {
    loadBackups();
  }, []);

  // Handle backup creation
  const handleCreateBackup = async () => {
    const backupId = await createBackup();
    if (backupId && onBackupCreated) {
      onBackupCreated();
    }
  };

  // Handle restore process
  const handleRestore = async () => {
    if (!selectedBackupId) return;
    
    const success = await restoreBackup(selectedBackupId, conflictStrategy);
    setShowRestoreDialog(false);
    
    if (success && onRestoreComplete) {
      onRestoreComplete();
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Backup & Restore</CardTitle>
        <CardDescription>
          Create backups of your credentials or restore from a previous backup
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-sm font-medium">Create New Backup</h3>
            <p className="text-sm text-muted-foreground">
              Save a snapshot of all your current credentials
            </p>
          </div>
          <Button 
            onClick={handleCreateBackup} 
            disabled={isLoading}
            variant="outline"
            size="sm"
          >
            {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
            Create Backup
          </Button>
        </div>
        
        <div className="border-t pt-4">
          <h3 className="text-sm font-medium mb-2">Available Backups</h3>
          
          {backups.length > 0 ? (
            <div className="space-y-3">
              <Select
                value={selectedBackupId || ''}
                onValueChange={value => setSelectedBackupId(value || null)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a backup to restore" />
                </SelectTrigger>
                <SelectContent>
                  {backups.map(backup => (
                    <SelectItem key={backup.id} value={backup.id}>
                      {formatDate(backup.created_at)} - {backup.metadata?.credentialCount || 0} credentials
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Dialog open={showRestoreDialog} onOpenChange={setShowRestoreDialog}>
                <DialogTrigger asChild>
                  <Button 
                    onClick={() => selectedBackupId && setShowRestoreDialog(true)} 
                    disabled={!selectedBackupId || isLoading}
                    size="sm"
                    className="mt-2"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                    Restore Selected Backup
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Restore from Backup</DialogTitle>
                    <DialogDescription>
                      Choose how to handle conflicts with existing credentials.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <Alert variant="warning" className="my-4">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Please confirm your restore strategy</AlertTitle>
                    <AlertDescription>
                      This operation cannot be undone. You may want to create a new backup before proceeding.
                    </AlertDescription>
                  </Alert>
                  
                  <RadioGroup
                    value={conflictStrategy}
                    onValueChange={(value) => setConflictStrategy(value as any)}
                    className="space-y-3 mt-4"
                  >
                    <div className="flex items-start space-x-3">
                      <RadioGroupItem value="skip" id="skip" />
                      <div className="space-y-1">
                        <Label htmlFor="skip" className="font-medium">Skip existing credentials</Label>
                        <p className="text-sm text-muted-foreground">
                          Only restore credentials that don't already exist in your vault
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <RadioGroupItem value="replace" id="replace" />
                      <div className="space-y-1">
                        <Label htmlFor="replace" className="font-medium">Replace existing credentials</Label>
                        <p className="text-sm text-muted-foreground">
                          Overwrite any existing credentials with the backup version
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <RadioGroupItem value="merge" id="merge" />
                      <div className="space-y-1">
                        <Label htmlFor="merge" className="font-medium">Merge with existing credentials</Label>
                        <p className="text-sm text-muted-foreground">
                          Update metadata and non-sensitive fields while keeping credential values
                        </p>
                      </div>
                    </div>
                  </RadioGroup>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowRestoreDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleRestore} disabled={isLoading}>
                      {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                      Restore Now
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground text-sm">
                No backups available. Create your first backup to protect your credentials.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BackupRestorePanel;
