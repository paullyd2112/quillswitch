import { apiSecurity } from '@/services/security/apiSecurityService';
import { validateInput, securitySchemas } from '@/utils/security';
import { errorHandler, ERROR_CODES } from '@/services/errorHandling/globalErrorHandler';

/**
 * Security middleware for API requests and form submissions
 */
export class SecurityMiddleware {
  private static instance: SecurityMiddleware;

  public static getInstance(): SecurityMiddleware {
    if (!SecurityMiddleware.instance) {
      SecurityMiddleware.instance = new SecurityMiddleware();
    }
    return SecurityMiddleware.instance;
  }

  /**
   * Validate and secure incoming requests
   */
  public async validateRequest(request: {
    path: string;
    method: string;
    headers: Record<string, string>;
    body?: any;
    userAgent?: string;
    ip?: string;
    userId?: string;
  }): Promise<{ isValid: boolean; sanitizedBody?: any; errors: string[] }> {
    try {
      // Basic request validation
      const validation = await apiSecurity.validateRequest(request);
      
      if (!validation.isValid) {
        await apiSecurity.logSecurityEvent({
          type: 'blocked_request',
          userId: request.userId,
          ip: request.ip,
          userAgent: request.userAgent,
          details: {
            path: request.path,
            method: request.method,
            errors: validation.errors
          }
        });
        
        return {
          isValid: false,
          errors: validation.errors
        };
      }

      // Sanitize request body if present
      let sanitizedBody = request.body;
      if (request.body && typeof request.body === 'object') {
        sanitizedBody = this.sanitizeRequestBody(request.body);
      }

      // Rate limiting check
      if (request.userId) {
        try {
          apiSecurity.checkRateLimits(request.userId, this.getOperationType(request.path));
        } catch (rateLimitError) {
          await apiSecurity.logSecurityEvent({
            type: 'rate_limit_exceeded',
            userId: request.userId,
            ip: request.ip,
            details: {
              path: request.path,
              method: request.method
            }
          });
          
          return {
            isValid: false,
            errors: ['Rate limit exceeded']
          };
        }
      }

      return {
        isValid: true,
        sanitizedBody,
        errors: []
      };
    } catch (error) {
      console.error('Security middleware error:', error);
      return {
        isValid: false,
        errors: ['Security validation failed']
      };
    }
  }

  /**
   * Sanitize request body recursively
   */
  private sanitizeRequestBody(body: any): any {
    if (typeof body === 'string') {
      return this.sanitizeString(body);
    }
    
    if (Array.isArray(body)) {
      return body.map(item => this.sanitizeRequestBody(item));
    }
    
    if (body && typeof body === 'object') {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(body)) {
        // Sanitize the key as well
        const sanitizedKey = this.sanitizeString(key);
        sanitized[sanitizedKey] = this.sanitizeRequestBody(value);
      }
      return sanitized;
    }
    
    return body;
  }

  /**
   * Sanitize individual string values
   */
  private sanitizeString(input: string): string {
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;')
      .replace(/javascript:/gi, '')
      .replace(/vbscript:/gi, '')
      .replace(/on\w+\s*=/gi, '');
  }

  /**
   * Determine operation type for rate limiting
   */
  private getOperationType(path: string): string {
    if (path.includes('/auth/')) return 'auth';
    if (path.includes('/migration/')) return 'migration';
    return 'api';
  }

  /**
   * Validate form data against schema
   */
  public validateFormData(
    data: unknown,
    schema: keyof typeof securitySchemas,
    fieldName: string
  ): any {
    return validateInput(data, securitySchemas[schema] as any, fieldName);
  }

  /**
   * Check if request contains suspicious patterns
   */
  public detectSuspiciousActivity(requests: any[]): {
    suspicious: boolean;
    riskScore: number;
    reasons: string[];
  } {
    let riskScore = 0;
    const reasons: string[] = [];

    // Check for rapid successive requests
    if (requests.length > 50) {
      riskScore += 30;
      reasons.push('High request volume');
    }

    // Check for suspicious patterns in request bodies
    const suspiciousPatterns = [
      /union\s+select/i,
      /<script/i,
      /javascript:/i,
      /eval\(/i,
      /document\.cookie/i
    ];

    const suspiciousRequests = requests.filter(req => 
      suspiciousPatterns.some(pattern => 
        pattern.test(JSON.stringify(req.body || {}))
      )
    );

    if (suspiciousRequests.length > 0) {
      riskScore += 50;
      reasons.push('Suspicious patterns in request data');
    }

    // Check for failed authentication attempts
    const authFailures = requests.filter(req => 
      req.path?.includes('/auth/') && req.status >= 400
    );

    if (authFailures.length > 5) {
      riskScore += 40;
      reasons.push('Multiple authentication failures');
    }

    return {
      suspicious: riskScore > 30,
      riskScore: Math.min(100, riskScore),
      reasons
    };
  }
}

export const securityMiddleware = SecurityMiddleware.getInstance();