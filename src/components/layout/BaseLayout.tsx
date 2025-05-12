
import React, { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "./AppSidebar";
import FloatingMenu from "./FloatingMenu";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

interface BaseLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const BaseLayout = ({ children, className = "" }: BaseLayoutProps) => {
  const [navType, setNavType] = useState<"sidebar" | "fab" | "none">("sidebar");

  // Toggle function to switch between navigation types
  const toggleNavType = () => {
    if (navType === "sidebar") setNavType("fab");
    else if (navType === "fab") setNavType("none");
    else setNavType("sidebar");
  };

  return (
    <SidebarProvider>
      <div className={`min-h-screen bg-background w-full flex ${className}`}>
        {/* Show sidebar if selected */}
        {navType === "sidebar" && <AppSidebar />}
        
        {/* Main content area */}
        <div className="flex-1 flex flex-col">
          <div className="pt-4 px-4 flex justify-end">
            {/* Navigation toggle button */}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={toggleNavType} 
              className="ml-auto"
            >
              <Settings size={16} className="mr-2" />
              {navType === "sidebar" ? "Use FAB" : navType === "fab" ? "Hide Nav" : "Use Sidebar"}
            </Button>
          </div>
          <div className="flex-1 p-8">
            {children}
          </div>
        </div>
        
        {/* Show FAB if selected */}
        {navType === "fab" && <FloatingMenu />}
      </div>
    </SidebarProvider>
  );
};

export default BaseLayout;
