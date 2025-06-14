
import React from 'react';
import { Link } from 'react-router-dom';
import { SidebarHeader as UiSidebarHeader } from "@/components/ui/sidebar/sidebar-header";

export const DemoSidebarHeader: React.FC = () => {
  return (
    <UiSidebarHeader>
      <div className="flex items-center px-2">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-primary/70 flex items-center justify-center text-white font-bold">Q</div>
          <span className="font-bold text-lg text-foreground">Demo</span>
        </Link>
      </div>
    </UiSidebarHeader>
  );
};
