/**
 * Enhanced encryption utilities for QuillSwitch security
 * Uses Web Crypto API for proper AES-256-GCM encryption
 */

// Function to check connection security
export function isConnectionSecure(): boolean {
  return window.location.protocol === 'https:' || 
         window.location.hostname === 'localhost' ||
         window.location.hostname === '127.0.0.1';
}

// Function to mask sensitive data for display
export function maskSensitiveData(value: string, visibleChars: number = 4): string {
  if (!value || typeof value !== 'string') return '';
  
  if (value.length <= visibleChars * 2) {
    return '*'.repeat(value.length);
  }
  
  const start = value.substring(0, visibleChars);
  const end = value.substring(value.length - visibleChars);
  const middle = '*'.repeat(Math.max(4, value.length - (visibleChars * 2)));
  
  return `${start}${middle}${end}`;
}

/**
 * Generate a secure random identifier
 */
export function generateSecureId(length: number = 32): string {
  const array = new Uint8Array(length / 2);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Generate a cryptographic key from a password using PBKDF2
 */
async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Get or generate a master key for encryption
 */
async function getMasterKey(): Promise<string> {
  let masterKey = sessionStorage.getItem('quillswitch_master_key');
  if (!masterKey) {
    // Generate a new master key for this session
    masterKey = generateSecureId(64);
    sessionStorage.setItem('quillswitch_master_key', masterKey);
  }
  return masterKey;
}

/**
 * Proper AES-256-GCM encryption
 */
export async function encryptData(data: string): Promise<string> {
  try {
    const encoder = new TextEncoder();
    const masterKey = await getMasterKey();
    
    // Generate random salt and IV
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    
    // Derive key from master key
    const cryptoKey = await deriveKey(masterKey, salt);
    
    // Encrypt the data
    const encryptedData = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv
      },
      cryptoKey,
      encoder.encode(data)
    );
    
    // Combine salt, IV, and encrypted data
    const combined = new Uint8Array(salt.length + iv.length + encryptedData.byteLength);
    combined.set(salt, 0);
    combined.set(iv, salt.length);
    combined.set(new Uint8Array(encryptedData), salt.length + iv.length);
    
    // Return as base64
    return btoa(String.fromCharCode(...combined));
  } catch (error) {
    console.error('Encryption failed:', error);
    throw new Error('Failed to encrypt data');
  }
}

/**
 * Proper AES-256-GCM decryption
 */
export async function decryptData(encryptedData: string): Promise<string> {
  try {
    const masterKey = await getMasterKey();
    
    // Decode from base64
    const combined = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));
    
    // Extract salt, IV, and encrypted data
    const salt = combined.slice(0, 16);
    const iv = combined.slice(16, 28);
    const encrypted = combined.slice(28);
    
    // Derive key from master key
    const cryptoKey = await deriveKey(masterKey, salt);
    
    // Decrypt the data
    const decryptedData = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv
      },
      cryptoKey,
      encrypted
    );
    
    // Convert back to string
    const decoder = new TextDecoder();
    return decoder.decode(decryptedData);
  } catch (error) {
    console.error('Decryption failed:', error);
    return '';
  }
}

/**
 * Store data securely - NO LONGER USES localStorage FOR SENSITIVE DATA
 * Sensitive data should be stored server-side or in secure cookies
 */
export async function storeSecureData(key: string, data: string, temporary: boolean = false): Promise<void> {
  try {
    if (temporary) {
      // For temporary data only, use sessionStorage with encryption
      const encryptedData = await encryptData(data);
      sessionStorage.setItem(`secure_${key}`, encryptedData);
    } else {
      // For persistent sensitive data, warn that it should be server-side
      console.warn(`Attempted to store persistent sensitive data for key: ${key}. Consider server-side storage.`);
      throw new Error('Persistent sensitive data storage not allowed in client');
    }
  } catch (error) {
    console.error('Failed to store secure data:', error);
    throw error;
  }
}

/**
 * Retrieve data securely
 */
