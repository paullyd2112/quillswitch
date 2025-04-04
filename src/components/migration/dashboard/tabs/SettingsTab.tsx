
import React from "react";
import FadeIn from "@/components/animations/FadeIn";
import GlassPanel from "@/components/ui-elements/GlassPanel";
import { Settings } from "lucide-react";

const SettingsTab: React.FC = () => {
  return (
    <FadeIn>
      <GlassPanel className="mb-6">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Migration Settings</h2>
          <p className="text-muted-foreground mb-6">
            Configure preferences and options for your CRM migration.
          </p>
          
          <div className="bg-muted/30 rounded-lg p-6 text-center">
            <Settings className="h-12 w-12 mx-auto mb-3 text-muted-foreground/70" />
            <h3 className="text-lg font-medium">Settings Coming Soon</h3>
            <p className="text-muted-foreground mt-2">
              Advanced configuration options for your migration will be available in the next update.
            </p>
          </div>
        </div>
      </GlassPanel>
    </FadeIn>
  );
};

export default SettingsTab;
