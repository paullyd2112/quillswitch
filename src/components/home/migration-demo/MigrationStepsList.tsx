
import React from "react";
import MigrationStep from "./MigrationStep";

type MigrationStep = {
  name: string;
  status: 'pending' | 'in_progress' | 'complete';
  progress: number;
};

type MigrationStepsListProps = {
  steps: MigrationStep[];
};

const MigrationStepsList = ({ steps }: MigrationStepsListProps) => {
  return (
    <div className="space-y-4 max-h-48 overflow-y-auto py-2 pr-1 scrollbar-thin">
      {steps.map((step) => (
        <MigrationStep 
          key={step.name} 
          name={step.name} 
          status={step.status} 
          progress={step.progress} 
        />
      ))}
    </div>
  );
};

export default MigrationStepsList;
