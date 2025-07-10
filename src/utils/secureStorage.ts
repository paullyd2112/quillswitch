/**
 * Secure storage abstraction for QuillSwitch
 * Provides secure storage options with fallbacks
 */

import { encryptData, decryptData, clearEncryptionKeys } from './encryptionUtils';

export type StorageType = 'session' | 'memory';

interface StorageOptions {
  type: StorageType;
  encrypt?: boolean;
  expireAfter?: number; // milliseconds
}

class SecureStorageManager {
  private memoryStorage = new Map<string, { value: string; expires?: number }>();

  /**
   * Store data with encryption and expiration
   */
  async store(key: string, value: string, options: StorageOptions = { type: 'session', encrypt: true }): Promise<void> {
    try {
      let finalValue = value;
      
      if (options.encrypt) {
        finalValue = await encryptData(value);
      }

      const storageData = {
        value: finalValue,
        encrypted: options.encrypt,
        timestamp: Date.now(),
        expires: options.expireAfter ? Date.now() + options.expireAfter : undefined
      };

      switch (options.type) {
        case 'session':
          sessionStorage.setItem(key, JSON.stringify(storageData));
          break;
        case 'memory':
          this.memoryStorage.set(key, {
            value: JSON.stringify(storageData),
            expires: storageData.expires
          });
          break;
      }
    } catch (error) {
      console.error('Failed to store data securely:', error);
      throw new Error('Secure storage failed');
    }
  }

  /**
   * Retrieve data with automatic decryption and expiration check
   */
  async retrieve(key: string, type: StorageType = 'session'): Promise<string | null> {
    try {
      let rawData: string | null = null;

      switch (type) {
        case 'session':
          rawData = sessionStorage.getItem(key);
          break;
        case 'memory':
          const memoryData = this.memoryStorage.get(key);
          if (memoryData) {
            // Check expiration
            if (memoryData.expires && Date.now() > memoryData.expires) {
              this.memoryStorage.delete(key);
              return null;
            }
            rawData = memoryData.value;
          }
          break;
      }

      if (!rawData) return null;

      const storageData = JSON.parse(rawData);

      // Check expiration
      if (storageData.expires && Date.now() > storageData.expires) {
        this.remove(key, type);
        return null;
      }

      let finalValue = storageData.value;

      if (storageData.encrypted) {
        finalValue = await decryptData(storageData.value);
      }

      return finalValue;
    } catch (error) {
      console.error('Failed to retrieve data:', error);
      return null;
    }
  }

  /**
   * Remove data from storage
   */
  remove(key: string, type: StorageType = 'session'): void {
    switch (type) {
      case 'session':
        sessionStorage.removeItem(key);
        break;
      case 'memory':
        this.memoryStorage.delete(key);
        break;
    }
  }

  /**
   * Clear all data from storage
   */
  clear(type: StorageType = 'session'): void {
    switch (type) {
      case 'session':
        sessionStorage.clear();
        break;
      case 'memory':
        this.memoryStorage.clear();
        break;
    }
  }

  /**
   * Clear all sensitive data and encryption keys
   */
  clearAllSensitiveData(): void {
    // Clear memory storage
    this.memoryStorage.clear();
    
    // Clear session storage
    sessionStorage.clear();
    
    // Clear encryption keys
    clearEncryptionKeys();
    
    // Clear any remaining sensitive localStorage items
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('secure_') || key.includes('oauth') || key.includes('auth'))) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
  }

  /**
   * Store OAuth state securely with expiration
   */
  async storeOAuthState(state: any): Promise<string> {
    const stateId = crypto.randomUUID();
    const expirationTime = 10 * 60 * 1000; // 10 minutes
    
    await this.store(`oauth_state_${stateId}`, JSON.stringify(state), {
      type: 'session',
      encrypt: true,
      expireAfter: expirationTime
    });
    
    return stateId;
  }

  /**
   * Retrieve OAuth state securely
   */
  async retrieveOAuthState(stateId: string): Promise<any | null> {
    const data = await this.retrieve(`oauth_state_${stateId}`, 'session');
    if (!data) return null;
    
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  }

  /**
   * Clear OAuth state
   */
  clearOAuthState(stateId: string): void {
    this.remove(`oauth_state_${stateId}`, 'session');
  }
}

// Export singleton instance
export const secureStorage = new SecureStorageManager();

// Convenience functions for OAuth handling
export const oauthStorage = {
  store: (state: any) => secureStorage.storeOAuthState(state),
  retrieve: (stateId: string) => secureStorage.retrieveOAuthState(stateId),
  clear: (stateId: string) => secureStorage.clearOAuthState(stateId)
};

// Session management
export const sessionManager = {
  /**
   * Start a secure session
   */
  async startSession(userId: string, sessionData: any): Promise<void> {
    const sessionId = crypto.randomUUID();
    await secureStorage.store('current_session', JSON.stringify({
      sessionId,
      userId,
      ...sessionData,
      startTime: Date.now()
    }), {
      type: 'session',
      encrypt: true,
      expireAfter: 8 * 60 * 60 * 1000 // 8 hours
    });
  },

  /**
   * Get current session
   */
  async getCurrentSession(): Promise<any | null> {
    const data = await secureStorage.retrieve('current_session', 'session');
    if (!data) return null;
    
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  },

  /**
   * End session and clear all sensitive data
   */
  endSession(): void {
    secureStorage.clearAllSensitiveData();
  },

  /**
   * Check if session is valid and not expired
   */
  async isSessionValid(): Promise<boolean> {
    const session = await this.getCurrentSession();
    return session !== null;
  }
};