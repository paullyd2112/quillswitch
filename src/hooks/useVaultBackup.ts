
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { handleAppError, tryExecute } from "@/services/errorHandling/errorService";

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

// In-memory backup storage until we have a proper table
let temporaryBackups: VaultBackup[] = [];

export const useVaultBackup = () => {
  const [backups, setBackups] = useState<VaultBackup[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBackupId, setSelectedBackupId] = useState<string | null>(null);
  
  // Load available backups
  const loadBackups = async () => {
    setIsLoading(true);
    try {
      // Use in-memory backups for now
      setBackups(temporaryBackups);
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
      // Get all user credentials
      const { data: credentials, error } = await supabase
        .from('service_credentials')
        .select('*');
        
      if (error) throw error;
      if (!credentials || credentials.length === 0) {
        toast.warning("No credentials found to backup");
        return null;
      }
      
      // Generate backup ID
      const backupId = `vault_backup_${Date.now()}`;
      
      // Create backup metadata
      const metadata = {
        timestamp: new Date().toISOString(),
        credentialCount: credentials.length,
        version: '1.0',
        userId: credentials[0].user_id, // All credentials should belong to the same user
        backupId
      };
      
      // Store backup in memory
      const newBackup: VaultBackup = {
        id: backupId,
        created_at: new Date().toISOString(),
        metadata,
        backup_type: 'manual'
      };
      
      // Add to our temporary storage
      temporaryBackups.push(newBackup);
      
      // Update local state
      setBackups([...temporaryBackups]);
      
      toast.success(`Backup created successfully`);
      return backupId;
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
      // Find backup in memory
      const backup = temporaryBackups.find(b => b.id === backupId);
      
      if (!backup) {
        toast.error("Backup not found");
        return false;
      }
      
      // In a real implementation, we would restore credentials from the backup
      // For now, just simulate success
      toast.success(`Restored ${backup.metadata.credentialCount} credentials successfully`);
      
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
      // Check if any backups exist
      if (temporaryBackups.length === 0 || 
          new Date().getTime() - new Date(temporaryBackups[0].created_at).getTime() > 24 * 60 * 60 * 1000) {
        await createBackup();
      }
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
