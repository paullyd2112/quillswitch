
import { useEffect, useRef } from 'react';

interface ScrollLockOptions {
  enabled: boolean;
  reserveScrollBarGap?: boolean;
}

export const useBodyScrollLock = ({ enabled, reserveScrollBarGap = true }: ScrollLockOptions) => {
  const originalStyleRef = useRef<{
    overflow?: string;
    paddingRight?: string;
  }>({});

  useEffect(() => {
    if (!enabled) return;

    const body = document.body;
    const documentElement = document.documentElement;
    
    // Store original styles
    originalStyleRef.current = {
      overflow: body.style.overflow,
      paddingRight: body.style.paddingRight,
    };

    // Calculate scrollbar width if needed
    let scrollBarWidth = 0;
    if (reserveScrollBarGap) {
      scrollBarWidth = window.innerWidth - documentElement.clientWidth;
    }

    // Apply scroll lock
    body.style.overflow = 'hidden';
    if (scrollBarWidth > 0) {
      body.style.paddingRight = `${scrollBarWidth}px`;
    }

    // Cleanup function
    return () => {
      body.style.overflow = originalStyleRef.current.overflow || '';
      body.style.paddingRight = originalStyleRef.current.paddingRight || '';
    };
  }, [enabled, reserveScrollBarGap]);
};

export default useBodyScrollLock;
