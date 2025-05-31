
import { toast } from "@/hooks/use-toast";
import { logUserActivity } from "../activityService";

/**
 * Comprehensive Error Handling for Production Migrations
 */

export interface MigrationError {
  id: string;
  type: 'network' | 'validation' | 'transformation' | 'api' | 'system' | 'authentication';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  details?: any;
  timestamp: string;
  recordId?: string;
  context?: string;
  retryable: boolean;
  suggestedAction?: string;
}

export interface ErrorRecoveryStrategy {
  type: 'retry' | 'skip' | 'transform' | 'manual' | 'fallback';
  maxAttempts: number;
  backoffMs: number;
  condition?: (error: MigrationError) => boolean;
}

export class MigrationErrorHandler {
  private errors: MigrationError[] = [];
  private recoveryStrategies: Map<string, ErrorRecoveryStrategy> = new Map();
  private retryAttempts: Map<string, number> = new Map();

  constructor() {
    this.initializeDefaultStrategies();
  }

  private initializeDefaultStrategies(): void {
    // Network errors - retry with exponential backoff
    this.recoveryStrategies.set('network', {
      type: 'retry',
      maxAttempts: 3,
      backoffMs: 1000,
      condition: (error) => error.type === 'network' && error.severity !== 'critical'
    });

    // Validation errors - attempt transformation
    this.recoveryStrategies.set('validation', {
      type: 'transform',
      maxAttempts: 1,
      backoffMs: 0,
      condition: (error) => error.type === 'validation'
    });

    // API rate limits - retry with longer backoff
    this.recoveryStrategies.set('api', {
      type: 'retry',
      maxAttempts: 5,
      backoffMs: 5000,
      condition: (error) => error.type === 'api' && error.message.includes('rate limit')
    });

    // Authentication errors - manual intervention required
    this.recoveryStrategies.set('authentication', {
      type: 'manual',
      maxAttempts: 0,
      backoffMs: 0,
      condition: (error) => error.type === 'authentication'
    });
  }

  /**
   * Handle a migration error with automatic recovery attempts
   */
  async handleError(
    error: any,
    context: string,
    recordId?: string,
    projectId?: string
  ): Promise<{ shouldRetry: boolean; delayMs: number; action: string }> {
    const migrationError = this.classifyError(error, context, recordId);
    this.errors.push(migrationError);

    // Log error for audit trail
    if (projectId) {
      await this.logError(migrationError, projectId);
    }

    // Determine recovery strategy
    const strategy = this.getRecoveryStrategy(migrationError);
    const retryKey = `${migrationError.type}_${recordId || 'global'}`;
    const currentAttempts = this.retryAttempts.get(retryKey) || 0;

    if (strategy && currentAttempts < strategy.maxAttempts) {
      this.retryAttempts.set(retryKey, currentAttempts + 1);
      
      const delayMs = strategy.backoffMs * Math.pow(2, currentAttempts);
      
      return {
        shouldRetry: true,
        delayMs,
        action: this.getActionDescription(strategy, migrationError)
      };
    }

    // No more retries available
    this.showUserError(migrationError);
    
    return {
      shouldRetry: false,
      delayMs: 0,
      action: migrationError.suggestedAction || 'Manual intervention required'
    };
  }

