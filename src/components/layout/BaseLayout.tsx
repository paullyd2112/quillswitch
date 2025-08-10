
import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "./AppSidebar";
import { Outlet } from "react-router-dom";
import AppHeader from "./AppHeader";
import SkipToContent from "@/components/a11y/SkipToContent";

interface BaseLayoutProps {
  children?: React.ReactNode;
  className?: string;
}

const BaseLayout = ({ children, className = "" }: BaseLayoutProps) => {
  return (
    <SidebarProvider>
      <div className={`min-h-screen bg-slate-950 w-full flex ${className}`}>
        <SkipToContent />
        <AppSidebar />
        <div className="flex-1 flex flex-col bg-slate-950">
          <AppHeader />
          <main id="main-content" className="flex-1 p-6">
            {children || <Outlet />}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default BaseLayout;
