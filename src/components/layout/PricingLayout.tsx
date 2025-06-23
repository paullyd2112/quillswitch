
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
      <div className="flex flex-1 pt-20">
        <SidebarProvider>
          <PricingSidebar />
          <main className="flex-1 p-6 overflow-auto">
            {children}
          </main>
        </SidebarProvider>
      </div>
    </div>
  );
};

export default PricingLayout;
