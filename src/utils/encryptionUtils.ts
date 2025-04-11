
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
 * Strong field-level encryption using the Web Crypto API
 * Use this for encrypting sensitive fields before storing in database
 */
export const fieldEncrypt = async (data: string, userKey: string): Promise<string> => {
  try {
    // Create a key from the user's password/key
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      encoder.encode(userKey),
      { name: "PBKDF2" },
      false,
      ["deriveBits", "deriveKey"]
    );
    
    // Create salt using random values
    const salt = crypto.getRandomValues(new Uint8Array(16));
    
    // Derive an AES-GCM key using PBKDF2
    const key = await crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt,
        iterations: 100000,
        hash: "SHA-256"
      },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt"]
    );
    
    // Create IV
    const iv = crypto.getRandomValues(new Uint8Array(12));
    
    // Encrypt the data
    const encryptedContent = await crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv
      },
      key,
      encoder.encode(data)
    );
    
    // Combine the salt, iv, and encrypted content into a single array
    const encryptedArray = new Uint8Array(salt.length + iv.length + encryptedContent.byteLength);
    encryptedArray.set(salt, 0);
    encryptedArray.set(iv, salt.length);
    encryptedArray.set(new Uint8Array(encryptedContent), salt.length + iv.length);
    
    // Convert to base64 for storage
    return btoa(String.fromCharCode(...encryptedArray));
  } catch (e) {
    console.error('Field encryption failed:', e);
    return '';
  }
};

/**
 * Decrypt data that was encrypted with fieldEncrypt
 */
export const fieldDecrypt = async (encryptedData: string, userKey: string): Promise<string> => {
  try {
    // Convert from base64
    const encryptedArray = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));
    
    // Extract the salt, iv, and encrypted content
    const salt = encryptedArray.slice(0, 16);
    const iv = encryptedArray.slice(16, 28);
    const encryptedContent = encryptedArray.slice(28);
    
    // Import the user key
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      encoder.encode(userKey),
      { name: "PBKDF2" },
      false,
      ["deriveBits", "deriveKey"]
    );
    
    // Derive the same key using PBKDF2
    const key = await crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt,
        iterations: 100000,
        hash: "SHA-256"
      },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      false,
      ["decrypt"]
    );
    
    // Decrypt the content
    const decryptedContent = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv
      },
      key,
      encryptedContent
    );
    
    // Convert to string
    const decoder = new TextDecoder();
    return decoder.decode(decryptedContent);
  } catch (e) {
    console.error('Field decryption failed:', e);
    return '';
  }
};

/**
 * Utility to encrypt specific fields in an object
 * @param data Object with data to encrypt
 * @param fieldsToEncrypt Array of field names to encrypt
 * @param encryptionKey Key to use for encryption
 */
export const encryptFields = async <T extends Record<string, any>>(
  data: T,
  fieldsToEncrypt: (keyof T)[],
  encryptionKey: string
): Promise<T> => {
  const result = { ...data };
  
  for (const field of fieldsToEncrypt) {
    if (result[field] && typeof result[field] === 'string') {
      result[field] = await fieldEncrypt(result[field], encryptionKey) as any;
    }
  }
  
  return result;
};

/**
 * Utility to decrypt specific fields in an object
 * @param data Object with encrypted data
 * @param fieldsToDecrypt Array of field names to decrypt
 * @param encryptionKey Key to use for decryption
 */
export const decryptFields = async <T extends Record<string, any>>(
  data: T,
  fieldsToDecrypt: (keyof T)[],
  encryptionKey: string
): Promise<T> => {
  const result = { ...data };
  
  for (const field of fieldsToDecrypt) {
    if (result[field] && typeof result[field] === 'string') {
      result[field] = await fieldDecrypt(result[field], encryptionKey) as any;
    }
  }
  
  return result;
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
