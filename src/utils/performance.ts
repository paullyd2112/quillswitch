
import { useEffect, useState, useCallback, useRef } from 'react';

/**
 * Debounce a function call
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  waitFor: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return (...args: Parameters<T>): void => {
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func(...args), waitFor);
  };
};

/**
 * Throttle a function call
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  waitFor: number
): ((...args: Parameters<T>) => void) => {
  let lastTime = 0;
  
  return (...args: Parameters<T>): void => {
    const now = Date.now();
    if (now - lastTime >= waitFor) {
      func(...args);
      lastTime = now;
    }
  };
};

/**
 * Custom hook for lazy loading components
 */
export const useLazyLoading = (threshold = 0.1) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const currentRef = ref.current;
    if (!currentRef) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    
    observer.observe(currentRef);
    
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold]);
  
  return { ref, isVisible };
};

/**
 * Custom hook for resource prefetching
 */
export const usePrefetch = (urls: string[]) => {
  useEffect(() => {
    // Only prefetch in production and if supported
    if (process.env.NODE_ENV !== 'production' || !('IntersectionObserver' in window)) {
      return;
    }
    
    const prefetchResource = (url: string) => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = url;
      document.head.appendChild(link);
    };
    
    // Prefetch after idle
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(() => {
        urls.forEach(prefetchResource);
      });
    } else {
      // Fallback for browsers that don't support requestIdleCallback
      setTimeout(() => urls.forEach(prefetchResource), 2000);
    }
  }, [urls]);
};

/**
 * Measures component render time (development only)
 */
export const useRenderTime = (componentName: string) => {
  const startTime = useRef(performance.now());
  
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      const endTime = performance.now();
      console.log(`[Performance] ${componentName} rendered in ${(endTime - startTime.current).toFixed(2)}ms`);
    }
    
    return () => {
      startTime.current = performance.now();
    };
  }, [componentName]);
};
