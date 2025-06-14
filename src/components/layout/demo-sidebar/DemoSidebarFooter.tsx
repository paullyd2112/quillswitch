
import React from 'react';
import { SidebarFooter as UiSidebarFooter } from "@/components/ui/sidebar/sidebar-footer";

export const DemoSidebarFooter: React.FC = () => {
  return (
    <UiSidebarFooter>
      <div className="px-3 py-2 space-y-2">
        <div className="text-xs text-sidebar-foreground/70">
          &copy; {new Date().getFullYear()} QuillSwitch
        </div>
      </div>
    </UiSidebarFooter>
  );
};
