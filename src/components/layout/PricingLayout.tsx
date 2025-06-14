
import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import PricingSidebar from "./PricingSidebar";

interface PricingLayoutProps {
  children?: React.ReactNode;
  className?: string;
}

const PricingLayout = ({ children, className = "" }: PricingLayoutProps) => {
  return (
    <SidebarProvider defaultOpen={false}>
      <div className={`min-h-screen bg-slate-950 w-full flex ${className}`}>
        {/* Pricing-specific sidebar */}
        <PricingSidebar />
        
        {/* Main content area */}
        <div className="flex-1 flex flex-col bg-slate-950">
          {/* Floating sidebar trigger with improved positioning */}
          <div className="fixed top-4 left-4 z-50">
            <SidebarTrigger className="bg-background/90 backdrop-blur-sm border shadow-lg hover:bg-background/95 transition-all duration-200" />
          </div>
          
          <div className="flex-1 p-6 pt-16">
            {children}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default PricingLayout;
