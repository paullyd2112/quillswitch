
import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "./AppSidebar";
import Navbar from "./Navbar"; // Or a specific AppNavbar if you have one

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <div className="flex flex-col min-h-screen">
        {/* You might have a different Navbar for authenticated sections, or reuse the main one */}
        {/* <Navbar /> */}
        <div className="flex flex-1"> {/* Removed pt-20 if Navbar is not part of this layout directly */}
          <AppSidebar />
          <main className="flex-1 p-6 overflow-auto bg-slate-950"> {/* Ensure main content area has a background */}
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
