
import { useState, useEffect, useCallback } from 'react';
import { demoSections } from './constants';
import { useThrottle } from '@/utils/performanceUtils';

export const useScrollTracking = (markSectionVisited: (id: string) => void, initialActiveSection: string | null) => {
  const [activeSection, setActiveSection] = useState<string | null>(initialActiveSection);

  const checkScrollPosition = useCallback(() => {
    let currentTopSection: string | null = null;
    let minTop = Infinity;

    for (const section of demoSections) {
      const element = document.getElementById(section.id);
      if (!element) continue;
      
      const rect = element.getBoundingClientRect();
      // Section is considered active if its top is within the top 60% of the viewport
      // and it's the highest one visible that meets this criteria.
      if (rect.top >= 0 && rect.top < window.innerHeight * 0.6) {
        if (rect.top < minTop) {
          minTop = rect.top;
          currentTopSection = section.id;
        }
      }
    }
    
    // Fallback if no section is in the top 60%, find one that is at least partially visible
    // and whose top is closest to the viewport top (or middle).
    if (!currentTopSection) {
      minTop = Infinity; // Reset minTop for fallback
      for (const section of demoSections) {
        const element = document.getElementById(section.id);
        if (!element) continue;
        const rect = element.getBoundingClientRect();
        const middleOfViewport = window.innerHeight * 0.5;
        const distanceToMiddle = Math.abs(rect.top - middleOfViewport + (rect.height / 2));

        // Is at least partially visible
        if (rect.bottom > 0 && rect.top < window.innerHeight) {
          if (distanceToMiddle < minTop) {
             minTop = distanceToMiddle;
             currentTopSection = section.id;
          }
        }
      }
    }


    if (currentTopSection && currentTopSection !== activeSection) {
      setActiveSection(currentTopSection);
      markSectionVisited(currentTopSection);
    }
  }, [activeSection, markSectionVisited]);

  const throttledCheckScroll = useThrottle(checkScrollPosition, 200); // Increased throttle for performance

  useEffect(() => {
    window.addEventListener('scroll', throttledCheckScroll);
    // Initial check, useful if page loads scrolled or on route change
    const timeoutId = setTimeout(checkScrollPosition, 100); 
    
    return () => {
      window.removeEventListener('scroll', throttledCheckScroll);
      clearTimeout(timeoutId);
    };
  }, [throttledCheckScroll, checkScrollPosition]);

  return activeSection;
};
