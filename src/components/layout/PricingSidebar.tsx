
import React, { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem
} from "@/components/ui/sidebar";
import { Progress } from "@/components/ui/progress";
import { 
  Home, 
  Calculator, 
  DollarSign, 
  GitCompare, 
  FileText, 
  CheckCircle,
  ArrowLeft,
  RefreshCw,
  Circle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useThrottle } from "@/utils/performanceUtils";
import { toast } from "@/hooks/use-toast";

interface PricingSection {
  id: string;
  title: string;
  icon: typeof Calculator;
  completed?: boolean;
  action: () => void;
}

interface PricingState {
  visitedSections: Set<string>;
  completedSections: Set<string>;
  currentSection: string | null;
  totalProgress: number;
  sessionStartTime: number;
}

const pricingSections: PricingSection[] = [
  {
    id: "pricing-hero",
    title: "Pricing Overview",
    icon: DollarSign,
    action: () => {
      document.getElementById("pricing-hero")?.scrollIntoView({ 
        behavior: "smooth" 
      });
    }
  },
  {
    id: "savings-calculator",
    title: "Savings Calculator",
    icon: Calculator,
    action: () => {
      document.getElementById("savings-calculator")?.scrollIntoView({ 
        behavior: "smooth" 
      });
    }
  },
  {
    id: "pricing-tiers",
    title: "Pricing Tiers",
    icon: DollarSign,
    action: () => {
      document.getElementById("pricing-tiers")?.scrollIntoView({ 
        behavior: "smooth" 
      });
    }
  },
  {
    id: "value-comparison",
    title: "Value Comparison",
    icon: GitCompare,
    action: () => {
      document.getElementById("value-comparison")?.scrollIntoView({ 
        behavior: "smooth" 
      });
    }
  },
  {
    id: "features-included",
    title: "Features Included",
    icon: FileText,
    action: () => {
      document.getElementById("features-included")?.scrollIntoView({ 
        behavior: "smooth" 
      });
    }
  }
];

// Pricing state management
const usePricingState = () => {
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

// Scroll position tracking with throttling
const useScrollTracking = (markSectionVisited: (id: string) => void) => {
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

export function PricingSidebar() {
  const location = useLocation();
  const { pricingState, markSectionVisited, markSectionCompleted, resetPricing } = usePricingState();
  const activeSection = useScrollTracking(markSectionVisited);

  const handleSectionClick = useCallback((section: PricingSection) => {
    section.action();
    markSectionVisited(section.id);
    
    // Mark as completed after a delay (simulating user interaction)
    setTimeout(() => {
      markSectionCompleted(section.id);
    }, 3000);
  }, [markSectionVisited, markSectionCompleted]);

  const handleResetPricing = useCallback(() => {
    resetPricing();
    // Also reset the page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [resetPricing]);

  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center px-2">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-primary/70 flex items-center justify-center text-white font-bold">Q</div>
            <span className="font-bold text-lg text-foreground">Pricing</span>
          </Link>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Back to Home">
                  <Link to="/">
                    <ArrowLeft />
                    <span>Back to Home</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Progress Section */}
        <SidebarGroup>
          <SidebarGroupLabel>Progress</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="px-2 py-2 space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Pricing Progress</span>
                <span>{Math.round(pricingState.totalProgress)}%</span>
              </div>
              <Progress 
                value={pricingState.totalProgress} 
                className="h-2" 
                aria-label={`Pricing progress: ${Math.round(pricingState.totalProgress)}%`}
              />
              <div className="text-xs text-muted-foreground">
                {pricingState.completedSections.size} of {pricingSections.length} sections completed
              </div>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Pricing Sections</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {pricingSections.map((section) => {
                const isActive = activeSection === section.id;
                const isVisited = pricingState.visitedSections.has(section.id);
                const isCompleted = pricingState.completedSections.has(section.id);
                
                return (
                  <SidebarMenuItem key={section.id}>
                    <SidebarMenuButton 
                      onClick={() => handleSectionClick(section)}
                      tooltip={section.title}
                      className={cn(
                        "cursor-pointer transition-all duration-200",
                        isActive && "bg-sidebar-accent text-sidebar-accent-foreground",
                        isVisited && !isCompleted && "text-blue-600 dark:text-blue-400",
                        isCompleted && "text-green-600 dark:text-green-400"
                      )}
                      aria-current={isActive ? "page" : undefined}
                      aria-label={`${section.title} ${isCompleted ? '(completed)' : isVisited ? '(visited)' : ''}`}
                    >
                      <div className="flex items-center gap-2 flex-1">
                        <section.icon className="flex-shrink-0" />
                        <span className="flex-1">{section.title}</span>
                        {isCompleted ? (
                          <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                        ) : isVisited ? (
                          <Circle className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                        ) : null}
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Pricing Controls</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={handleResetPricing}
                  tooltip="Reset Pricing Progress"
                  className="cursor-pointer"
                  aria-label="Reset pricing progress and scroll to top"
                >
                  <RefreshCw />
                  <span>Reset Progress</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter>
        <div className="px-3 py-2 space-y-2">
          <div className="text-xs text-sidebar-foreground/70">
            Session time: {Math.round((Date.now() - pricingState.sessionStartTime) / 60000)}m
          </div>
          <div className="text-xs text-sidebar-foreground/70">
            &copy; {new Date().getFullYear()} QuillSwitch
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

export default PricingSidebar;
