
/**
 * Encryption utilities for handling sensitive data in the CRM migration tool
 * This is a client-side encryption utility for non-critical data.
 * For truly sensitive data, always use server-side encryption via Supabase functions.
 */

// Simple encryption key from localStorage or generate a new one
const getEncryptionKey = (): string => {
  let key = localStorage.getItem('app_encryption_key');
  if (!key) {
    // Generate a random key and store it
    key = Array.from(crypto.getRandomValues(new Uint8Array(16)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    localStorage.setItem('app_encryption_key', key);
  }
  return key;
};

/**
 * Encrypts sensitive data for local storage
 * Note: This is for protecting data at rest in browser storage
 * Critical data should be encrypted on the server side
 */
export const encryptData = (data: string): string => {
  try {
    // Simple XOR encryption with the key for localStorage protection
    // NOT suitable for truly sensitive data - use server-side encryption for that
    const key = getEncryptionKey();
    const encrypted = Array.from(data).map((char, i) => {
      return String.fromCharCode(char.charCodeAt(0) ^ key.charCodeAt(i % key.length));
    }).join('');
    return btoa(encrypted); // Base64 encode the result
  } catch (e) {
    console.error('Encryption failed:', e);
    return '';
  }
};

/**
 * Decrypts data that was encrypted with encryptData
 */
export const decryptData = (encryptedData: string): string => {
  try {
    const key = getEncryptionKey();
    const data = atob(encryptedData); // Base64 decode
    const decrypted = Array.from(data).map((char, i) => {
      return String.fromCharCode(char.charCodeAt(0) ^ key.charCodeAt(i % key.length));
    }).join('');
    return decrypted;
  } catch (e) {
    console.error('Decryption failed:', e);
    return '';
  }
};

/**
 * Strong field-level encryption is now handled serverside using the 
 * encrypt_and_store_credential and get_decrypted_credential_with_logging
 * database functions via Supabase RPC
 */
export const fieldEncrypt = async (data: string, userKey: string): Promise<string> => {
  // This function now returns the original value since encryption 
  // is handled by the server-side function
  return data;
};

/**
 * Field decryption is now handled server-side
 */
export const fieldDecrypt = async (encryptedData: string, userKey: string): Promise<string> => {
  // This function is kept for backward compatibility
  // but decryption is now handled by server-side functions
  return encryptedData;
};

/**
 * Masks sensitive data for display (e.g. API keys, personal info)
 * @param data The sensitive data to mask
 * @param visibleChars Number of characters to show at the end (default: 4)
 * @returns Masked string with only the last few characters visible
 */
export const maskSensitiveData = (data: string, visibleChars: number = 4): string => {
  if (!data) return '';
  if (data.length <= visibleChars) return data;
  
  // For API keys, we typically want to show the last few characters
  const visiblePart = data.slice(-visibleChars);
  const maskedPortion = '•'.repeat(Math.min(data.length - visibleChars, 12));
  return `${maskedPortion}${visiblePart}`;
};

/**
 * Securely stores sensitive data
 * For truly sensitive data, use Supabase's server-side encryption
 */
export const storeSecureData = (key: string, value: string): void => {
  const encryptedValue = encryptData(value);
  localStorage.setItem(`secure_${key}`, encryptedValue);
};

/**
 * Retrieves securely stored data
 */
export const getSecureData = (key: string): string | null => {
  const encryptedValue = localStorage.getItem(`secure_${key}`);
  if (!encryptedValue) return null;
  return decryptData(encryptedValue);
};

/**
 * Securely clears sensitive data
 */
export const clearSecureData = (key: string): void => {
  localStorage.removeItem(`secure_${key}`);
};

/**
 * Sanitizes data to prevent XSS attacks
 */
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

/**
 * Generates a secure random API key 
 * For development and testing purposes only
 * Production API keys should come from the service provider
 */
export const generateSecureKey = (length: number = 24): string => {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const randomValues = new Uint8Array(length);
  window.crypto.getRandomValues(randomValues);
  
  let result = '';
  for (let i = 0; i < length; i++) {
    result += charset[randomValues[i] % charset.length];
  }
  
  return result;
};

/**
 * Verifies if the current connection is secure (HTTPS)
 */
export const isConnectionSecure = (): boolean => {
  return window.location.protocol === 'https:';
};

/**
 * Checks credential expiry and returns status
 */
export const checkCredentialExpiry = (expiryDate: string | null): {
  hasExpired: boolean;
  daysRemaining: number | null;
  status: 'valid' | 'expiring-soon' | 'expired';
} => {
  if (!expiryDate) return { hasExpired: false, daysRemaining: null, status: 'valid' };
  
  const expiry = new Date(expiryDate);
  const now = new Date();
  
  // Calculate days remaining
  const diffTime = expiry.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) {
    return { hasExpired: true, daysRemaining: diffDays, status: 'expired' };
  } else if (diffDays < 30) {
    return { hasExpired: false, daysRemaining: diffDays, status: 'expiring-soon' };
  } else {
    return { hasExpired: false, daysRemaining: diffDays, status: 'valid' };
  }
};
