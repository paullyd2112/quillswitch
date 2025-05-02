
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
    
    // Store backup in the user's backup table
    const { error: backupError } = await supabase
      .from('vault_backups')
      .insert({
        id: backupId,
        user_id: metadata.userId,
        metadata,
        credentials_snapshot: credentials,
        created_at: metadata.timestamp,
        backup_type: 'manual'
      });
      
    if (backupError) throw backupError;
    
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
    const { data: backups, error } = await supabase
      .from('vault_backups')
      .select('id, created_at, metadata, backup_type')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    return { backups: backups || [] };
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
    // Get the backup
    const { data: backup, error } = await supabase
      .from('vault_backups')
      .select('credentials_snapshot')
      .eq('id', backupId)
      .single();
      
    if (error) throw error;
    if (!backup || !backup.credentials_snapshot) {
      return { success: false, processed: 0, errors: 0, error: 'Backup not found or empty' };
    }
    
    const credentials = backup.credentials_snapshot as any[];
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
    // Check when the last automatic backup was created
    const { data: lastBackup } = await supabase
      .from('vault_backups')
      .select('created_at')
      .eq('backup_type', 'automatic')
      .order('created_at', { ascending: false })
      .limit(1);
    
    // If no backup exists or the last one is more than a day old
    if (!lastBackup || !lastBackup.length || 
        new Date().getTime() - new Date(lastBackup[0].created_at).getTime() > 24 * 60 * 60 * 1000) {
      const result = await createVaultBackup();
      if (result.success) {
        console.log(`Automatic backup created: ${result.backupId}`);
      }
    }
  } catch (error) {
    console.error('Failed to schedule automatic backup:', error);
  }
};
