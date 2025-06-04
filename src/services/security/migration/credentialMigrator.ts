
import { toast } from 'sonner';
import type { SecureCredentialData, MigrationResult } from '../types/credentialTypes';
import { CredentialStorage } from '../core/credentialStorage';

export class CredentialMigrator {
  private credentialStorage: CredentialStorage;

  constructor() {
    this.credentialStorage = new CredentialStorage();
  }

  /**
   * Migrate localStorage credentials to secure storage
   */
  public async migrateLocalStorageCredentials(): Promise<MigrationResult> {
    const migrated: string[] = [];
    const errors: string[] = [];

    try {
      // Find potential credentials in localStorage
      const credentialKeys = this.findCredentialKeys();

      for (const key of credentialKeys) {
        try {
          const value = localStorage.getItem(key);
          if (!value) continue;

          // Attempt to migrate to secure storage
          const result = await this.credentialStorage.storeCredential({
            serviceName: 'migrated',
            credentialName: key,
            credentialType: 'api_key',
            credentialValue: value,
            environment: 'development',
            metadata: { migratedFrom: 'localStorage', originalKey: key }
          });

          if (result.success) {
            localStorage.removeItem(key);
            migrated.push(key);
            console.log(`Migrated credential: ${key}`);
          } else {
            errors.push(`Failed to migrate ${key}: ${result.error}`);
          }
        } catch (error) {
          errors.push(`Error migrating ${key}: ${error}`);
        }
      }

      if (migrated.length > 0) {
        toast.success(`Migrated ${migrated.length} credentials to secure storage`);
      }

      return { success: true, migrated: migrated.length, errors };
    } catch (error) {
      console.error('Error during migration:', error);
      return { success: false, migrated: migrated.length, errors: [...errors, `Migration error: ${error}`] };
    }
  }

  private findCredentialKeys(): string[] {
    const credentialKeys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.includes('api_key') || key.includes('credential') || key.includes('token'))) {
        // Skip legitimate auth tokens
        if (key.includes('auth-token') || key.includes('supabase')) continue;
        credentialKeys.push(key);
      }
    }
    return credentialKeys;
  }
}
