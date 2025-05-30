import { z } from 'zod';
import { errorHandler, ERROR_CODES } from '@/services/errorHandling/globalErrorHandler';

// Common validation schemas
export const securitySchemas = {
  email: z.string().email().max(320), // RFC 5321 limit
  password: z.string().min(8).max(128),
  apiKey: z.string().min(10).max(500),
  companyName: z.string().min(1).max(100).regex(/^[a-zA-Z0-9\s\-_.&]+$/),
  crmId: z.string().regex(/^[a-zA-Z0-9\-_]+$/),
  migrationStrategy: z.enum(['full', 'incremental', 'parallel']),
  dataTypes: z.array(z.string().regex(/^[a-zA-Z0-9\-_]+$/)),
  customMapping: z.string().max(5000),
  fieldName: z.string().min(1).max(100).regex(/^[a-zA-Z0-9\-_\.]+$/),
  recordId: z.string().min(1).max(50).regex(/^[a-zA-Z0-9\-_]+$/),
  url: z.string().url().max(500),
  filename: z.string().min(1).max(255).regex(/^[a-zA-Z0-9\-_\.\s]+$/),
  jsonData: z.object({}).passthrough().refine((data) => {
    try {
      JSON.stringify(data);
      return true;
    } catch {
      return false;
    }
  }, 'Invalid JSON data')
};

/**
 * Sanitize HTML to prevent XSS attacks
 */
export function sanitizeHtml(input: string): string {
  // Basic HTML sanitization - in production, use a library like DOMPurify
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Sanitize SQL to prevent injection attacks
 */
export function sanitizeSql(input: string): string {
  // Remove or escape dangerous SQL characters
  return input
    .replace(/['";\\]/g, '')
    .replace(/--/g, '')
    .replace(/\/\*/g, '')
    .replace(/\*\//g, '')
    .replace(/xp_/gi, '')
    .replace(/sp_/gi, '');
}

/**
 * Validate and sanitize user input
 */
export function validateInput<T>(
  input: unknown,
  schema: z.ZodSchema<T>,
  fieldName: string
): T {
  try {
    return schema.parse(input);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const issues = error.issues.map(issue => `${issue.path.join('.')}: ${issue.message}`).join(', ');
      
      throw errorHandler.createError(
        ERROR_CODES.INVALID_INPUT,
        `Validation failed for ${fieldName}: ${issues}`,
        {
          fieldName,
          issues: error.issues,
          input: typeof input === 'string' ? input.substring(0, 100) : input
        }
      );
    }
    throw error;
  }
}

/**
 * Rate limiting utility (basic implementation)
 */
class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private windowMs: number;
  private maxRequests: number;

  constructor(windowMs: number = 60000, maxRequests: number = 100) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
  }

  public isAllowed(identifier: string): boolean {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    
    // Get existing requests for this identifier
    const requests = this.requests.get(identifier) || [];
    
    // Filter out old requests
    const recentRequests = requests.filter(timestamp => timestamp > windowStart);
    
    // Check if under limit
    if (recentRequests.length < this.maxRequests) {
      recentRequests.push(now);
      this.requests.set(identifier, recentRequests);
      return true;
    }
    
    return false;
  }

  public getRemainingRequests(identifier: string): number {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    const requests = this.requests.get(identifier) || [];
    const recentRequests = requests.filter(timestamp => timestamp > windowStart);
    
    return Math.max(0, this.maxRequests - recentRequests.length);
  }

  public reset(identifier: string): void {
    this.requests.delete(identifier);
  }
}

// Global rate limiters for different operations
export const rateLimiters = {
  api: new RateLimiter(60000, 100), // 100 requests per minute
  auth: new RateLimiter(300000, 5), // 5 auth attempts per 5 minutes
  migration: new RateLimiter(3600000, 10), // 10 migration operations per hour
};

/**
 * Check rate limit and throw error if exceeded
 */
export function checkRateLimit(
  identifier: string,
  limiter: RateLimiter,
  operation: string
): void {
  if (!limiter.isAllowed(identifier)) {
    throw errorHandler.createError(
      ERROR_CODES.RATE_LIMITED,
      `Rate limit exceeded for ${operation}`,
      {
        operation,
        identifier: identifier.substring(0, 10) + '...',
        remaining: limiter.getRemainingRequests(identifier)
      }
    );
  }
}

/**
 * Generate secure random strings
 */
export function generateSecureId(length: number = 16): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Validate and clean file uploads
 */
export function validateFileUpload(file: File): void {
  const allowedTypes = [
    'text/csv',
    'application/json',
    'text/plain',
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/gif'
  ];

  const maxSize = 50 * 1024 * 1024; // 50MB

  if (!allowedTypes.includes(file.type)) {
    throw errorHandler.createError(
      ERROR_CODES.FILE_UPLOAD_FAILED,
      `Invalid file type: ${file.type}`,
      { fileType: file.type, fileName: file.name }
    );
  }

  if (file.size > maxSize) {
    throw errorHandler.createError(
      ERROR_CODES.FILE_UPLOAD_FAILED,
      `File too large: ${file.size} bytes`,
      { fileSize: file.size, fileName: file.name, maxSize }
    );
  }

  // Check for suspicious file names
  const suspiciousPatterns = [
    /\.(exe|bat|cmd|com|pif|scr|vbs|js)$/i,
    /[<>:"|?*]/,
    /^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/i
  ];

  if (suspiciousPatterns.some(pattern => pattern.test(file.name))) {
    throw errorHandler.createError(
      ERROR_CODES.FILE_UPLOAD_FAILED,
      `Suspicious file name: ${file.name}`,
      { fileName: file.name }
    );
  }
}

/**
 * Secure data comparison to prevent timing attacks
 */
export function secureCompare(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }

  return result === 0;
}

/**
 * Content Security Policy headers for enhanced security
 */
export const securityHeaders = {
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://cdn.gpteng.co",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "object-src 'none'"
  ].join('; '),
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
};

