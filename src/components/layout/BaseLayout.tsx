
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
      <div className={`min-h-screen bg-tech-bg w-full flex ${className}`}>
        {/* Sidebar navigation */}
        <AppSidebar />
        
        {/* Main content area */}
        <div className="flex-1 flex flex-col">
          <div className="pt-4 px-6 flex justify-end items-center">
            {/* Chat button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full w-10 h-10 bg-tech-subtle hover:bg-tech-subtle/80 text-tech-text-secondary hover:text-tech-text-primary transition-colors"
            >
              <MessageSquare size={18} />
              <span className="sr-only">Open chat</span>
            </Button>
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
