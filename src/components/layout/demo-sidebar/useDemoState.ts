
import { useState, useCallback } from 'react';
import { DemoState } from './types';
import { demoSections } from './constants';
import { toast } from "@/hooks/use-toast";

export const useDemoState = () => {
  const [demoState, setDemoState] = useState<DemoState>(() => {
    const saved = localStorage.getItem('quillswitch-demo-state');
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

  const updateDemoState = useCallback((updates: Partial<DemoState>) => {
    setDemoState(prev => {
      const newState = { ...prev, ...updates };
      const completedSize = newState.completedSections instanceof Set ? newState.completedSections.size : 0;
      newState.totalProgress = (completedSize / demoSections.length) * 100;
      
      const toSave = {
        ...newState,
        visitedSections: Array.from(newState.visitedSections instanceof Set ? newState.visitedSections : []),
        completedSections: Array.from(newState.completedSections instanceof Set ? newState.completedSections : [])
      };
      localStorage.setItem('quillswitch-demo-state', JSON.stringify(toSave));
      
      return newState;
    });
  }, []);

  const markSectionVisited = useCallback((sectionId: string) => {
    updateDemoState({
      visitedSections: new Set([...(demoState.visitedSections || []), sectionId]),
      currentSection: sectionId
    });
  }, [demoState.visitedSections, updateDemoState]);

  const markSectionCompleted = useCallback((sectionId: string) => {
    const newCompleted = new Set([...(demoState.completedSections || []), sectionId]);
    updateDemoState({
      completedSections: newCompleted,
      visitedSections: new Set([...(demoState.visitedSections || []), sectionId]) // Also mark as visited
    });
    
    toast({
      title: "Section Completed!",
      description: `You've completed the ${demoSections.find(s => s.id === sectionId)?.title} section.`,
    });
  }, [demoState.completedSections, demoState.visitedSections, updateDemoState]);

  const resetDemo = useCallback(() => {
    const initialState: DemoState = {
      visitedSections: new Set(),
      completedSections: new Set(),
      currentSection: null,
      totalProgress: 0,
      sessionStartTime: Date.now()
    };
    setDemoState(initialState);
    localStorage.removeItem('quillswitch-demo-state');
    
    toast({
      title: "Demo Reset",
      description: "Demo progress has been reset. Start exploring again!",
    });
    // Scroll to top will be handled in the component calling this
  }, [setDemoState]);

  return {
    demoState,
    markSectionVisited,
    markSectionCompleted,
    resetDemo
  };
};
