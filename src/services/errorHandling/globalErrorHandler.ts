
import { toast } from "sonner";

export interface AppError {
  code: string;
  message: string;
  userMessage: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  context?: Record<string, any>;
  timestamp: Date;
}

export class QuillSwitchError extends Error {
  public code: string;
  public userMessage: string;
  public severity: 'low' | 'medium' | 'high' | 'critical';
  public context?: Record<string, any>;
  public timestamp: Date;

  constructor(
    code: string,
    message: string,
    userMessage: string,
    severity: 'low' | 'medium' | 'high' | 'critical' = 'medium',
    context?: Record<string, any>
  ) {
    super(message);
    this.name = 'QuillSwitchError';
    this.code = code;
    this.userMessage = userMessage;
    this.severity = severity;
    this.context = context;
    this.timestamp = new Date();
  }
}

// Error codes for different categories
export const ERROR_CODES = {
  // Authentication & Authorization
  AUTH_FAILED: 'AUTH_FAILED',
  UNAUTHORIZED: 'UNAUTHORIZED',
  SESSION_EXPIRED: 'SESSION_EXPIRED',

  // CRM Connection
  CRM_CONNECTION_FAILED: 'CRM_CONNECTION_FAILED',
  API_KEY_INVALID: 'API_KEY_INVALID',
  OAUTH_FAILED: 'OAUTH_FAILED',
  RATE_LIMITED: 'RATE_LIMITED',

  // Migration Process
  MIGRATION_SETUP_FAILED: 'MIGRATION_SETUP_FAILED',
  DATA_EXTRACTION_FAILED: 'DATA_EXTRACTION_FAILED',
  DATA_MAPPING_FAILED: 'DATA_MAPPING_FAILED',
  DATA_TRANSFER_FAILED: 'DATA_TRANSFER_FAILED',
  VALIDATION_FAILED: 'VALIDATION_FAILED',

  // Data & Database
  DATABASE_ERROR: 'DATABASE_ERROR',
  ENCRYPTION_FAILED: 'ENCRYPTION_FAILED',
  DECRYPTION_FAILED: 'DECRYPTION_FAILED',

  // Network & External Services
  NETWORK_ERROR: 'NETWORK_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  TIMEOUT: 'TIMEOUT',

  // User Input & Validation
  INVALID_INPUT: 'INVALID_INPUT',
  REQUIRED_FIELD_MISSING: 'REQUIRED_FIELD_MISSING',
  FILE_UPLOAD_FAILED: 'FILE_UPLOAD_FAILED',

  // General
  UNEXPECTED_ERROR: 'UNEXPECTED_ERROR',
  FEATURE_UNAVAILABLE: 'FEATURE_UNAVAILABLE'
} as const;

