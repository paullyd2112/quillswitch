
import { useCallback, useMemo, useRef, useEffect } from 'react';

/**
 * Debounce hook for performance optimization
 */
export function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const callbackRef = useRef(callback);

  // Update callback ref when callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  return useCallback((...args: Parameters<T>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      callbackRef.current(...args);
    }, delay);
  }, [delay]) as T;
}

/**
 * Throttle hook for performance optimization
 */
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const lastExecutedRef = useRef<number>(0);
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  return useCallback((...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastExecutedRef.current >= delay) {
      lastExecutedRef.current = now;
      callbackRef.current(...args);
    }
  }, [delay]) as T;
}

/**
 * Memoization with expiration
 */
export function createMemoizedFunction<T extends (...args: any[]) => any>(
  fn: T,
  ttl: number = 5 * 60 * 1000 // 5 minutes default
): T {
  const cache = new Map<string, { value: ReturnType<T>; timestamp: number }>();

  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = JSON.stringify(args);
    const now = Date.now();
    const cached = cache.get(key);

    if (cached && now - cached.timestamp < ttl) {
      return cached.value;
    }

    const result = fn(...args);
    cache.set(key, { value: result, timestamp: now });

    // Clean up expired entries periodically
    if (cache.size > 100) {
      for (const [cacheKey, entry] of cache.entries()) {
        if (now - entry.timestamp >= ttl) {
          cache.delete(cacheKey);
        }
      }
    }

    return result;
  }) as T;
}

/**
 * Intersection Observer hook for lazy loading
 */
export function useIntersectionObserver(
  options: IntersectionObserverInit = {}
) {
  const elementRef = useRef<HTMLElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const isIntersectingRef = useRef(false);

  const setElement = useCallback((element: HTMLElement | null) => {
    if (elementRef.current && observerRef.current) {
      observerRef.current.unobserve(elementRef.current);
    }

    elementRef.current = element;

    if (element) {
      if (!observerRef.current) {
        observerRef.current = new IntersectionObserver(
          ([entry]) => {
            isIntersectingRef.current = entry.isIntersecting;
          },
          options
        );
      }
      observerRef.current.observe(element);
    }
  }, [options]);

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return { setElement, isIntersecting: isIntersectingRef.current };
}

/**
 * Virtual scrolling for large lists
 */
export function useVirtualScrolling<T>(
  items: T[],
  itemHeight: number,
  containerHeight: number
) {
  const scrollTop = useRef(0);
  const visibleStart = Math.floor(scrollTop.current / itemHeight);
  const visibleEnd = Math.min(
    visibleStart + Math.ceil(containerHeight / itemHeight) + 1,
    items.length
  );

  const visibleItems = useMemo(
    () => items.slice(visibleStart, visibleEnd).map((item, index) => ({
      item,
      index: visibleStart + index
    })),
    [items, visibleStart, visibleEnd]
  );

  const totalHeight = items.length * itemHeight;
  const offsetY = visibleStart * itemHeight;

  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    scrollTop.current = event.currentTarget.scrollTop;
  }, []);

  return {
    visibleItems,
    totalHeight,
    offsetY,
    handleScroll
  };
}

/**
 * Performance measurement utilities
 */
export class PerformanceMonitor {
  private static measurements = new Map<string, number>();

  public static startMeasurement(name: string): void {
    this.measurements.set(name, performance.now());
  }

  public static endMeasurement(name: string): number {
    const startTime = this.measurements.get(name);
    if (!startTime) {
      console.warn(`No start measurement found for: ${name}`);
      return 0;
    }

    const duration = performance.now() - startTime;
    this.measurements.delete(name);

    console.log(`⏱️ ${name}: ${duration.toFixed(2)}ms`);
    return duration;
  }

  public static measureAsync<T>(
    name: string,
    asyncFn: () => Promise<T>
  ): Promise<T> {
    return new Promise(async (resolve, reject) => {
      this.startMeasurement(name);
      try {
        const result = await asyncFn();
        this.endMeasurement(name);
        resolve(result);
      } catch (error) {
        this.endMeasurement(name);
        reject(error);
      }
    });
  }
}

/**
 * Resource preloading utilities
 */
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
}

export function preloadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.onload = () => resolve();
    script.onerror = reject;
    script.src = src;
    document.head.appendChild(script);
  });
}

/**
 * Memory usage monitoring
 */
export function getMemoryUsage(): {
  used: number;
  total: number;
  percentage: number;
} | null {
  if ('memory' in performance && performance.memory) {
    const memory = performance.memory as any;
    return {
      used: memory.usedJSHeapSize,
      total: memory.totalJSHeapSize,
      percentage: (memory.usedJSHeapSize / memory.totalJSHeapSize) * 100
    };
  }
  return null;
}

/**
 * Bundle size optimization utilities
 */
export const lazyImport = <T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>
): React.LazyExoticComponent<T> => {
  return React.lazy(importFn);
};

// Re-export React.lazy for consistency
export { lazy } from 'react';
