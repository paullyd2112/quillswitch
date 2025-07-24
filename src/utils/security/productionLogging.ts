/**
 * Production-safe logging utility
 * Replaces console.log with structured logging
 */

export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
}

interface LogContext {
  userId?: string;
  sessionId?: string;
  component?: string;
  action?: string;
  metadata?: Record<string, any>;
  eventType?: string;
  data?: any;
  [key: string]: any; // Allow additional properties
}

class ProductionLogger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  private sanitizeData(data: any): any {
    if (typeof data === 'object' && data !== null) {
      const sanitized = { ...data };
      
      // Remove sensitive fields
      const sensitiveFields = ['password', 'token', 'key', 'secret', 'credential'];
      for (const field of sensitiveFields) {
        if (field in sanitized) {
          sanitized[field] = '[REDACTED]';
        }
      }
      
      return sanitized;
    }
    
    return data;
  }

  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const sanitizedContext = context ? this.sanitizeData(context) : {};
    
    return JSON.stringify({
      timestamp,
      level,
      message,
      ...sanitizedContext,
    });
  }

  error(message: string, context?: LogContext): void {
    const formattedMessage = this.formatMessage(LogLevel.ERROR, message, context);
    console.error(formattedMessage);
  }

  warn(message: string, context?: LogContext): void {
    const formattedMessage = this.formatMessage(LogLevel.WARN, message, context);
    if (this.isDevelopment) {
      console.warn(formattedMessage);
    }
  }

  info(message: string, context?: LogContext): void {
    const formattedMessage = this.formatMessage(LogLevel.INFO, message, context);
    if (this.isDevelopment) {
      console.info(formattedMessage);
    }
  }

  debug(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      const formattedMessage = this.formatMessage(LogLevel.DEBUG, message, context);
      console.log(formattedMessage);
    }
  }

  // Security-specific logging methods
  securityEvent(event: string, context: LogContext): void {
    this.warn(`Security Event: ${event}`, {
      ...context,
      eventType: 'security',
    });
  }

  auditLog(action: string, context: LogContext): void {
    this.info(`Audit: ${action}`, {
      ...context,
      eventType: 'audit',
    });
  }

  authEvent(event: string, context: LogContext): void {
    this.info(`Auth: ${event}`, {
      ...context,
      eventType: 'authentication',
    });
  }
}

// Export singleton instance
export const logger = new ProductionLogger();

// Development-only debug function
export const devLog = (message: string, data?: any) => {
  if (process.env.NODE_ENV === 'development') {
    logger.debug(message, { data });
  }
};