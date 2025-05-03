
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { handleAppError, tryExecute } from "@/services/errorHandling/errorService";
import { ServiceCredential } from "@/components/vault/types";
import { createVaultBackup, listBackups, restoreFromBackup } from "@/services/backup/vaultBackupService";

// Define backup interface for type safety
interface VaultBackup {
  id: string;
  created_at: string;
  metadata: {
    timestamp: string;
    credentialCount: number;
    version: string;
    userId: string;
    backupId: string;
  };
  backup_type: 'manual' | 'automatic';
}

export const useVaultBackup = () => {
  const [backups, setBackups] = useState<VaultBackup[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBackupId, setSelectedBackupId] = useState<string | null>(null);
  
  // Load available backups
  const loadBackups = async () => {
    setIsLoading(true);
    try {
      const { backups: availableBackups, error } = await listBackups();
      
      if (error) {
        toast.error(`Failed to load backups: ${error}`);
        return;
      }
      
      // Convert to our VaultBackup interface format
      const formattedBackups: VaultBackup[] = availableBackups.map(backup => ({
        id: backup.id,
        created_at: backup.created_at,
        metadata: backup.metadata,
        backup_type: backup.backup_type as 'manual' | 'automatic'
      }));
      
      setBackups(formattedBackups);
    } catch (error) {
      handleAppError(error, "Failed to load backups", "database");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Create a new backup
  const createBackup = async () => {
    setIsLoading(true);
    try {
      const result = await createVaultBackup();
      
      if (!result.success) {
        if (result.error === 'No credentials found to backup') {
          toast.warning("No credentials found to backup");
        } else {
          toast.error(`Failed to create backup: ${result.error}`);
        }
        return null;
      }
      
      // Refresh backups list
      await loadBackups();
      
      toast.success(`Backup created successfully`);
      return result.backupId;
    } catch (error) {
      handleAppError(error, "Failed to create backup", "database");
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Restore from a backup
  const restoreBackup = async (backupId: string, conflictStrategy: 'replace' | 'skip' | 'merge' = 'skip') => {
    setIsLoading(true);
    
    try {
      const result = await restoreFromBackup(backupId, { conflictStrategy });
      
      if (!result.success) {
        toast.error(result.error || "Failed to restore backup");
        return false;
      }
      
      toast.success(`Restored ${result.processed} credentials successfully${result.errors ? `, with ${result.errors} errors` : ''}`);
      return true;
    } catch (error) {
      handleAppError(error, "Restore operation failed", "database");
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Schedule an automatic backup
  const scheduleAutomaticBackup = async () => {
    try {
      await createBackup();
    } catch (error) {
      console.error('Failed to schedule automatic backup:', error);
    }
  };
  
  return {
    backups,
    isLoading,
    selectedBackupId,
    setSelectedBackupId,
    loadBackups,
    createBackup,
    restoreBackup,
    scheduleAutomaticBackup
  };
};

export default useVaultBackup;
