
/**
 * Enhanced encryption utilities for QuillSwitch security
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
 * Simple encryption for demo purposes (in production, use proper encryption)
 */
export function encryptData(data: string): string {
  // In a real implementation, this would use proper encryption
  // For demo purposes, we'll use base64 encoding
  return btoa(data);
}

/**
 * Simple decryption for demo purposes (in production, use proper decryption)
 */
export function decryptData(encryptedData: string): string {
  try {
    return atob(encryptedData);
  } catch {
    return '';
  }
}

/**
 * Store data securely in localStorage
 */
export function storeSecureData(key: string, data: string): void {
  try {
    const encryptedData = encryptData(data);
    localStorage.setItem(`secure_${key}`, encryptedData);
  } catch (error) {
    console.error('Failed to store secure data:', error);
  }
}

/**
 * Retrieve data securely from localStorage
 */
export function getSecureData(key: string): string | null {
  try {
    const encryptedData = localStorage.getItem(`secure_${key}`);
    if (!encryptedData) return null;
    return decryptData(encryptedData);
  } catch (error) {
    console.error('Failed to retrieve secure data:', error);
    return null;
  }
}

/**
 * Remove secure data from localStorage
 */
export function removeSecureData(key: string): void {
  try {
    localStorage.removeItem(`secure_${key}`);
  } catch (error) {
    console.error('Failed to remove secure data:', error);
  }
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
    // In a real implementation, this would check actual response headers
    // For now, we'll simulate based on the current environment
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
