
import { supabase } from '@/integrations/supabase/client';
import { errorHandler, ERROR_CODES } from '@/services/errorHandling/globalErrorHandler';

export interface PerformanceMetric {
  metric_name: string;
  value: number;
  unit: string;
  timestamp: string;
  user_id?: string;
  metadata?: Record<string, any>;
}

export interface UserActivity {
  activity_type: string;
  activity_description: string;
  user_id?: string;
  metadata?: Record<string, any>;
}

export interface AuditLog {
  action: string;
  resource_type: string;
  resource_id?: string;
  user_id?: string;
  ip_address?: string;
  user_agent?: string;
  details: Record<string, any>;
}

/**
 * Comprehensive monitoring and logging service
 */
export class MonitoringService {
  private static instance: MonitoringService;
  private metricsBuffer: PerformanceMetric[] = [];
  private activityBuffer: UserActivity[] = [];
  private bufferFlushInterval = 30000; // 30 seconds

  public static getInstance(): MonitoringService {
    if (!MonitoringService.instance) {
      MonitoringService.instance = new MonitoringService();
      MonitoringService.instance.startBufferFlush();
    }
    return MonitoringService.instance;
  }

  /**
   * Track performance metrics
   */
  public trackMetric(metric: Omit<PerformanceMetric, 'timestamp'>): void {
    const fullMetric: PerformanceMetric = {
      ...metric,
      timestamp: new Date().toISOString()
    };

    this.metricsBuffer.push(fullMetric);

    // Flush immediately for critical metrics
    if (['error_rate', 'response_time'].includes(metric.metric_name) && metric.value > 1000) {
      this.flushMetrics();
    }
  }

  /**
   * Track user activities
   */
  public trackActivity(activity: UserActivity): void {
    this.activityBuffer.push(activity);
  }

  /**
   * Log audit events
   */
  public async logAudit(auditData: AuditLog): Promise<void> {
    try {
      const { error } = await supabase
        .from('audit_logs')
        .insert({
          action: auditData.action,
          resource_type: auditData.resource_type,
          resource_id: auditData.resource_id,
          user_id: auditData.user_id,
          ip_address: auditData.ip_address,
          user_agent: auditData.user_agent,
          details: auditData.details,
          created_at: new Date().toISOString()
        });

      if (error) {
        console.error('Failed to log audit event:', error);
      }
    } catch (error) {
      console.error('Audit logging error:', error);
    }
  }

  /**
   * Monitor API response times
   */
  public async monitorApiCall<T>(
    operation: string,
    apiCall: () => Promise<T>,
    metadata?: Record<string, any>
  ): Promise<T> {
    const startTime = performance.now();
    let success = true;
    let error: any = null;

    try {
      const result = await apiCall();
      return result;
    } catch (err) {
      success = false;
      error = err;
      throw err;
    } finally {
      const endTime = performance.now();
      const duration = endTime - startTime;

      // Track response time metric
      this.trackMetric({
        metric_name: 'api_response_time',
        value: duration,
        unit: 'milliseconds',
        metadata: {
          operation,
          success,
          error: error?.message,
          ...metadata
        }
      });

      // Track error rate if applicable
      if (!success) {
        this.trackMetric({
          metric_name: 'api_error_rate',
          value: 1,
          unit: 'count',
          metadata: {
            operation,
            error_type: error?.name || 'Unknown',
            error_message: error?.message,
            ...metadata
          }
        });
      }
    }
  }

  /**
   * Monitor page load performance
   */
  public trackPageLoad(page: string): void {
    // Use Navigation Timing API when available
    if (typeof window !== 'undefined' && window.performance && window.performance.navigation) {
      const timing = window.performance.timing;
      const loadTime = timing.loadEventEnd - timing.navigationStart;
      const domReady = timing.domContentLoadedEventEnd - timing.navigationStart;
      const firstPaint = timing.responseStart - timing.navigationStart;

      this.trackMetric({
        metric_name: 'page_load_time',
        value: loadTime,
        unit: 'milliseconds',
        metadata: { page }
      });

      this.trackMetric({
        metric_name: 'dom_ready_time',
        value: domReady,
        unit: 'milliseconds',
        metadata: { page }
      });

      this.trackMetric({
        metric_name: 'first_paint_time',
        value: firstPaint,
        unit: 'milliseconds',
        metadata: { page }
      });
    }
  }

  /**
   * Monitor memory usage
   */
  public trackMemoryUsage(): void {
    if (typeof window !== 'undefined' && 'memory' in performance) {
      const memory = (performance as any).memory;
      
      this.trackMetric({
        metric_name: 'memory_used',
        value: memory.usedJSHeapSize,
        unit: 'bytes',
        metadata: {
          total: memory.totalJSHeapSize,
          limit: memory.jsHeapSizeLimit
        }
      });
    }
  }

  /**
   * Track user engagement
   */
  public trackUserEngagement(event: string, metadata?: Record<string, any>): void {
    this.trackActivity({
      activity_type: 'engagement',
      activity_description: event,
      metadata: {
        timestamp: new Date().toISOString(),
        ...metadata
      }
    });
  }

  /**
   * Get monitoring dashboard data
   */
  public async getDashboardData(timeframe: string = '24h'): Promise<{
    metrics: any[];
    activities: any[];
    errors: any[];
  }> {
    try {
      const hours = timeframe === '1h' ? 1 : timeframe === '7d' ? 168 : 24;
      const since = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();

      const [metricsResult, activitiesResult, errorsResult] = await Promise.all([
        supabase
          .from('performance_metrics')
          .select('*')
          .gte('timestamp', since)
          .order('timestamp', { ascending: false }),
        
        supabase
          .from('user_activities')
          .select('*')
          .gte('created_at', since)
          .order('created_at', { ascending: false }),
        
        supabase
          .from('audit_logs')
          .select('*')
          .eq('action', 'error')
          .gte('created_at', since)
          .order('created_at', { ascending: false })
      ]);

      return {
        metrics: metricsResult.data || [],
        activities: activitiesResult.data || [],
        errors: errorsResult.data || []
      };
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      return { metrics: [], activities: [], errors: [] };
    }
  }

  /**
   * Flush buffered data to database
   */
  private async flushMetrics(): Promise<void> {
    if (this.metricsBuffer.length === 0 && this.activityBuffer.length === 0) return;

    try {
      // Flush metrics
      if (this.metricsBuffer.length > 0) {
        const { error: metricsError } = await supabase
          .from('performance_metrics')
          .insert(this.metricsBuffer);

        if (metricsError) {
          console.error('Failed to flush metrics:', metricsError);
        } else {
          this.metricsBuffer = [];
        }
      }

      // Flush activities
      if (this.activityBuffer.length > 0) {
        const { error: activitiesError } = await supabase
          .from('user_activities')
          .insert(this.activityBuffer.map(activity => ({
            ...activity,
            created_at: new Date().toISOString()
          })));

        if (activitiesError) {
          console.error('Failed to flush activities:', activitiesError);
        } else {
          this.activityBuffer = [];
        }
      }
    } catch (error) {
      console.error('Buffer flush error:', error);
    }
  }

  /**
   * Start automatic buffer flushing
   */
  private startBufferFlush(): void {
    setInterval(() => {
      this.flushMetrics();
    }, this.bufferFlushInterval);

    // Flush on page unload
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        this.flushMetrics();
      });
    }
  }
}

// Export singleton instance
export const monitoring = MonitoringService.getInstance();