  private classifyError(error: any, context: string, recordId?: string): MigrationError {
    const errorId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Network errors
    if (error.name === 'NetworkError' || error.message?.includes('network') || error.code === 'NETWORK_ERROR') {
      return {
        id: errorId,
        type: 'network',
        severity: 'medium',
        message: 'Network connection error during migration',
        details: error,
        timestamp: new Date().toISOString(),
        recordId,
        context,
        retryable: true,
        suggestedAction: 'Check internet connection and retry'
      };
    }

    // API errors
    if (error.status >= 400 && error.status < 500) {
      return {
        id: errorId,
        type: error.status === 401 ? 'authentication' : 'api',
        severity: error.status === 429 ? 'medium' : 'high',
        message: `API error: ${error.status} ${error.statusText}`,
        details: error,
        timestamp: new Date().toISOString(),
        recordId,
        context,
        retryable: error.status === 429 || error.status >= 500,
        suggestedAction: error.status === 401 ? 'Check API credentials' : 'Review API usage'
      };
    }

    // Validation errors
    if (error.message?.includes('validation') || error.name === 'ValidationError') {
      return {
        id: errorId,
        type: 'validation',
        severity: 'low',
        message: 'Data validation failed',
        details: error,
        timestamp: new Date().toISOString(),
        recordId,
        context,
        retryable: true,
        suggestedAction: 'Review field mappings and data formats'
      };
    }

    // Transformation errors
    if (error.message?.includes('transform') || context.includes('mapping')) {
      return {
        id: errorId,
        type: 'transformation',
        severity: 'medium',
        message: 'Data transformation failed',
        details: error,
        timestamp: new Date().toISOString(),
        recordId,
        context,
        retryable: false,
        suggestedAction: 'Review transformation rules'
      };
    }

    // Generic system error
    return {
      id: errorId,
      type: 'system',
      severity: 'high',
      message: error.message || 'Unknown error occurred',
      details: error,
      timestamp: new Date().toISOString(),
      recordId,
      context,
      retryable: false,
      suggestedAction: 'Contact support if error persists'
    };
  }

  private getRecoveryStrategy(error: MigrationError): ErrorRecoveryStrategy | null {
    for (const [key, strategy] of this.recoveryStrategies) {
      if (strategy.condition && strategy.condition(error)) {
        return strategy;
      }
    }
    return null;
  }

  private getActionDescription(strategy: ErrorRecoveryStrategy, error: MigrationError): string {
    switch (strategy.type) {
      case 'retry':
        return `Retrying ${error.type} operation`;
      case 'transform':
        return 'Attempting data transformation';
      case 'skip':
        return 'Skipping problematic record';
      case 'fallback':
        return 'Using fallback method';
      default:
        return 'Processing error';
    }
  }

  private showUserError(error: MigrationError): void {
    const title = `Migration ${error.type} Error`;
    const description = `${error.message}. ${error.suggestedAction || ''}`;

    toast({
      title,
      description,
      variant: error.severity === 'critical' || error.severity === 'high' ? 'destructive' : 'default'
    });
  }

  private async logError(error: MigrationError, projectId: string): Promise<void> {
    try {
      await logUserActivity({
        project_id: projectId,
        activity_type: 'migration_error',
        activity_description: `${error.type} error: ${error.message}`,
        activity_details: {
          errorId: error.id,
          errorType: error.type,
          severity: error.severity,
          recordId: error.recordId,
          context: error.context,
          retryable: error.retryable
        }
      });
    } catch (logError) {
      console.error('Failed to log migration error:', logError);
    }
  }

  /**
   * Get error statistics for reporting
   */
  getErrorStatistics(): {
    totalErrors: number;
    errorsByType: Record<string, number>;
    errorsBySeverity: Record<string, number>;
    retryableErrors: number;
  } {
    const errorsByType: Record<string, number> = {};
    const errorsBySeverity: Record<string, number> = {};
    let retryableErrors = 0;

    this.errors.forEach(error => {
      errorsByType[error.type] = (errorsByType[error.type] || 0) + 1;
      errorsBySeverity[error.severity] = (errorsBySeverity[error.severity] || 0) + 1;
      if (error.retryable) retryableErrors++;
    });

    return {
      totalErrors: this.errors.length,
      errorsByType,
      errorsBySeverity,
      retryableErrors
    };
  }

  /**
   * Clear error history
   */
  clearErrors(): void {
    this.errors = [];
    this.retryAttempts.clear();
  }

  /**
   * Get recent errors for display
   */
  getRecentErrors(limit: number = 10): MigrationError[] {
    return this.errors
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }
}

/**
 * Singleton error handler instance
 */
export const migrationErrorHandler = new MigrationErrorHandler();
