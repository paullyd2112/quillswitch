
import { useState, useCallback } from "react";
import { toast } from "@/hooks/use-toast";
import type { PricingState } from "../types";
import { pricingSections } from "../constants";

export const usePricingState = () => {
  const [pricingState, setPricingState] = useState<PricingState>(() => {
    const saved = localStorage.getItem('quillswitch-pricing-state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          visitedSections: new Set(parsed.visitedSections || []),
          completedSections: new Set(parsed.completedSections || []),
          sessionStartTime: parsed.sessionStartTime || Date.now()
        };
      } catch {
        // Fall back to default state
      }
    }
    return {
      visitedSections: new Set<string>(),
      completedSections: new Set<string>(),
      currentSection: null,
      totalProgress: 0,
      sessionStartTime: Date.now()
    };
  });

  const updatePricingState = useCallback((updates: Partial<PricingState>) => {
    setPricingState(prev => {
      const newState = { ...prev, ...updates };
      newState.totalProgress = (newState.completedSections.size / pricingSections.length) * 100;
      
      // Save to localStorage
      const toSave = {
        ...newState,
        visitedSections: Array.from(newState.visitedSections),
        completedSections: Array.from(newState.completedSections)
      };
      localStorage.setItem('quillswitch-pricing-state', JSON.stringify(toSave));
      
      return newState;
    });
  }, []);

  const markSectionVisited = useCallback((sectionId: string) => {
    updatePricingState({
      visitedSections: new Set([...pricingState.visitedSections, sectionId]),
      currentSection: sectionId
    });
  }, [pricingState.visitedSections, updatePricingState]);

  const markSectionCompleted = useCallback((sectionId: string) => {
    const newCompleted = new Set([...pricingState.completedSections, sectionId]);
    updatePricingState({
      completedSections: newCompleted,
      visitedSections: new Set([...pricingState.visitedSections, sectionId])
    });
    
    // Show completion toast
    toast({
      title: "Section Completed!",
      description: `You've completed the ${pricingSections.find(s => s.id === sectionId)?.title} section.`,
    });
  }, [pricingState.completedSections, pricingState.visitedSections, updatePricingState]);

  const resetPricing = useCallback(() => {
    const initialState: PricingState = {
      visitedSections: new Set(),
      completedSections: new Set(),
      currentSection: null,
      totalProgress: 0,
      sessionStartTime: Date.now()
    };
    setPricingState(initialState);
    localStorage.removeItem('quillswitch-pricing-state');
    
    toast({
      title: "Pricing Reset",
      description: "Pricing progress has been reset. Start exploring again!",
    });
  }, []);

  return {
    pricingState,
    markSectionVisited,
    markSectionCompleted,
    resetPricing
  };
};
