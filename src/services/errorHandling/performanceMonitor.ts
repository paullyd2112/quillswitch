import { errorHandler } from './globalErrorHandler';

// Performance monitoring utilities
export class PerformanceMonitor {
  private static timers: Map<string, number> = new Map();

  // Start timing an operation
  static start(operation: string): string {
    const timerId = `${operation}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.timers.set(timerId, Date.now());
    return timerId;
  }

  // End timing and log performance
  static end(timerId: string, context?: Record<string, any>): number {
    const startTime = this.timers.get(timerId);
    if (!startTime) {
      console.warn(`Timer ${timerId} not found`);
      return 0;
    }

    const duration = Date.now() - startTime;
    const operation = timerId.split('_')[0];
    
    errorHandler.trackPerformance(operation, startTime, context);
    this.timers.delete(timerId);
    
    return duration;
  }

  // Measure function execution time
  static async measure<T>(
    operation: string,
    fn: () => Promise<T> | T,
    context?: Record<string, any>
  ): Promise<T> {
    const timerId = this.start(operation);
    try {
      const result = await fn();
      this.end(timerId, context);
      return result;
    } catch (error) {
      this.end(timerId, { ...context, error: true });
      throw error;
    }
  }

  // Get performance stats
  static getStats() {
    return errorHandler.getPerformanceMetrics();
  }
}

// Decorator for automatic performance monitoring
export function monitored(operation?: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const operationName = operation || `${target.constructor.name}.${propertyKey}`;

    descriptor.value = async function (...args: any[]) {
      return PerformanceMonitor.measure(
        operationName,
        () => originalMethod.apply(this, args),
        { method: propertyKey, args: args.length }
      );
    };

    return descriptor;
  };
}

// React hook for component performance monitoring
export function usePerformanceMonitor(componentName: string) {
  const startRender = () => PerformanceMonitor.start(`render_${componentName}`);
  const endRender = (timerId: string) => PerformanceMonitor.end(timerId);
  
  return { startRender, endRender };
}