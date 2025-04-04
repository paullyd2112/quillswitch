
import React from "react";
import FadeIn from "@/components/animations/FadeIn";
import GlassPanel from "@/components/ui-elements/GlassPanel";
import { useDashboard } from "../DashboardContext";
import ErrorSummary from "../../ErrorSummary";

const ErrorsTab: React.FC = () => {
  const { errors } = useDashboard();

  return (
    <FadeIn>
      <GlassPanel className="mb-6">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Error Reports & Issues</h2>
          <p className="text-muted-foreground mb-6">
            Track and resolve any errors or issues encountered during the migration process.
          </p>
          
          <ErrorSummary errors={errors} />
        </div>
      </GlassPanel>
    </FadeIn>
  );
};

export default ErrorsTab;
