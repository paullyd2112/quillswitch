
import type { 
  SecureCredentialData, 
  CredentialStorageResult,
  CredentialRetrievalResult,
  CredentialListResult 
} from '../types/credentialTypes';
import { CredentialReader } from './storage/credentialReader';
import { CredentialWriter } from './storage/credentialWriter';
import { CredentialManager } from './storage/credentialManager';

export class CredentialStorage {
  private reader: CredentialReader;
  private writer: CredentialWriter;
  private manager: CredentialManager;

  constructor() {
    this.reader = new CredentialReader();
    this.writer = new CredentialWriter();
    this.manager = new CredentialManager();
  }

  /**
   * Store a credential securely using Supabase encryption
   */
  public async storeCredential(credential: SecureCredentialData): Promise<CredentialStorageResult> {
    return this.writer.storeCredential(credential);
  }

  /**
   * Retrieve a credential securely (with audit logging)
   */
  public async getCredential(credentialId: string): Promise<CredentialRetrievalResult> {
    return this.reader.getCredential(credentialId);
  }

  /**
   * List user's credentials (without sensitive values)
   */
  public async listCredentials(): Promise<CredentialListResult> {
    return this.manager.listCredentials();
  }

  /**
   * Delete a credential securely
   */
  public async deleteCredential(credentialId: string): Promise<{ success: boolean; error?: string }> {
    return this.manager.deleteCredential(credentialId);
  }
}
