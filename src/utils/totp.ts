/**
 * TOTP (Time-based One-Time Password) utilities for 2FA
 */
import { Buffer } from 'buffer';

// Simple base32 encoding/decoding implementation
const BASE32_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

export function base32Encode(buffer: Uint8Array): string {
  let result = '';
  let bits = 0;
  let value = 0;

  for (let i = 0; i < buffer.length; i++) {
    value = (value << 8) | buffer[i];
    bits += 8;

    while (bits >= 5) {
      result += BASE32_CHARS[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }

  if (bits > 0) {
    result += BASE32_CHARS[(value << (5 - bits)) & 31];
  }

  return result;
}

export function base32Decode(encoded: string): Uint8Array {
  const cleanInput = encoded.toUpperCase().replace(/[^A-Z2-7]/g, '');
  const result = new Uint8Array(Math.floor((cleanInput.length * 5) / 8));
  let bits = 0;
  let value = 0;
  let index = 0;

  for (let i = 0; i < cleanInput.length; i++) {
    const char = cleanInput[i];
    const charIndex = BASE32_CHARS.indexOf(char);
    if (charIndex === -1) continue;

    value = (value << 5) | charIndex;
    bits += 5;

    if (bits >= 8) {
      result[index++] = (value >>> (bits - 8)) & 255;
      bits -= 8;
    }
  }

  return result.slice(0, index);
}

export function generateTOTPSecret(): string {
  const buffer = new Uint8Array(20);
  crypto.getRandomValues(buffer);
  return base32Encode(buffer);
}

export async function generateTOTPCode(secret: string, timeWindow?: number): Promise<string> {
  const time = Math.floor((timeWindow || Date.now()) / 30000);
  const buffer = new ArrayBuffer(8);
  const view = new DataView(buffer);
  view.setUint32(4, time, false);
  
  const key = base32Decode(secret);
  
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    key.buffer.slice(key.byteOffset, key.byteOffset + key.byteLength) as ArrayBuffer,
    { name: 'HMAC', hash: 'SHA-1' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, buffer);
  const hash = new Uint8Array(signature);
  const offset = hash[hash.length - 1] & 0xf;
  const code = ((hash[offset] & 0x7f) << 24) |
              ((hash[offset + 1] & 0xff) << 16) |
              ((hash[offset + 2] & 0xff) << 8) |
              (hash[offset + 3] & 0xff);
  
  return (code % 1000000).toString().padStart(6, '0');
}

export function verifyTOTPCode(secret: string, code: string, window = 1): Promise<boolean> {
  const currentTime = Date.now();
  const promises: Promise<string>[] = [];
  
  // Check current window and surrounding windows for clock drift
  for (let i = -window; i <= window; i++) {
    const timeWindow = currentTime + (i * 30000);
    promises.push(generateTOTPCode(secret, timeWindow));
  }
  
  return Promise.all(promises).then(codes => {
    return codes.includes(code);
  });
}

export function generateTOTPUrl(secret: string, accountName: string, issuer = 'QuillSwitch'): string {
  const params = new URLSearchParams({
    secret,
    issuer,
    algorithm: 'SHA1',
    digits: '6',
    period: '30'
  });
  
  return `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(accountName)}?${params}`;
}

export function generateBackupCodes(count = 8): string[] {
  const codes: string[] = [];
  for (let i = 0; i < count; i++) {
    const buffer = new Uint8Array(4);
    crypto.getRandomValues(buffer);
    const code = Array.from(buffer)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase();
    codes.push(code);
  }
  return codes;
}