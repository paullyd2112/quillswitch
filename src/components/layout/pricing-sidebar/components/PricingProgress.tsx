
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
        <div className="px-2 py-2 space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Pricing Progress</span>
            <span>{Math.round(pricingState.totalProgress)}%</span>
          </div>
          <Progress 
            value={pricingState.totalProgress} 
            className="h-2" 
            aria-label={`Pricing progress: ${Math.round(pricingState.totalProgress)}%`}
          />
          <div className="text-xs text-muted-foreground">
            {pricingState.completedSections.size} of {pricingSections.length} sections completed
          </div>
        </div>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
