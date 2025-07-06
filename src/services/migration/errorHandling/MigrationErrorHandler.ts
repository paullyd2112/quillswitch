import { supabase } from '@/integrations/supabase/client';

export interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
}

export interface MigrationError {
  id?: string;
  project_id: string;
  object_type_id: string;
  record_id?: string;
  error_type: string;
  error_message: string;
  error_details: any;
  resolved: boolean;
  resolution_notes?: string;
  created_at?: string;
}

export class MigrationErrorHandler {
  private static defaultRetryConfig: RetryConfig = {
    maxRetries: 3,
    baseDelay: 1000,
    maxDelay: 30000,
    backoffMultiplier: 2
  };

  static async executeWithRetry<T>(
    operation: () => Promise<T>,
    config: Partial<RetryConfig> = {},
    context: {
      project_id: string;
      object_type: string;
      record_id?: string;
      operation_type: string;
    }
  ): Promise<T> {
    const retryConfig = { ...this.defaultRetryConfig, ...config };
    let lastError: Error;
    
    for (let attempt = 0; attempt <= retryConfig.maxRetries; attempt++) {
      try {
        const result = await operation();
        
        // Log successful retry if this wasn't the first attempt
        if (attempt > 0) {
          await this.logRecovery(context, attempt);
        }
        
        return result;
      } catch (error) {
        lastError = error as Error;
        
        // Log the error attempt
        await this.logErrorAttempt(context, lastError, attempt);
        
        // If this is the last attempt, don't retry
        if (attempt === retryConfig.maxRetries) {
          break;
        }
        
        // Calculate delay with exponential backoff
        const delay = Math.min(
          retryConfig.baseDelay * Math.pow(retryConfig.backoffMultiplier, attempt),
          retryConfig.maxDelay
        );
        
        // Add jitter to prevent thundering herd
        const jitteredDelay = delay + Math.random() * 1000;
        
        console.log(`Attempt ${attempt + 1} failed, retrying in ${jitteredDelay}ms:`, error.message);
        await this.sleep(jitteredDelay);
      }
    }
    
    // All retries exhausted, log final failure
    await this.logPermanentFailure(context, lastError!, retryConfig.maxRetries);
    throw lastError!;
  }

  static async logError(error: Omit<MigrationError, 'id'>): Promise<string> {
    try {
      const { data, error: dbError } = await supabase
        .from('migration_errors')
        .insert({
          project_id: error.project_id,
          object_type_id: error.object_type_id,
          record_id: error.record_id,
          error_type: error.error_type,
          error_message: error.error_message,
          error_details: error.error_details,
          resolved: false
        })
        .select('id')
        .single();

      if (dbError) throw dbError;
      return data.id;
    } catch (err) {
      console.error('Failed to log migration error:', err);
      throw err;
    }
  }

  static async markErrorResolved(
    errorId: string, 
    resolutionNotes: string
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('migration_errors')
        .update({
          resolved: true,
          resolution_notes: resolutionNotes
        })
        .eq('id', errorId);

      if (error) throw error;
    } catch (err) {
      console.error('Failed to mark error as resolved:', err);
      throw err;
    }
  }

  static async getUnresolvedErrors(projectId: string): Promise<MigrationError[]> {
    try {
      const { data, error } = await supabase
        .from('migration_errors')
        .select('*')
        .eq('project_id', projectId)
        .eq('resolved', false)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Failed to fetch unresolved errors:', err);
      return [];
    }
  }

  static categorizeError(error: Error): {
    type: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    retryable: boolean;
    userMessage: string;
  } {
    const message = error.message.toLowerCase();
    
    // Network and API errors
    if (message.includes('network') || message.includes('timeout') || message.includes('econnreset')) {
      return {
        type: 'network_error',
        severity: 'medium',
        retryable: true,
        userMessage: 'Network connectivity issue. The system will automatically retry.'
      };
    }
    
    // Rate limiting
    if (message.includes('rate limit') || message.includes('429')) {
      return {
        type: 'rate_limit',
        severity: 'medium',
        retryable: true,
        userMessage: 'API rate limit reached. The system will retry after a delay.'
      };
    }
    
    // Authentication errors
    if (message.includes('unauthorized') || message.includes('401') || message.includes('403')) {
      return {
        type: 'auth_error',
        severity: 'high',
        retryable: false,
        userMessage: 'Authentication failed. Please check your CRM connection credentials.'
      };
    }
    
    // Data validation errors
    if (message.includes('validation') || message.includes('invalid') || message.includes('required')) {
      return {
        type: 'validation_error',
        severity: 'high',
        retryable: false,
        userMessage: 'Data validation failed. Please check your field mappings and data format.'
      };
    }
    
    // Duplicate record errors
    if (message.includes('duplicate') || message.includes('already exists')) {
      return {
        type: 'duplicate_error',
        severity: 'low',
        retryable: false,
        userMessage: 'Record already exists in destination system. This may be expected behavior.'
      };
    }
    
    // Permission errors
    if (message.includes('permission') || message.includes('access denied')) {
      return {
        type: 'permission_error',
        severity: 'high',
        retryable: false,
        userMessage: 'Insufficient permissions. Please check your CRM user permissions.'
      };
    }
    
    // Default case
    return {
      type: 'unknown_error',
      severity: 'medium',
      retryable: true,
      userMessage: 'An unexpected error occurred. The system will attempt to retry.'
    };
  }

  private static async logErrorAttempt(
    context: {
      project_id: string;
      object_type: string;
      record_id?: string;
      operation_type: string;
    },
    error: Error,
    attempt: number
  ): Promise<void> {
    const errorInfo = this.categorizeError(error);
    
    await supabase
      .from('user_activities')
      .insert({
        project_id: context.project_id,
        activity_type: 'error_retry',
        activity_description: `${context.operation_type} failed (attempt ${attempt + 1}): ${errorInfo.userMessage}`,
        activity_details: {
          object_type: context.object_type,
          record_id: context.record_id,
          error_type: errorInfo.type,
          error_message: error.message,
          attempt_number: attempt + 1,
          severity: errorInfo.severity,
          retryable: errorInfo.retryable
        }
      });
  }

  private static async logRecovery(
    context: {
      project_id: string;
      object_type: string;
      record_id?: string;
      operation_type: string;
    },
    successfulAttempt: number
  ): Promise<void> {
    await supabase
      .from('user_activities')
      .insert({
        project_id: context.project_id,
        activity_type: 'error_recovery',
        activity_description: `${context.operation_type} succeeded after ${successfulAttempt} retries`,
        activity_details: {
          object_type: context.object_type,
          record_id: context.record_id,
          attempts_required: successfulAttempt + 1
        }
      });
  }

  private static async logPermanentFailure(
    context: {
      project_id: string;
      object_type: string;
      record_id?: string;
      operation_type: string;
    },
    error: Error,
    maxRetries: number
  ): Promise<void> {
    const errorInfo = this.categorizeError(error);
    
    await this.logError({
      project_id: context.project_id,
      object_type_id: context.object_type,
      record_id: context.record_id,
      error_type: errorInfo.type,
      error_message: error.message,
      error_details: {
        operation_type: context.operation_type,
        max_retries_exhausted: maxRetries,
        severity: errorInfo.severity,
        user_message: errorInfo.userMessage
      },
      resolved: false
    });
  }

  private static sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}