// User-friendly error messages
const ERROR_MESSAGES: Record<string, string> = {
  [ERROR_CODES.AUTH_FAILED]: "We couldn't sign you in. Please check your credentials and try again.",
  [ERROR_CODES.UNAUTHORIZED]: "You don't have permission to access this feature.",
  [ERROR_CODES.SESSION_EXPIRED]: "Your session has expired. Please sign in again.",
  
  [ERROR_CODES.CRM_CONNECTION_FAILED]: "We couldn't connect to your CRM. Please check your connection settings.",
  [ERROR_CODES.API_KEY_INVALID]: "The API key you provided is invalid. Please check and try again.",
  [ERROR_CODES.OAUTH_FAILED]: "Authorization failed. Please try connecting again.",
  [ERROR_CODES.RATE_LIMITED]: "Too many requests. Please wait a moment and try again.",
  
  [ERROR_CODES.MIGRATION_SETUP_FAILED]: "There was an issue setting up your migration. Please try again.",
  [ERROR_CODES.DATA_EXTRACTION_FAILED]: "We couldn't extract data from your source CRM. Please check your connection.",
  [ERROR_CODES.DATA_MAPPING_FAILED]: "There was an issue with data mapping. Please review your field mappings.",
  [ERROR_CODES.DATA_TRANSFER_FAILED]: "Data transfer failed. Don't worry, no data was lost. Please try again.",
  [ERROR_CODES.VALIDATION_FAILED]: "Some data didn't pass validation. Please review the issues and try again.",
  
  [ERROR_CODES.DATABASE_ERROR]: "We're experiencing technical difficulties. Please try again in a moment.",
  [ERROR_CODES.ENCRYPTION_FAILED]: "Security operation failed. Please try again.",
  [ERROR_CODES.DECRYPTION_FAILED]: "Couldn't access your secure data. Please try again.",
  
  [ERROR_CODES.NETWORK_ERROR]: "Network connection issue. Please check your internet connection.",
  [ERROR_CODES.SERVICE_UNAVAILABLE]: "Service is temporarily unavailable. Please try again later.",
  [ERROR_CODES.TIMEOUT]: "Request timed out. Please try again.",
  
  [ERROR_CODES.INVALID_INPUT]: "Please check your input and try again.",
  [ERROR_CODES.REQUIRED_FIELD_MISSING]: "Please fill in all required fields.",
  [ERROR_CODES.FILE_UPLOAD_FAILED]: "File upload failed. Please try again.",
  
  [ERROR_CODES.UNEXPECTED_ERROR]: "Something unexpected happened. Our team has been notified.",
  [ERROR_CODES.FEATURE_UNAVAILABLE]: "This feature is currently unavailable."
};

export class GlobalErrorHandler {
  private static instance: GlobalErrorHandler;
  private errorLog: AppError[] = [];
  private errorGroups: Map<string, AppError[]> = new Map();
  private performanceMetrics: Array<{
    action: string;
    duration: number;
    timestamp: Date;
    context?: Record<string, any>;
  }> = [];

  public static getInstance(): GlobalErrorHandler {
    if (!GlobalErrorHandler.instance) {
      GlobalErrorHandler.instance = new GlobalErrorHandler();
    }
    return GlobalErrorHandler.instance;
  }

  public handleError(error: Error | QuillSwitchError, context?: Record<string, any>): void {
    console.error('Error occurred:', error, context);

    let appError: AppError;

    if (error instanceof QuillSwitchError) {
      appError = {
        code: error.code,
        message: error.message,
        userMessage: error.userMessage,
        severity: error.severity,
        context: { ...error.context, ...context },
        timestamp: error.timestamp
      };
    } else {
      // Convert generic errors to QuillSwitch errors
      const errorCode = this.categorizeError(error);
      appError = {
        code: errorCode,
        message: error.message,
        userMessage: ERROR_MESSAGES[errorCode] || ERROR_MESSAGES[ERROR_CODES.UNEXPECTED_ERROR],
        severity: this.getSeverityForCode(errorCode),
        context,
        timestamp: new Date()
      };
    }

    // Log and group the error
    this.logError(appError);
    this.groupError(appError);

    // Send to external monitoring (if configured)
    this.sendToMonitoring(appError, error);

    // Show user notification based on severity
    this.showUserNotification(appError);

    // Report critical errors
    if (appError.severity === 'critical') {
      this.reportCriticalError(appError);
    }
  }

  public createError(
    code: keyof typeof ERROR_CODES,
    technicalMessage?: string,
    context?: Record<string, any>
  ): QuillSwitchError {
    const userMessage = ERROR_MESSAGES[code] || ERROR_MESSAGES[ERROR_CODES.UNEXPECTED_ERROR];
    const severity = this.getSeverityForCode(code);
    
    return new QuillSwitchError(
      code,
      technicalMessage || userMessage,
      userMessage,
      severity,
      context
    );
  }

