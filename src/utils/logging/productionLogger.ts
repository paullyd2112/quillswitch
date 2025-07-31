/**
 * Production-safe structured logging system for QuillSwitch
 * Replaces console.log statements with secure, structured logging
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  CRITICAL = 4
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  category: string;
  message: string;
  metadata?: Record<string, any>;
  userId?: string;
  sessionId?: string;
  traceId?: string;
}

class ProductionLogger {
  private isDevelopment = import.meta.env.DEV;
  private logLevel = this.isDevelopment ? LogLevel.DEBUG : LogLevel.WARN;

  private sanitizeMetadata(metadata: Record<string, any>): Record<string, any> {
    const sanitized = { ...metadata };
    
    // Remove sensitive fields
    const sensitiveKeys = [
      'password', 'token', 'apiKey', 'secret', 'key', 'auth',
      'authorization', 'credential', 'jwt', 'refresh_token',
      'access_token', 'client_secret', 'private_key'
    ];

    const sanitizeObject = (obj: any, depth = 0): any => {
      if (depth > 3) return '[Object too deep]'; // Prevent infinite recursion
      
      if (obj === null || obj === undefined) return obj;
      if (typeof obj !== 'object') return obj;
      
      if (Array.isArray(obj)) {
        return obj.map(item => sanitizeObject(item, depth + 1));
      }

      const result: any = {};
      for (const [key, value] of Object.entries(obj)) {
        const lowerKey = key.toLowerCase();
        const isSensitive = sensitiveKeys.some(sensitiveKey => 
          lowerKey.includes(sensitiveKey)
        );
        
        if (isSensitive) {
          result[key] = '[REDACTED]';
        } else if (typeof value === 'object') {
          result[key] = sanitizeObject(value, depth + 1);
        } else {
          result[key] = value;
        }
      }
      return result;
    };

    return sanitizeObject(sanitized);
  }

  private createLogEntry(
    level: LogLevel,
    category: string,
    message: string,
    metadata?: Record<string, any>
  ): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      category,
      message,
      metadata: metadata ? this.sanitizeMetadata(metadata) : undefined,
      traceId: crypto.randomUUID().substring(0, 8)
    };
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.logLevel;
  }

  private formatMessage(entry: LogEntry): string {
    const levelName = LogLevel[entry.level];
    return `[${entry.timestamp}] ${levelName} [${entry.category}] ${entry.message}${
      entry.metadata ? ` | ${JSON.stringify(entry.metadata)}` : ''
    }`;
  }

  debug(category: string, message: string, metadata?: Record<string, any>): void {
    if (!this.shouldLog(LogLevel.DEBUG)) return;
    
    const entry = this.createLogEntry(LogLevel.DEBUG, category, message, metadata);
    if (this.isDevelopment) {
      console.debug(this.formatMessage(entry));
    }
  }

  info(category: string, message: string, metadata?: Record<string, any>): void {
    if (!this.shouldLog(LogLevel.INFO)) return;
    
    const entry = this.createLogEntry(LogLevel.INFO, category, message, metadata);
    if (this.isDevelopment) {
      console.info(this.formatMessage(entry));
    }
  }

  warn(category: string, message: string, metadata?: Record<string, any>): void {
    if (!this.shouldLog(LogLevel.WARN)) return;
    
    const entry = this.createLogEntry(LogLevel.WARN, category, message, metadata);
    console.warn(this.formatMessage(entry));
    
    // In production, you might want to send warnings to monitoring service
    if (!this.isDevelopment) {
      this.sendToMonitoring(entry);
    }
  }

  error(category: string, message: string, error?: Error, metadata?: Record<string, any>): void {
    if (!this.shouldLog(LogLevel.ERROR)) return;
    
    const enrichedMetadata = {
      ...metadata,
      error: error ? {
        name: error.name,
        message: error.message,
        stack: this.isDevelopment ? error.stack : undefined
      } : undefined
    };

    const entry = this.createLogEntry(LogLevel.ERROR, category, message, enrichedMetadata);
    console.error(this.formatMessage(entry));
    
    // Always send errors to monitoring in production
    if (!this.isDevelopment) {
      this.sendToMonitoring(entry);
    }
  }

  critical(category: string, message: string, error?: Error, metadata?: Record<string, any>): void {
    const enrichedMetadata = {
      ...metadata,
      error: error ? {
        name: error.name,
        message: error.message,
        stack: error.stack
      } : undefined
    };

    const entry = this.createLogEntry(LogLevel.CRITICAL, category, message, enrichedMetadata);
    console.error(`🚨 CRITICAL: ${this.formatMessage(entry)}`);
    
    // Always send critical issues to monitoring
    this.sendToMonitoring(entry);
  }

  private async sendToMonitoring(entry: LogEntry): Promise<void> {
    try {
      // In a real implementation, you would send to your monitoring service
      // For now, we'll just ensure it's logged appropriately
      
      // Example: Send to Supabase edge function for monitoring
      // await fetch('/api/monitoring/log', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(entry)
      // });
    } catch (error) {
      // Fail silently to avoid logging loops
      console.error('Failed to send log to monitoring:', error);
    }
  }

  // Performance tracking
  time(label: string): void {
    if (this.isDevelopment) {
      console.time(label);
    }
  }

  timeEnd(label: string, category = 'Performance'): void {
    if (this.isDevelopment) {
      console.timeEnd(label);
    } else {
      this.info(category, `Timer ended: ${label}`);
    }
  }

  // Utility method for measuring async operations
  async measure<T>(
    operation: string,
    category: string,
    asyncFunction: () => Promise<T>
  ): Promise<T> {
    const startTime = Date.now();
    
    try {
      const result = await asyncFunction();
      const duration = Date.now() - startTime;
      
      this.info(category, `${operation} completed`, { duration_ms: duration });
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      this.error(category, `${operation} failed`, error as Error, { duration_ms: duration });
      throw error;
    }
  }
}

// Export singleton instance
export const logger = new ProductionLogger();

// Development-only console replacement (will be removed in production builds)
export const devLog = import.meta.env.DEV ? console.log.bind(console) : () => {};
export const devWarn = import.meta.env.DEV ? console.warn.bind(console) : () => {};
export const devError = import.meta.env.DEV ? console.error.bind(console) : () => {};