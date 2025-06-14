import React, { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { Sidebar } from "@/components/ui/sidebar/sidebar";
// Import modular sidebar components individually
import { SidebarContent } from "@/components/ui/sidebar/sidebar-content";
import { SidebarFooter } from "@/components/ui/sidebar/sidebar-footer";
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel } from "@/components/ui/sidebar/sidebar-group";
import { SidebarHeader } from "@/components/ui/sidebar/sidebar-header";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar/sidebar-menu";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Home, 
  Play, 
  FileBarChart, 
  GitCompare, 
  HelpCircle, 
  BookOpen, 
  RefreshCw,
  Zap,
  ArrowLeft,
  CheckCircle,
  Circle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useThrottle } from "@/utils/performanceUtils";
import { toast } from "@/hooks/use-toast";

interface DemoSection {
  id: string;
  title: string;
  icon: typeof Play; // Lucide icons are components, typeof Play is React.FC<LucideProps> or similar
  completed?: boolean;
  viewTime?: number;
  action: () => void;
}

interface DemoState {
  visitedSections: Set<string>;
  completedSections: Set<string>;
  currentSection: string | null;
  totalProgress: number;
  sessionStartTime: number;
}

const demoSections: DemoSection[] = [
  {
    id: "migration-visualizer",
    title: "Migration Visualizer",
    icon: Play,
    action: () => {
      document.getElementById("migration-visualizer")?.scrollIntoView({ 
        behavior: "smooth" 
      });
    }
  },
  {
    id: "try-it",
    title: "Try It Yourself",
    icon: Zap,
    action: () => {
      document.getElementById("try-it-experience")?.scrollIntoView({ 
        behavior: "smooth" 
      });
    }
  },
  {
    id: "reports",
    title: "Migration Reports",
    icon: FileBarChart,
    action: () => {
      document.getElementById("migration-reports")?.scrollIntoView({ 
        behavior: "smooth" 
      });
    }
  },
  {
    id: "comparison",
    title: "Product Comparison",
    icon: GitCompare,
    action: () => {
      document.getElementById("product-comparison")?.scrollIntoView({ 
        behavior: "smooth" 
      });
    }
  },
  {
    id: "challenges",
    title: "Common Challenges",
    icon: HelpCircle,
    action: () => {
      document.getElementById("common-challenges")?.scrollIntoView({ 
        behavior: "smooth" 
      });
    }
  },
  {
    id: "knowledge",
    title: "Knowledge Base",
    icon: BookOpen,
    action: () => {
      document.getElementById("expert-knowledge")?.scrollIntoView({ 
        behavior: "smooth" 
      });
    }
  }
];

const demoControls = [
  {
    title: "Reset Demo",
    icon: RefreshCw,
    action: () => {
      window.location.reload();
    }
  }
];

// Demo state management
const useDemoState = () => {
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
      newState.totalProgress = (newState.completedSections.size / demoSections.length) * 100;
      
      // Save to localStorage
      const toSave = {
        ...newState,
        visitedSections: Array.from(newState.visitedSections),
        completedSections: Array.from(newState.completedSections)
      };
      localStorage.setItem('quillswitch-demo-state', JSON.stringify(toSave));
      
      return newState;
    });
  }, []);

  const markSectionVisited = useCallback((sectionId: string) => {
    updateDemoState({
      visitedSections: new Set([...demoState.visitedSections, sectionId]),
      currentSection: sectionId
    });
  }, [demoState.visitedSections, updateDemoState]);

  const markSectionCompleted = useCallback((sectionId: string) => {
    const newCompleted = new Set([...demoState.completedSections, sectionId]);
    updateDemoState({
      completedSections: newCompleted,
      visitedSections: new Set([...demoState.visitedSections, sectionId])
    });
    
    // Show completion toast
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
  }, []);

  return {
    demoState,
    markSectionVisited,
    markSectionCompleted,
    resetDemo
  };
};

// Scroll position tracking with throttling
const useScrollTracking = (markSectionVisited: (id: string) => void) => {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const checkScrollPosition = useCallback(() => {
    const sections = demoSections.map(section => {
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

export function DemoSidebar() {
  const location = useLocation();
  const { demoState, markSectionVisited, markSectionCompleted, resetDemo } = useDemoState();
  const activeSection = useScrollTracking(markSectionVisited);

  const handleSectionClick = useCallback((section: DemoSection) => {
    section.action();
    markSectionVisited(section.id);
    
    // Mark as completed after a delay (simulating user interaction)
    setTimeout(() => {
      markSectionCompleted(section.id);
    }, 3000);
  }, [markSectionVisited, markSectionCompleted]);

  const handleResetDemo = useCallback(() => {
    resetDemo();
    // Also reset the page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [resetDemo]);

  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center px-2">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-primary/70 flex items-center justify-center text-white font-bold">Q</div>
            <span className="font-bold text-lg text-foreground">Demo</span>
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
                <span>Demo Progress</span>
                <span>{Math.round(demoState.totalProgress)}%</span>
              </div>
              <Progress 
                value={demoState.totalProgress} 
                className="h-2" 
                aria-label={`Demo progress: ${Math.round(demoState.totalProgress)}%`}
              />
              <div className="text-xs text-muted-foreground">
                {demoState.completedSections.size} of {demoSections.length} sections completed
              </div>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Demo Sections</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {demoSections.map((section) => {
                const isActive = activeSection === section.id;
                const isVisited = demoState.visitedSections.has(section.id);
                const isCompleted = demoState.completedSections.has(section.id);
                
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
          <SidebarGroupLabel>Demo Controls</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={handleResetDemo}
                  tooltip="Reset Demo Progress"
                  className="cursor-pointer"
                  aria-label="Reset demo progress and scroll to top"
                >
                  <RefreshCw />
                  <span>Reset Demo</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter>
        <div className="px-3 py-2 space-y-2">
          <div className="text-xs text-sidebar-foreground/70">
            Session time: {Math.round((Date.now() - demoState.sessionStartTime) / 60000)}m
          </div>
          <div className="text-xs text-sidebar-foreground/70">
            &copy; {new Date().getFullYear()} QuillSwitch
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

export default DemoSidebar;
