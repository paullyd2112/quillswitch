
import { useState, useEffect, useCallback } from "react";
import { useThrottle } from "@/utils/performanceUtils";
import { pricingSections } from "../constants";

export const useScrollTracking = (markSectionVisited: (id: string) => void) => {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const checkScrollPosition = useCallback(() => {
    const sections = pricingSections.map(section => {
      const element = document.getElementById(section.id);
      if (!element) return null;
      
      const rect = element.getBoundingClientRect();
      const isVisible = rect.top <= window.innerHeight * 0.5 && rect.bottom >= window.innerHeight * 0.5;
      
      return isVisible ? section.id : null;
    }).filter(Boolean);

    if (sections.length > 0) {
      const currentSection = sections[0];
      if (currentSection && currentSection !== activeSection) {
        setActiveSection(currentSection);
        markSectionVisited(currentSection);
      }
    }
  }, [activeSection, markSectionVisited]);

  const throttledCheckScroll = useThrottle(checkScrollPosition, 100);

  useEffect(() => {
    window.addEventListener('scroll', throttledCheckScroll);
    checkScrollPosition(); // Check initial position
    
    return () => {
      window.removeEventListener('scroll', throttledCheckScroll);
    };
  }, [throttledCheckScroll, checkScrollPosition]);

  return activeSection;
};
