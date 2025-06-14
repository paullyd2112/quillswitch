
import React from 'react';
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel } from "@/components/ui/sidebar/sidebar-group";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar/sidebar-menu";
import { RefreshCw } from 'lucide-react'; // Assuming this is the correct icon from demoControls

interface DemoControlsMenuProps {
  onResetDemo: () => void;
}

export const DemoControlsMenu: React.FC<DemoControlsMenuProps> = ({ onResetDemo }) => {
  // Simplified as there's only one control, but kept structure for potential future controls
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Demo Controls</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={onResetDemo}
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
  );
};
