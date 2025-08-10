import React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import ThemeToggle from "@/components/ui/ThemeToggle";

const AppHeader: React.FC = () => {
  return (
    <header className="h-14 flex items-center justify-between border-b border-slate-800/70 px-3 md:px-4 bg-slate-950/80 backdrop-blur supports-[backdrop-filter]:bg-slate-950/60">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="ml-1" />
        <span className="sr-only">Open sidebar</span>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
      </div>
    </header>
  );
};

export default AppHeader;