  private categorizeError(error: Error): string {
    const message = error.message.toLowerCase();
    
    if (message.includes('network') || message.includes('fetch')) {
      return ERROR_CODES.NETWORK_ERROR;
    }
    if (message.includes('timeout')) {
      return ERROR_CODES.TIMEOUT;
    }
    if (message.includes('unauthorized') || message.includes('403')) {
      return ERROR_CODES.UNAUTHORIZED;
    }
    if (message.includes('not found') || message.includes('404')) {
      return ERROR_CODES.SERVICE_UNAVAILABLE;
    }
    
    return ERROR_CODES.UNEXPECTED_ERROR;
  }

  private getSeverityForCode(code: string): 'low' | 'medium' | 'high' | 'critical' {
    const criticalCodes = [ERROR_CODES.DATABASE_ERROR, ERROR_CODES.ENCRYPTION_FAILED];
    const highCodes = [ERROR_CODES.MIGRATION_SETUP_FAILED, ERROR_CODES.DATA_TRANSFER_FAILED];
    const lowCodes = [ERROR_CODES.INVALID_INPUT, ERROR_CODES.REQUIRED_FIELD_MISSING];

    if (criticalCodes.includes(code as any)) return 'critical';
    if (highCodes.includes(code as any)) return 'high';
    if (lowCodes.includes(code as any)) return 'low';
    return 'medium';
  }

  private logError(error: AppError): void {
    this.errorLog.push(error);
    
    // Keep only last 100 errors to prevent memory issues
    if (this.errorLog.length > 100) {
      this.errorLog = this.errorLog.slice(-100);
    }
  }

  private showUserNotification(error: AppError): void {
    switch (error.severity) {
      case 'critical':
      case 'high':
        toast.error(error.userMessage, {
          duration: 8000,
          description: "Please try again or contact support if the issue persists."
        });
        break;
      case 'medium':
        toast.error(error.userMessage, {
          duration: 5000
        });
        break;
      case 'low':
        toast.warning(error.userMessage, {
          duration: 3000
        });
        break;
    }
  }

  private groupError(error: AppError): void {
    const groupKey = `${error.code}_${this.getErrorFingerprint(error)}`;
    
    if (!this.errorGroups.has(groupKey)) {
      this.errorGroups.set(groupKey, []);
    }
    
    const group = this.errorGroups.get(groupKey)!;
    group.push(error);
    
    // Keep only last 10 errors per group to prevent memory issues
    if (group.length > 10) {
      group.splice(0, group.length - 10);
    }
  }

  private getErrorFingerprint(error: AppError): string {
    // Create a fingerprint based on error details for grouping
    const parts = [
      error.code,
      error.message.slice(0, 50), // First 50 chars of message
      error.context?.url || '',
      error.context?.component || ''
    ];
    return parts.join('|').toLowerCase();
  }

  private reportCriticalError(error: AppError): void {
    console.error('CRITICAL ERROR:', error);
    
    // Send to external monitoring service if configured
    this.sendCriticalAlert(error);
  }

  private sendCriticalAlert(error: AppError): void {
    // Could integrate with Slack, Discord, email, etc.
    // For now, just enhanced logging
    const alertData = {
      level: 'CRITICAL',
      error: error,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: error.timestamp.toISOString(),
      sessionId: this.getSessionId()
    };
    
    console.error('🚨 CRITICAL ALERT:', alertData);
    
    // Store for potential external sending
    this.storeCriticalAlert(alertData);
  }

  private sendToMonitoring(appError: AppError, originalError: Error | QuillSwitchError): void {
    // Enhanced local monitoring with rich context
    const monitoringData = {
      error: {
        code: appError.code,
        message: appError.message,
        userMessage: appError.userMessage,
        severity: appError.severity,
        stack: originalError.stack,
        context: appError.context
      },
      environment: {
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: appError.timestamp.toISOString(),
        sessionId: this.getSessionId()
      },
      groupCount: this.getErrorGroupCount(appError)
    };
    
    console.error('Error Monitoring:', monitoringData);
    
    // Store for analytics and potential external integration
    this.storeMonitoringData(monitoringData);
  }

