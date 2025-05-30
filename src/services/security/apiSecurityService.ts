
import { rateLimiters, checkRateLimit, validateInput, securitySchemas } from '@/utils/securityUtils';
import { errorHandler, ERROR_CODES } from '@/services/errorHandling/globalErrorHandler';
import { supabase } from '@/integrations/supabase/client';

/**
 * API Security Service for comprehensive request protection
 */
export class ApiSecurityService {
  private static instance: ApiSecurityService;
  private ipBlocklist = new Set<string>();
  private suspiciousPatterns = [
    /union\s+select/i,
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /\.\.\//,
    /etc\/passwd/,
    /cmd\.exe/i
  ];

  public static getInstance(): ApiSecurityService {
    if (!ApiSecurityService.instance) {
      ApiSecurityService.instance = new ApiSecurityService();
    }
    return ApiSecurityService.instance;
  }

  /**
   * Comprehensive request validation and security checks
   */
  public async validateRequest(request: {
    path: string;
    method: string;
    headers: Record<string, string>;
    body?: any;
    userAgent?: string;
    ip?: string;
  }): Promise<{ isValid: boolean; errors: string[] }> {
    const errors: string[] = [];

    try {
      // 1. Check IP blocklist
      if (request.ip && this.ipBlocklist.has(request.ip)) {
        errors.push('IP address is blocked');
      }

      // 2. Validate User-Agent
      if (!request.userAgent || this.isSuspiciousUserAgent(request.userAgent)) {
        errors.push('Suspicious or missing User-Agent');
      }

      // 3. Check for suspicious patterns in request
      if (this.containsSuspiciousContent(JSON.stringify(request.body || {}))) {
        errors.push('Request contains suspicious content');
      }

      // 4. Validate request size
      const bodySize = JSON.stringify(request.body || {}).length;
      if (bodySize > 1024 * 1024) { // 1MB limit
        errors.push('Request body too large');
      }

      // 5. Check Content-Type for POST/PUT requests
      if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
        const contentType = request.headers['content-type'];
        if (!contentType || !this.isValidContentType(contentType)) {
          errors.push('Invalid or missing Content-Type header');
        }
      }

      return {
        isValid: errors.length === 0,
        errors
      };
    } catch (error) {
      console.error('Request validation error:', error);
      return {
        isValid: false,
        errors: ['Request validation failed']
      };
    }
  }

  /**
   * Rate limiting with different tiers based on operation type
   */
  public checkRateLimits(userId: string, operation: string): void {
    const limiter = this.getRateLimiterForOperation(operation);
    const identifier = userId || 'anonymous';
    
    checkRateLimit(identifier, limiter, operation);
  }

  /**
   * Log security events for monitoring
   */
  public async logSecurityEvent(event: {
    type: 'blocked_request' | 'rate_limit_exceeded' | 'suspicious_activity' | 'auth_failure';
    userId?: string;
    ip?: string;
    userAgent?: string;
    details: Record<string, any>;
  }): Promise<void> {
    try {
      const { error } = await supabase
        .from('security_logs')
        .insert({
          event_type: event.type,
          user_id: event.userId,
          ip_address: event.ip,
          user_agent: event.userAgent,
          event_details: event.details,
          created_at: new Date().toISOString()
        });

      if (error) {
        console.error('Failed to log security event:', error);
      }
    } catch (error) {
      console.error('Security logging error:', error);
    }
  }

  /**
   * Add IP to blocklist
   */
  public blockIP(ip: string, reason: string): void {
    this.ipBlocklist.add(ip);
    this.logSecurityEvent({
      type: 'blocked_request',
      ip,
      details: { reason, action: 'ip_blocked' }
    });
  }

  private isSuspiciousUserAgent(userAgent: string): boolean {
    const suspiciousPatterns = [
      /bot/i,
      /crawler/i,
      /spider/i,
      /scraper/i,
      /curl/i,
      /wget/i,
      /python/i,
      /^$/
    ];

    // Allow legitimate browsers and known good bots
    const allowedPatterns = [
      /Chrome/i,
      /Firefox/i,
      /Safari/i,
      /Edge/i,
      /Opera/i,
      /Googlebot/i,
      /Bingbot/i
    ];

    if (allowedPatterns.some(pattern => pattern.test(userAgent))) {
      return false;
    }

    return suspiciousPatterns.some(pattern => pattern.test(userAgent));
  }

  private containsSuspiciousContent(content: string): boolean {
    return this.suspiciousPatterns.some(pattern => pattern.test(content));
  }

  private isValidContentType(contentType: string): boolean {
    const validTypes = [
      'application/json',
      'application/x-www-form-urlencoded',
      'multipart/form-data',
      'text/plain'
    ];

    return validTypes.some(type => contentType.includes(type));
  }

  private getRateLimiterForOperation(operation: string) {
    switch (operation) {
      case 'auth':
        return rateLimiters.auth;
      case 'migration':
        return rateLimiters.migration;
      default:
        return rateLimiters.api;
    }
  }
}

// Export singleton instance
export const apiSecurity = ApiSecurityService.getInstance();
