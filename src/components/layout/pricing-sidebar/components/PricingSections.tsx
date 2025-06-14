
import React, { useCallback } from "react";
import { 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel,
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem
} from "@/components/ui/sidebar";
import { CheckCircle, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PricingState, PricingSection } from "../types";
import { pricingSections } from "../constants";

interface PricingSectionsProps {
  pricingState: PricingState;
  activeSection: string | null;
  markSectionVisited: (sectionId: string) => void;
  markSectionCompleted: (sectionId: string) => void;
}

export const PricingSections: React.FC<PricingSectionsProps> = ({
  pricingState,
  activeSection,
  markSectionVisited,
  markSectionCompleted
}) => {
  const handleSectionClick = useCallback((section: PricingSection) => {
    section.action();
    markSectionVisited(section.id);
    
    // Mark as completed after a delay (simulating user interaction)
    setTimeout(() => {
      markSectionCompleted(section.id);
    }, 3000);
  }, [markSectionVisited, markSectionCompleted]);

  return (
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
  );
};
