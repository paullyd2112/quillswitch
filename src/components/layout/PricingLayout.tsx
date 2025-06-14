
import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import PricingSidebar from "./pricing-sidebar/PricingSidebar"; // Adjusted path
import Navbar from "./Navbar";
import Footer from "./Footer"; // Assuming a Footer component exists or might be added

interface PricingLayoutProps {
  children: React.ReactNode;
}

const PricingLayout: React.FC<PricingLayoutProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex flex-1 pt-20"> {/* Adjust pt-20 based on Navbar height */}
          <PricingSidebar />
          <main className="flex-1 p-6 overflow-auto">
            {children}
          </main>
        </div>
        {/* <Footer /> You can add a footer if needed */}
      </div>
    </SidebarProvider>
  );
};

export default PricingLayout;