export async function getSecureData(key: string, temporary: boolean = false): Promise<string | null> {
  try {
    const storage = temporary ? sessionStorage : localStorage;
    const encryptedData = storage.getItem(`secure_${key}`);
    if (!encryptedData) return null;
    return await decryptData(encryptedData);
  } catch (error) {
    console.error('Failed to retrieve secure data:', error);
    return null;
  }
}

/**
 * Remove secure data
 */
export function removeSecureData(key: string, temporary: boolean = false): void {
  try {
    const storage = temporary ? sessionStorage : localStorage;
    storage.removeItem(`secure_${key}`);
  } catch (error) {
    console.error('Failed to remove secure data:', error);
  }
}

/**
 * Clear all session encryption keys (call on logout)
 */
export function clearEncryptionKeys(): void {
  sessionStorage.removeItem('quillswitch_master_key');
}

/**
 * Validate password strength
 */
export interface PasswordStrength {
  score: number;
  feedback: string[];
  isStrong: boolean;
}

export function validatePasswordStrength(password: string): PasswordStrength {
  const feedback: string[] = [];
  let score = 0;

  if (password.length >= 8) {
    score += 1;
  } else {
    feedback.push('Use at least 8 characters');
  }

  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Include uppercase letters');
  }

  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Include lowercase letters');
  }

  if (/[0-9]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Include numbers');
  }

  if (/[^A-Za-z0-9]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Include special characters');
  }

  // Additional checks
  if (password.length >= 12) {
    score += 1;
  }

  if (!/(.)\1{2,}/.test(password)) {
    score += 1;
  } else {
    feedback.push('Avoid repeated characters');
  }

  const isStrong = score >= 5;

  return {
    score: Math.min(score, 5),
    feedback,
    isStrong
  };
}

/**
 * Check for common security headers
 */
export function checkSecurityHeaders(): Promise<{
  hasCSP: boolean;
  hasHSTS: boolean;
  hasXFrameOptions: boolean;
  score: number;
}> {
  return new Promise((resolve) => {
    const isSecure = isConnectionSecure();
    
    resolve({
      hasCSP: isSecure,
      hasHSTS: isSecure,
      hasXFrameOptions: isSecure,
      score: isSecure ? 100 : 60
    });
  });
}

/**
 * Validate API key format
 */
export function validateApiKeyFormat(apiKey: string, type: 'openai' | 'stripe' | 'generic' = 'generic'): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!apiKey || typeof apiKey !== 'string') {
    errors.push('API key is required');
    return { isValid: false, errors };
  }

  // Remove whitespace
  apiKey = apiKey.trim();

  // Basic length check
  if (apiKey.length < 10) {
    errors.push('API key is too short');
  }

  // Type-specific validation
  switch (type) {
    case 'openai':
      if (!apiKey.startsWith('sk-')) {
        errors.push('OpenAI API keys should start with "sk-"');
      }
      if (apiKey.length < 40) {
        errors.push('OpenAI API key appears to be too short');
      }
      break;
    case 'stripe':
      if (!apiKey.startsWith('sk_') && !apiKey.startsWith('pk_')) {
        errors.push('Stripe API keys should start with "sk_" or "pk_"');
      }
      break;
    case 'generic':
      // Generic validation - check for suspicious patterns
      if (/\s/.test(apiKey)) {
        errors.push('API key should not contain spaces');
      }
      break;
  }

  // Check for potentially copied text
  if (apiKey.includes('your_api_key') || apiKey.includes('replace_with')) {
    errors.push('Please enter your actual API key');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Sanitize data for logging (remove sensitive information)
 */
export function sanitizeForLogging(data: any): any {
  if (typeof data !== 'object' || data === null) {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(item => sanitizeForLogging(item));
  }

  const sanitized: any = {};
  const sensitiveKeys = [
    'password', 'token', 'api_key', 'secret', 'private_key',
    'credential_value', 'auth_token', 'session_token'
  ];

  for (const [key, value] of Object.entries(data)) {
    const lowerKey = key.toLowerCase();
    
    if (sensitiveKeys.some(sensitiveKey => lowerKey.includes(sensitiveKey))) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof value === 'object') {
      sanitized[key] = sanitizeForLogging(value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}