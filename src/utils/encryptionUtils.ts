
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
 */
export const maskSensitiveData = (data: string, visibleChars: number = 4): string => {
  if (!data) return '';
  if (data.length <= visibleChars) return data;
  
  const prefix = data.slice(0, visibleChars);
  const maskedPortion = '*'.repeat(Math.min(data.length - visibleChars, 10));
  return `${prefix}${maskedPortion}`;
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
