
import React from "react";
import FadeIn from "@/components/animations/FadeIn";
import { useDashboard } from "../context";
import MigrationStatusCard from "../../MigrationStatusCard";
import MigrationStagesProgress from "../../MigrationStagesProgress";
import ObjectMigrationStatus from "../../ObjectMigrationStatus";
import ErrorSummary from "../../ErrorSummary";

const OverviewTab: React.FC = () => {
  const { project, stages, objectTypes, errors } = useDashboard();

  if (!project) return null;

  return (
    <>
      <FadeIn>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MigrationStatusCard project={project} />
          <MigrationStagesProgress stages={stages} />
        </div>
      </FadeIn>
      
      <FadeIn delay="100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <ObjectMigrationStatus objectTypes={objectTypes} />
          </div>
          <div>
            <ErrorSummary errors={errors} limit={3} />
          </div>
        </div>
      </FadeIn>
    </>
  );
};

export default OverviewTab;
