import React, { useCallback } from "react";
import { Sidebar } from "@/components/ui/sidebar/sidebar";
import { SidebarContent } from "@/components/ui/sidebar/sidebar-content";

// Import new modular components and hooks
import { DemoState, DemoSection } from "./demo-sidebar/types";
import { useDemoState } from "./demo-sidebar/useDemoState";
import { useScrollTracking } from "./demo-sidebar/useScrollTracking";
import { DemoSidebarHeader } from "./demo-sidebar/DemoSidebarHeader";
import { DemoSidebarNavigation } from "./demo-sidebar/DemoSidebarNavigation";
import { DemoProgressDisplay } from "./demo-sidebar/DemoProgressDisplay";
import { DemoSectionsMenu } from "./demo-sidebar/DemoSectionsMenu";
import { DemoControlsMenu } from "./demo-sidebar/DemoControlsMenu";
import { DemoSidebarFooter } from "./demo-sidebar/DemoSidebarFooter";


export function DemoSidebar() {
  const { demoState, markSectionVisited, markSectionCompleted, resetDemo } = useDemoState();
  const activeSection = useScrollTracking(markSectionVisited, demoState.currentSection);

  const handleSectionClick = useCallback((section: DemoSection) => {
    section.action(); // Scrolls to the section
    markSectionVisited(section.id); // Marks as visited immediately
    
    // Mark as completed after a delay (simulating user interaction or viewing time)
    // This logic is kept from the original file
    setTimeout(() => {
      if (!demoState.completedSections.has(section.id)) { // Only complete if not already completed
        markSectionCompleted(section.id);
      }
    }, 3000); 
  }, [markSectionVisited, markSectionCompleted, demoState.completedSections]);

  const handleResetDemo = useCallback(() => {
    resetDemo();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [resetDemo]);

  return (
    <Sidebar variant="floating" collapsible="icon">
      <DemoSidebarHeader />
      
      <SidebarContent>
        <DemoSidebarNavigation />
        <DemoProgressDisplay demoState={demoState} />
        <DemoSectionsMenu 
          activeSection={activeSection} 
          demoState={demoState} 
          onSectionClick={handleSectionClick} 
        />
        <DemoControlsMenu onResetDemo={handleResetDemo} />
      </SidebarContent>
      
      <DemoSidebarFooter />
    </Sidebar>
  );
}

export default DemoSidebar;
