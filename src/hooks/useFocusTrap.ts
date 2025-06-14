
import { useEffect, useRef } from 'react';

interface FocusTrapOptions {
  enabled: boolean;
  autoFocus?: boolean;
  restoreFocus?: boolean;
}

export const useFocusTrap = ({ enabled, autoFocus = true, restoreFocus = true }: FocusTrapOptions) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!enabled || !containerRef.current) return;

    const container = containerRef.current;
    
    // Store the previously focused element
    if (restoreFocus) {
      previousActiveElementRef.current = document.activeElement as HTMLElement;
    }

    // Get all focusable elements
    const getFocusableElements = () => {
      const selectors = [
        'button:not([disabled])',
        'input:not([disabled])',
        'select:not([disabled])',
        'textarea:not([disabled])',
        'a[href]',
        '[tabindex]:not([tabindex="-1"])',
        '[contenteditable="true"]'
      ].join(', ');
      
      return Array.from(container.querySelectorAll(selectors)) as HTMLElement[];
    };

    // Focus first element if autoFocus is enabled
    if (autoFocus) {
      const focusableElements = getFocusableElements();
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      }
    }

    // Handle tab key to trap focus
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      const focusableElements = getFocusableElements();
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    // Handle Escape key
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        // Let the modal component handle the escape key
        event.stopPropagation();
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keydown', handleEscapeKey);

    // Cleanup function
    return () => {
      container.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keydown', handleEscapeKey);
      
      // Restore focus to the previously focused element
      if (restoreFocus && previousActiveElementRef.current) {
        previousActiveElementRef.current.focus();
      }
    };
  }, [enabled, autoFocus, restoreFocus]);

  return containerRef;
};

export default useFocusTrap;
