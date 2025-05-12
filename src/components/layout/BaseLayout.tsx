
import React, { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "./AppSidebar";
import FloatingMenu from "./FloatingMenu";
import { Button } from "@/components/ui/button";
import { Settings, Menu, MessageSquare } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

interface BaseLayoutProps {
  children: React.ReactNode;
  className?: string;
}

type NavType = "sidebar" | "fab" | "none";

const BaseLayout = ({ children, className = "" }: BaseLayoutProps) => {
  const [navType, setNavType] = useState<NavType>("sidebar");
  const [sidebarVariant, setSidebarVariant] = useState<"floating" | "inset" | "sidebar">("floating");

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
          <div className="pt-4 px-4 flex justify-between items-center">
            {/* Left section with optional menu button */}
            <div>
              {navType === "none" && (
                <Button variant="ghost" size="icon" onClick={() => setNavType("sidebar")}>
                  <Menu size={20} />
                  <span className="sr-only">Open menu</span>
                </Button>
              )}
            </div>
            
            {/* Right section with options */}
            <div className="flex items-center gap-2">
              {/* Quick chat button */}
              <Button variant="ghost" size="icon" className="mr-2">
                <MessageSquare size={20} />
                <span className="sr-only">Open chat</span>
              </Button>
              
              {/* Navigation options dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center">
                    <Settings size={16} className="mr-2" />
                    Navigation Options
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Navigation Type</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => setNavType("sidebar")}>
                    <span className={navType === "sidebar" ? "font-bold" : ""}>Sidebar Navigation</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setNavType("fab")}>
                    <span className={navType === "fab" ? "font-bold" : ""}>FAB Navigation</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setNavType("none")}>
                    <span className={navType === "none" ? "font-bold" : ""}>No Navigation</span>
                  </DropdownMenuItem>
                  
                  {navType === "sidebar" && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel>Sidebar Style</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => setSidebarVariant("floating")}>
                        <span className={sidebarVariant === "floating" ? "font-bold" : ""}>Floating</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSidebarVariant("inset")}>
                        <span className={sidebarVariant === "inset" ? "font-bold" : ""}>Inset</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSidebarVariant("sidebar")}>
                        <span className={sidebarVariant === "sidebar" ? "font-bold" : ""}>Full-height</span>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
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
