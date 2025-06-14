
import React from 'react';
import { SidebarFooter as UiSidebarFooter } from "@/components/ui/sidebar/sidebar-footer";
import { DemoState } from './types';

interface DemoSidebarFooterProps {
  demoState: DemoState;
}

export const DemoSidebarFooter: React.FC<DemoSidebarFooterProps> = ({ demoState }) => {
  return (
    <UiSidebarFooter>
      <div className="px-3 py-2 space-y-2">
        <div className="text-xs text-sidebar-foreground/70">
          Session time: {Math.round((Date.now() - demoState.sessionStartTime) / 60000)}m
        </div>
        <div className="text-xs text-sidebar-foreground/70">
          &copy; {new Date().getFullYear()} QuillSwitch
        </div>
      </div>
    </UiSidebarFooter>
  );
};
