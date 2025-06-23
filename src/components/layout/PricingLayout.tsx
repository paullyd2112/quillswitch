
import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import PricingSidebar from "./pricing-sidebar/PricingSidebar";
import Navbar from "./Navbar";

interface PricingLayoutProps {
  children: React.ReactNode;
}

const PricingLayout: React.FC<PricingLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <SidebarProvider>
        <div className="flex flex-1 pt-20">
          <PricingSidebar />
          <main className="flex-1 p-6 overflow-auto">
            {children}
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default PricingLayout;
