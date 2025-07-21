
/**
 * Security Configuration for QuillSwitch
 * Centralized security settings and policies
 */

export const SECURITY_CONFIG = {
  // Authentication settings
  auth: {
    maxLoginAttempts: 5,
    lockoutDuration: 15 * 60 * 1000, // 15 minutes
    sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
    passwordMinLength: 8,
    requireMFA: false, // TODO: Enable for production
  },

  // Rate limiting
  rateLimit: {
    api: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 100,
    },
    auth: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 5,
    },
    credentialAccess: {
      windowMs: 60 * 60 * 1000, // 1 hour
      maxRequests: 50,
    },
  },

  // Content Security Policy with OAuth support
  csp: {
    directives: {
      'default-src': ["'self'"],
      'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://cdn.jsdelivr.net", "https://accounts.google.com"],
      'style-src': ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://accounts.google.com"],
      'font-src': ["'self'", "https://fonts.gstatic.com"],
      'img-src': ["'self'", "data:", "https:"],
      'connect-src': ["'self'", "https://*.supabase.co", "wss://*.supabase.co", "https://accounts.google.com", "https://oauth2.googleapis.com"],
      'frame-src': ["'self'", "https://accounts.google.com"],
      'frame-ancestors': ["'self'"],
      'object-src': ["'none'"],
      'base-uri': ["'self'"],
    },
  },

  // Credential storage
  credentials: {
    encryptionKeyRotationDays: 90,
    maxCredentialAge: 365 * 24 * 60 * 60 * 1000, // 1 year
    auditLogRetentionDays: 90,
  },

  // Monitoring
  monitoring: {
    enableSecurityHeaders: true,
    enableAuditLogging: true,
    enableRateLimitMonitoring: true,
    alertThresholds: {
      failedAuthAttempts: 10,
      suspiciousCredentialAccess: 100,
      rateLimitViolations: 5,
    },
  },
} as const;

export type SecurityConfig = typeof SECURITY_CONFIG;
