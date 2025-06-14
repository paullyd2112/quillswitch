
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel } from "@/components/ui/sidebar/sidebar-group";
import { DemoState } from './types';
import { demoSections } from './constants';

interface DemoProgressDisplayProps {
  demoState: DemoState;
}

export const DemoProgressDisplay: React.FC<DemoProgressDisplayProps> = ({ demoState }) => {
  const completedCount = demoState.completedSections instanceof Set ? demoState.completedSections.size : 0;
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Progress</SidebarGroupLabel>
      <SidebarGroupContent>
        <div className="px-2 py-2 space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Demo Progress</span>
            <span>{Math.round(demoState.totalProgress)}%</span>
          </div>
          <Progress 
            value={demoState.totalProgress} 
            className="h-2" 
            aria-label={`Demo progress: ${Math.round(demoState.totalProgress)}%`}
          />
          <div className="text-xs text-muted-foreground">
            {completedCount} of {demoSections.length} sections completed
          </div>
        </div>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
