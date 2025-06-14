
import React, { useCallback } from "react";
import { 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel,
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem
} from "@/components/ui/sidebar";
import { RefreshCw } from "lucide-react";

interface PricingControlsProps {
  resetPricing: () => void;
}

export const PricingControls: React.FC<PricingControlsProps> = ({ resetPricing }) => {
  const handleResetPricing = useCallback(() => {
    resetPricing();
    // Also reset the page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [resetPricing]);

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Pricing Controls</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={handleResetPricing}
              tooltip="Reset Pricing Progress"
              className="cursor-pointer"
              aria-label="Reset pricing progress and scroll to top"
            >
              <RefreshCw />
              <span>Reset Progress</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
