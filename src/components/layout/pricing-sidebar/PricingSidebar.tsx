
import React from "react";
import { Link } from "react-router-dom";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem
} from "@/components/ui/sidebar";
import { ArrowLeft } from "lucide-react";
import { usePricingState } from "./hooks/usePricingState";
import { useScrollTracking } from "./hooks/useScrollTracking";
import { PricingProgress } from "./components/PricingProgress";
import { PricingSections } from "./components/PricingSections";
import { PricingControls } from "./components/PricingControls";

export function PricingSidebar() {
  const { pricingState, markSectionVisited, markSectionCompleted, resetPricing } = usePricingState();
  const activeSection = useScrollTracking(markSectionVisited);

  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center px-2">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-primary/70 flex items-center justify-center text-white font-bold">Q</div>
            <span className="font-bold text-lg text-foreground group-data-[collapsible=icon]:hidden">Pricing</span>
          </Link>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Back to Home">
                  <Link to="/">
                    <ArrowLeft />
                    <span>Back to Home</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <PricingProgress pricingState={pricingState} />

        <PricingSections 
          pricingState={pricingState}
          activeSection={activeSection}
          markSectionVisited={markSectionVisited}
          markSectionCompleted={markSectionCompleted}
        />

        <PricingControls resetPricing={resetPricing} />
      </SidebarContent>
      
      <SidebarFooter>
        <div className="px-3 py-2 space-y-2 group-data-[collapsible=icon]:hidden">
          <div className="text-xs text-sidebar-foreground/70">
            Session time: {Math.round((Date.now() - pricingState.sessionStartTime) / 60000)}m
          </div>
          <div className="text-xs text-sidebar-foreground/70">
            &copy; {new Date().getFullYear()} QuillSwitch
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

export default PricingSidebar;

