
/**
 * Security Headers Configuration
 * Implements security headers for production deployment with OAuth support
 */

import { SECURITY_CONFIG } from './securityConfig';

export function generateCSPHeader(): string {
  const directives = SECURITY_CONFIG.csp.directives;
  
  return Object.entries(directives)
    .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
    .join('; ');
}

export const SECURITY_HEADERS = {
  // Content Security Policy with OAuth support
  'Content-Security-Policy': generateCSPHeader(),
  
  // Allow OAuth frames (changed from DENY to SAMEORIGIN)
  'X-Frame-Options': 'SAMEORIGIN',
  
  // Prevent MIME type sniffing
  'X-Content-Type-Options': 'nosniff',
  
  // Enable XSS protection
  'X-XSS-Protection': '1; mode=block',
  
  // Force HTTPS
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  
  // Referrer policy
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  
  // Permissions policy
  'Permissions-Policy': [
    'camera=()',
    'microphone=()',
    'geolocation=()',
    'payment=()',
    'usb=()',
  ].join(', '),
  
  // Remove server identification
  'X-Powered-By': '',
  'Server': '',
} as const;

export function applySecurityHeaders(response: Response): Response {
  Object.entries(SECURITY_HEADERS).forEach(([header, value]) => {
    if (value) {
      response.headers.set(header, value);
    } else {
      response.headers.delete(header);
    }
  });
  
  return response;
}

// For development use - log security headers status
export function validateSecurityHeaders(): { passed: boolean; issues: string[] } {
  const issues: string[] = [];
  
  if (!SECURITY_CONFIG.monitoring.enableSecurityHeaders) {
    issues.push('Security headers are disabled');
  }
  
  // Check for OAuth compatibility
  const cspHeader = generateCSPHeader();
  if (!cspHeader.includes('https://accounts.google.com')) {
    issues.push('Google OAuth domains not included in CSP');
  }
  
  return {
    passed: issues.length === 0,
    issues,
  };
}
