
import React from "react";
import FadeIn from "@/components/animations/FadeIn";
import GlassPanel from "@/components/ui-elements/GlassPanel";
import { useDashboard } from "../context";
import ActivityTimeline from "../../ActivityTimeline";

const ActivityTab: React.FC = () => {
  const { activities } = useDashboard();

  return (
    <FadeIn>
      <GlassPanel className="mb-6">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Activity Log</h2>
          <p className="text-muted-foreground mb-6">
            Comprehensive timeline of all activities and events related to your migration.
          </p>
          
          <ActivityTimeline activities={activities} limit={20} />
        </div>
      </GlassPanel>
    </FadeIn>
  );
};

export default ActivityTab;
