
import { ServiceCredential } from "@/components/vault/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface BackupMetadata {
  timestamp: string;
  credentialCount: number;
  version: string;
  userId: string;
  backupId: string;
}

// Temporary in-memory storage for backups since we don't have a vault_backups table yet
const memoryBackups: Map<string, {
  id: string;
  user_id: string;
  metadata: BackupMetadata;
  credentials_snapshot: ServiceCredential[];
  created_at: string;
  backup_type: string;
}> = new Map();

/**
 * Creates a backup of all user credentials
 */
export const createVaultBackup = async (): Promise<{ success: boolean; backupId?: string; error?: string }> => {
  try {
    // Get all user credentials
    const { data: credentials, error } = await supabase
      .from('service_credentials')
      .select('*');
      
    if (error) throw error;
    if (!credentials || credentials.length === 0) {
      return { success: false, error: 'No credentials found to backup' };
    }
    
    // Generate backup ID
    const backupId = `vault_backup_${Date.now()}`;
    
    // Create backup metadata
    const metadata: BackupMetadata = {
      timestamp: new Date().toISOString(),
      credentialCount: credentials.length,
      version: '1.0',
      userId: credentials[0].user_id, // All credentials should belong to the same user
      backupId
    };
    
    // Store backup in memory for now
    memoryBackups.set(backupId, {
      id: backupId,
      user_id: metadata.userId,
      metadata,
      credentials_snapshot: credentials,
      created_at: metadata.timestamp,
      backup_type: 'manual'
    });
    
    return { success: true, backupId };
  } catch (error) {
    console.error('Backup creation failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error during backup' 
    };
  }
};

/**
 * List all available backups for the current user
 */
export const listBackups = async (): Promise<{ backups: any[]; error?: string }> => {
  try {
    // Get user ID from current session
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Filter backups by user ID
    const userBackups = Array.from(memoryBackups.values())
      .filter(backup => backup.user_id === user.id)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    
    return { backups: userBackups };
  } catch (error) {
    console.error('Failed to list backups:', error);
    return { 
      backups: [], 
      error: error instanceof Error ? error.message : 'Unknown error listing backups' 
    };
  }
};

/**
 * Restore credentials from a specific backup
 * @param backupId The ID of the backup to restore from
 * @param options Restore options including conflict resolution strategy
 */
export const restoreFromBackup = async (
  backupId: string, 
  options: { 
    conflictStrategy: 'replace' | 'skip' | 'merge'
  } = { conflictStrategy: 'skip' }
): Promise<{ success: boolean; processed: number; errors: number; error?: string }> => {
  try {
    // Get the backup from memory
    const backup = memoryBackups.get(backupId);
    
    if (!backup || !backup.credentials_snapshot) {
      return { success: false, processed: 0, errors: 0, error: 'Backup not found or empty' };
    }
    
    const credentials = backup.credentials_snapshot;
    let processed = 0;
    let errors = 0;
    
    // Process each credential in the backup
    for (const credential of credentials) {
      try {
        // Check if credential exists
        const { data: existing } = await supabase
          .from('service_credentials')
          .select('id')
          .eq('service_name', credential.service_name)
          .eq('credential_name', credential.credential_name)
          .limit(1);
          
        const exists = existing && existing.length > 0;
        
        // Handle according to conflict strategy
        if (exists && options.conflictStrategy === 'skip') {
          continue;
        }
        
        if (exists && options.conflictStrategy === 'replace') {
          // Delete existing credential
          await supabase
            .from('service_credentials')
            .delete()
            .eq('id', existing[0].id);
            
          // Insert the backup version
          const { error: insertError } = await supabase
            .from('service_credentials')
            .insert(credential);
            
          if (insertError) throw insertError;
        }
        
        if (exists && options.conflictStrategy === 'merge') {
          // Update non-sensitive fields only
          const { error: updateError } = await supabase
            .from('service_credentials')
            .update({
              environment: credential.environment,
              expires_at: credential.expires_at,
              tags: credential.tags,
              metadata: credential.metadata
            })
            .eq('id', existing[0].id);
            
          if (updateError) throw updateError;
        }
        
        if (!exists) {
          // Insert new credential if it doesn't exist
          const { error: insertError } = await supabase
            .from('service_credentials')
            .insert(credential);
            
          if (insertError) throw insertError;
        }
        
        processed++;
      } catch (credError) {
        console.error(`Failed to restore credential: ${credential.credential_name}`, credError);
        errors++;
      }
    }
    
    return { 
      success: processed > 0, 
      processed, 
      errors,
      error: errors > 0 ? `Failed to restore ${errors} credentials` : undefined
    };
  } catch (error) {
    console.error('Restore operation failed:', error);
    return { 
      success: false, 
      processed: 0, 
      errors: 0,
      error: error instanceof Error ? error.message : 'Unknown error during restore'
    };
  }
};

/**
 * Schedules an automatic backup (to be called on a timer or before critical operations)
 */
export const scheduleAutomaticBackup = async (): Promise<void> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return; // User not authenticated
    }
    
    // Check when the last automatic backup was created
    const userBackups = Array.from(memoryBackups.values())
      .filter(backup => backup.user_id === user.id && backup.backup_type === 'automatic')
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    
    // If no backup exists or the last one is more than a day old
    if (!userBackups.length || 
        new Date().getTime() - new Date(userBackups[0].created_at).getTime() > 24 * 60 * 60 * 1000) {
      const result = await createVaultBackup();
      if (result.success && result.backupId) {
        // Update the type to automatic
        const backup = memoryBackups.get(result.backupId);
        if (backup) {
          backup.backup_type = 'automatic';
          console.log(`Automatic backup created: ${result.backupId}`);
        }
      }
    }
  } catch (error) {
    console.error('Failed to schedule automatic backup:', error);
  }
};
