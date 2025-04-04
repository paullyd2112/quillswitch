
import React from "react";
import FadeIn from "@/components/animations/FadeIn";
import { useDashboard } from "../DashboardContext";
import DeltaMigrationConfig from "../../DeltaMigrationConfig";

const DeltaTab: React.FC = () => {
  const { project, handleSaveDeltaConfig } = useDashboard();

  if (!project) return null;

  return (
    <FadeIn>
      <DeltaMigrationConfig 
        projectId={project.id}
        onSave={handleSaveDeltaConfig}
      />
    </FadeIn>
  );
};

export default DeltaTab;
