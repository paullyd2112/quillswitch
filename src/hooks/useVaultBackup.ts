
import { useState } from "react";
import { createVaultBackup, listBackups, restoreFromBackup } from "@/services/backup/vaultBackupService";
import { toast } from "sonner";

export const useVaultBackup = () => {
  const [backups, setBackups] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBackupId, setSelectedBackupId] = useState<string | null>(null);
  
  // Load available backups
  const loadBackups = async () => {
    setIsLoading(true);
    try {
      const result = await listBackups();
      if (result.error) {
        toast.error(`Failed to load backups: ${result.error}`);
      } else {
        setBackups(result.backups);
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  // Create a new backup
  const createBackup = async () => {
    setIsLoading(true);
    try {
      const result = await createVaultBackup();
      if (result.success) {
        toast.success(`Backup created successfully`);
        await loadBackups();
        return result.backupId;
      } else {
        toast.error(`Backup failed: ${result.error}`);
        return null;
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  // Restore from a backup
  const restoreBackup = async (backupId: string, conflictStrategy: 'replace' | 'skip' | 'merge' = 'skip') => {
    setIsLoading(true);
    try {
      const result = await restoreFromBackup(backupId, { conflictStrategy });
      if (result.success) {
        toast.success(`Restored ${result.processed} credentials successfully`);
        if (result.errors > 0) {
          toast.warning(`${result.errors} credentials had errors during restore`);
        }
        return true;
      } else {
        toast.error(`Restore failed: ${result.error}`);
        return false;
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    backups,
    isLoading,
    selectedBackupId,
    setSelectedBackupId,
    loadBackups,
    createBackup,
    restoreBackup
  };
};

export default useVaultBackup;
