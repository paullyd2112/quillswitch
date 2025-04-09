
import React from "react";
import FadeIn from "@/components/animations/FadeIn";
import { useDashboard } from "../context";
import DataValidation from "../../DataValidation";

const ValidationTab: React.FC = () => {
  const { project, objectTypes } = useDashboard();

  if (!project) return null;

  return (
    <FadeIn>
      <DataValidation 
        project={project} 
        objectTypes={objectTypes} 
      />
    </FadeIn>
  );
};

export default ValidationTab;