/**
 * Enhanced security monitoring functions
 */
export function detectAnomalousActivity(activities: any[]): boolean {
  if (activities.length < 5) return false;

  // Check for rapid successive actions
  const recent = activities.slice(0, 5);
  const timeDiffs = recent.slice(1).map((activity, i) => 
    new Date(recent[i].created_at).getTime() - new Date(activity.created_at).getTime()
  );

  // Flag if all actions happened within 1 second
  return timeDiffs.every(diff => diff < 1000);
}

/**
 * Enhanced rate limiting with adaptive thresholds
 */
export class AdaptiveRateLimiter extends RateLimiter {
  private adaptiveThresholds = new Map<string, number>();

  constructor(windowMs: number = 60000, maxRequests: number = 100) {
    super(windowMs, maxRequests);
  }

  public isAllowedAdaptive(identifier: string, operation: string): boolean {
    const baseLimit = this.maxRequests;
    const adaptiveLimit = this.adaptiveThresholds.get(identifier) || baseLimit;
    
    // Temporarily override maxRequests for this check
    const originalMax = this.maxRequests;
    this.maxRequests = adaptiveLimit;
    
    const allowed = this.isAllowed(identifier);
    
    // Restore original limit
    this.maxRequests = originalMax;
    
    return allowed;
  }

  public adjustThreshold(identifier: string, factor: number): void {
    const currentLimit = this.adaptiveThresholds.get(identifier) || this.maxRequests;
    const newLimit = Math.max(1, Math.floor(currentLimit * factor));
    this.adaptiveThresholds.set(identifier, newLimit);
  }
}

/**
 * Security event correlation
 */
export function correlateSecurityEvents(events: any[]): {
  suspicious: boolean;
  riskScore: number;
  reasons: string[];
} {
  let riskScore = 0;
  const reasons: string[] = [];

  // Check for multiple failed authentication attempts
  const authFailures = events.filter(e => e.event_type === 'auth_failure').length;
  if (authFailures > 3) {
    riskScore += 30;
    reasons.push(`${authFailures} authentication failures`);
  }

  // Check for rapid requests from same IP
  const ipCounts = events.reduce((acc, event) => {
    acc[event.ip_address] = (acc[event.ip_address] || 0) + 1;
    return acc;
  }, {});

  const maxFromSingleIP = Math.max(...Object.values(ipCounts) as number[]);
  if (maxFromSingleIP > 50) {
    riskScore += 25;
    reasons.push('High request volume from single IP');
  }

  // Check for suspicious user agents
  const suspiciousUAs = events.filter(e => 
    e.user_agent && (e.user_agent.includes('bot') || e.user_agent.includes('scanner'))
  ).length;
  
  if (suspiciousUAs > 0) {
    riskScore += 15;
    reasons.push('Suspicious user agents detected');
  }

  return {
    suspicious: riskScore > 30,
    riskScore: Math.min(100, riskScore),
    reasons
  };
}
