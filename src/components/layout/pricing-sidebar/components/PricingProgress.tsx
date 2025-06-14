
import React from "react";
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel } from "@/components/ui/sidebar";
import { Progress } from "@/components/ui/progress";
import type { PricingState } from "../types";
import { pricingSections } from "../constants";

interface PricingProgressProps {
  pricingState: PricingState;
}

export const PricingProgress: React.FC<PricingProgressProps> = ({ pricingState }) => {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Progress</SidebarGroupLabel>
      <SidebarGroupContent>
        {/* Container for text elements that will be hidden */}
        <div className="px-2 pt-2 pb-1 space-y-1 group-data-[collapsible=icon]:hidden">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Pricing Progress</span>
            <span>{Math.round(pricingState.totalProgress)}%</span>
          </div>
        </div>
        {/* Progress bar always visible, or adjust styling if needed in collapsed mode */}
        <div className="px-2 pb-2 pt-0 group-data-[collapsible=icon]:pt-2">
          <Progress 
            value={pricingState.totalProgress} 
            className="h-2" 
            aria-label={`Pricing progress: ${Math.round(pricingState.totalProgress)}%`}
          />
        </div>
        {/* Container for the "sections completed" text */}
        <div className="px-2 pb-2 pt-0 text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">
          {pricingState.completedSections.size} of {pricingSections.length} sections completed
        </div>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

