
import React from 'react';
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel } from "@/components/ui/sidebar/sidebar-group";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar/sidebar-menu";
import { CheckCircle, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { DemoSection, DemoState } from './types';
import { demoSections } from './constants';

interface DemoSectionsMenuProps {
  activeSection: string | null;
  demoState: DemoState;
  onSectionClick: (section: DemoSection) => void;
}

export const DemoSectionsMenu: React.FC<DemoSectionsMenuProps> = ({ activeSection, demoState, onSectionClick }) => {
  return (
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
                  onClick={() => onSectionClick(section)}
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
