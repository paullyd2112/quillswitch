/**
 * TOTP utilities for Supabase Edge Functions
 * This is a shared module that provides TOTP functionality
 */

// Base32 alphabet
const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

// Base32 encoding
export function base32Encode(buffer: Uint8Array): string {
  let bits = 0;
  let value = 0;
  let output = '';

  for (let i = 0; i < buffer.length; i++) {
    value = (value << 8) | buffer[i];
    bits += 8;

    while (bits >= 5) {
      output += BASE32_ALPHABET[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }

  if (bits > 0) {
    output += BASE32_ALPHABET[(value << (5 - bits)) & 31];
  }

  return output;
}

// Base32 decoding
export function base32Decode(encoded: string): Uint8Array {
  const cleanInput = encoded.replace(/[^A-Z2-7]/gi, '').toUpperCase();
  const buffer = new ArrayBuffer(Math.ceil(cleanInput.length * 5 / 8));
  const view = new Uint8Array(buffer);
  
  let bits = 0;
  let value = 0;
  let index = 0;
  
  for (let i = 0; i < cleanInput.length; i++) {
    const char = cleanInput[i];
    const charValue = BASE32_ALPHABET.indexOf(char);
    
    if (charValue === -1) continue;
    
    value = (value << 5) | charValue;
    bits += 5;
    
    if (bits >= 8) {
      view[index++] = (value >>> (bits - 8)) & 255;
      bits -= 8;
    }
  }
  
  return new Uint8Array(buffer, 0, index);
}

// Generate HMAC-SHA1
async function hmacSha1(key: Uint8Array, message: Uint8Array): Promise<Uint8Array> {
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    key,
    { name: 'HMAC', hash: 'SHA-1' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, message);
  return new Uint8Array(signature);
}

// Generate TOTP code
export async function generateTOTPCode(secret: string, timeWindow?: number): Promise<string> {
  const secretBytes = base32Decode(secret);
  const time = Math.floor((timeWindow || Date.now()) / 30000);
  
  // Convert time to 8-byte array
  const timeBytes = new Uint8Array(8);
  for (let i = 7; i >= 0; i--) {
    timeBytes[i] = time & 0xff;
    time >>> 8;
  }
  
  const hmac = await hmacSha1(secretBytes, timeBytes);
  const offset = hmac[hmac.length - 1] & 0xf;
  
  const code = ((hmac[offset] & 0x7f) << 24) |
               ((hmac[offset + 1] & 0xff) << 16) |
               ((hmac[offset + 2] & 0xff) << 8) |
               (hmac[offset + 3] & 0xff);
  
  return (code % 1000000).toString().padStart(6, '0');
}

// Verify TOTP code with time window tolerance
export async function verifyTOTPCode(secret: string, code: string, window = 1): Promise<boolean> {
  const currentTime = Date.now();
  
  // Check current window and adjacent windows for clock drift tolerance
  for (let i = -window; i <= window; i++) {
    const timeWindow = currentTime + (i * 30000);
    const expectedCode = await generateTOTPCode(secret, timeWindow);
    
    if (expectedCode === code) {
      return true;
    }
  }
  
  return false;
}

// Generate backup codes
export function generateBackupCodes(count = 8): string[] {
  const codes: string[] = [];
  
  for (let i = 0; i < count; i++) {
    const randomBytes = new Uint8Array(6);
    crypto.getRandomValues(randomBytes);
    
    // Convert to alphanumeric string
    const code = Array.from(randomBytes)
      .map(byte => (byte % 36).toString(36))
      .join('')
      .toUpperCase()
      .slice(0, 8);
    
    codes.push(code);
  }
  
  return codes;
}