  private getErrorGroupCount(error: AppError): number {
    const groupKey = `${error.code}_${this.getErrorFingerprint(error)}`;
    return this.errorGroups.get(groupKey)?.length || 0;
  }

  private getSessionId(): string {
    let sessionId = sessionStorage.getItem('quillswitch_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('quillswitch_session_id', sessionId);
    }
    return sessionId;
  }

  private storeCriticalAlert(alertData: any): void {
    const alerts = JSON.parse(localStorage.getItem('quillswitch_critical_alerts') || '[]');
    alerts.push(alertData);
    // Keep only last 5 critical alerts
    if (alerts.length > 5) {
      alerts.splice(0, alerts.length - 5);
    }
    localStorage.setItem('quillswitch_critical_alerts', JSON.stringify(alerts));
  }

  private storeMonitoringData(data: any): void {
    const monitoring = JSON.parse(localStorage.getItem('quillswitch_monitoring') || '[]');
    monitoring.push(data);
    // Keep only last 50 monitoring entries
    if (monitoring.length > 50) {
      monitoring.splice(0, monitoring.length - 50);
    }
    localStorage.setItem('quillswitch_monitoring', JSON.stringify(monitoring));
  }

  // Performance monitoring methods
  public trackPerformance(action: string, startTime: number, context?: Record<string, any>): void {
    const duration = Date.now() - startTime;
    this.performanceMetrics.push({
      action,
      duration,
      timestamp: new Date(),
      context
    });
    
    // Keep only last 100 performance metrics
    if (this.performanceMetrics.length > 100) {
      this.performanceMetrics = this.performanceMetrics.slice(-100);
    }

    // Alert on slow operations
    if (duration > 3000) { // 3 seconds
      console.warn(`Slow operation detected: ${action} took ${duration}ms`, context);
    }
  }

  public getPerformanceMetrics(action?: string): Array<any> {
    if (action) {
      return this.performanceMetrics.filter(m => m.action === action);
    }
    return this.performanceMetrics.slice();
  }

  // Error grouping and analytics
  public getErrorGroups(): Map<string, AppError[]> {
    return new Map(this.errorGroups);
  }

  public getErrorStats(): {
    totalErrors: number;
    groupCount: number;
    bySeverity: Record<string, number>;
    topErrors: Array<{ key: string; count: number; lastSeen: Date }>;
  } {
    const bySeverity: Record<string, number> = {};
    let totalErrors = 0;

    for (const [key, errors] of this.errorGroups) {
      totalErrors += errors.length;
      errors.forEach(error => {
        bySeverity[error.severity] = (bySeverity[error.severity] || 0) + 1;
      });
    }

    const topErrors = Array.from(this.errorGroups.entries())
      .map(([key, errors]) => ({
        key,
        count: errors.length,
        lastSeen: errors[errors.length - 1]?.timestamp || new Date()
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      totalErrors,
      groupCount: this.errorGroups.size,
      bySeverity,
      topErrors
    };
  }

  public getRecentErrors(count: number = 10): AppError[] {
    return this.errorLog.slice(-count);
  }

  public getCriticalAlerts(): any[] {
    return JSON.parse(localStorage.getItem('quillswitch_critical_alerts') || '[]');
  }

  public getMonitoringData(): any[] {
    return JSON.parse(localStorage.getItem('quillswitch_monitoring') || '[]');
  }

  public clearErrorLog(): void {
    this.errorLog = [];
    this.errorGroups.clear();
    this.performanceMetrics = [];
    localStorage.removeItem('quillswitch_critical_alerts');
    localStorage.removeItem('quillswitch_monitoring');
  }
}

// Global error handler instance
export const errorHandler = GlobalErrorHandler.getInstance();

// Global error handler for uncaught errors
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    errorHandler.handleError(new Error(event.message), {
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno
    });
  });

  window.addEventListener('unhandledrejection', (event) => {
    errorHandler.handleError(new Error(`Unhandled promise rejection: ${event.reason}`), {
      reason: event.reason
    });
  });
}
