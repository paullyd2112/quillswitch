
import React from "react";
import FadeIn from "@/components/animations/FadeIn";
import GlassPanel from "@/components/ui-elements/GlassPanel";
import { FileText } from "lucide-react";

const ReportsTab: React.FC = () => {
  return (
    <FadeIn>
      <GlassPanel className="mb-6">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Migration Reports</h2>
          <p className="text-muted-foreground mb-6">
            Detailed reports on the migration process, data quality, and validation results.
          </p>
          
          <div className="bg-muted/30 rounded-lg p-6 text-center">
            <FileText className="h-12 w-12 mx-auto mb-3 text-muted-foreground/70" />
            <h3 className="text-lg font-medium">Reports Coming Soon</h3>
            <p className="text-muted-foreground mt-2">
              Detailed migration reports will be available once data processing begins.
            </p>
          </div>
        </div>
      </GlassPanel>
    </FadeIn>
  );
};

export default ReportsTab;
