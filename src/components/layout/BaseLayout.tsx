
import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "./AppSidebar";
import { Outlet } from "react-router-dom";

interface BaseLayoutProps {
  children?: React.ReactNode;
  className?: string;
}

const BaseLayout = ({ children, className = "" }: BaseLayoutProps) => {
  return (
    <SidebarProvider>
      <div className={`min-h-screen bg-slate-950 w-full flex ${className}`}>
        {/* Sidebar navigation */}
        <AppSidebar />
        
        {/* Main content area */}
        <div className="flex-1 flex flex-col bg-slate-950">
          <div className="flex-1 p-6">
            {children || <Outlet />}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default BaseLayout;
