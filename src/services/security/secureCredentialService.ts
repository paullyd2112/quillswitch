
import { CredentialStorage } from './core/credentialStorage';
import { CredentialMigrator } from './migration/credentialMigrator';
import type { 
  SecureCredentialData, 
  CredentialStorageResult,
  CredentialRetrievalResult,
  CredentialListResult,
  MigrationResult 
} from './types/credentialTypes';

export type { SecureCredentialData };

export class SecureCredentialService {
  private static instance: SecureCredentialService;
  private credentialStorage: CredentialStorage;
  private credentialMigrator: CredentialMigrator;

  private constructor() {
    this.credentialStorage = new CredentialStorage();
    this.credentialMigrator = new CredentialMigrator();
  }

  public static getInstance(): SecureCredentialService {
    if (!SecureCredentialService.instance) {
      SecureCredentialService.instance = new SecureCredentialService();
    }
    return SecureCredentialService.instance;
  }

  /**
   * Store a credential securely using Supabase encryption
   */
  public async storeCredential(credential: SecureCredentialData): Promise<CredentialStorageResult> {
    return this.credentialStorage.storeCredential(credential);
  }

  /**
   * Retrieve a credential securely (with audit logging)
   */
  public async getCredential(credentialId: string): Promise<CredentialRetrievalResult> {
    return this.credentialStorage.getCredential(credentialId);
  }

  /**
   * List user's credentials (without sensitive values)
   */
  public async listCredentials(): Promise<CredentialListResult> {
    return this.credentialStorage.listCredentials();
  }

  /**
   * Delete a credential securely
   */
  public async deleteCredential(credentialId: string): Promise<{ success: boolean; error?: string }> {
    return this.credentialStorage.deleteCredential(credentialId);
  }

  /**
   * Migrate localStorage credentials to secure storage
   */
  public async migrateLocalStorageCredentials(): Promise<MigrationResult> {
    return this.credentialMigrator.migrateLocalStorageCredentials();
  }
}

export const secureCredentialService = SecureCredentialService.getInstance();
