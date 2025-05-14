
import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "./AppSidebar";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BaseLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const BaseLayout = ({ children, className = "" }: BaseLayoutProps) => {
  return (
    <SidebarProvider>
      <div className={`min-h-screen bg-background w-full flex ${className}`}>
        {/* Sidebar navigation */}
        <AppSidebar />
        
        {/* Main content area */}
        <div className="flex-1 flex flex-col">
          <div className="pt-4 px-4 flex justify-end items-center">
            {/* Right section with chat button only */}
            <div className="flex items-center">
              {/* Quick chat button */}
              <Button variant="ghost" size="icon" className="mr-2">
                <MessageSquare size={20} />
                <span className="sr-only">Open chat</span>
              </Button>
            </div>
          </div>
          <div className="flex-1 p-8">
            {children}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default BaseLayout;
