
import React from "react";
import MigrationStep from "./MigrationStep";
import type { MigrationStep as MigrationStepType } from "@/hooks/use-migration-demo";

type MigrationStepsListProps = {
  steps: MigrationStepType[];
  activeStep?: MigrationStepType;
};

const MigrationStepsList = React.memo(({ steps, activeStep }: MigrationStepsListProps) => {
  return (
    <div className="space-y-4 my-6">
      {steps.map(step => (
        <MigrationStep
          key={step.id}
          name={step.name}
          status={step.status} // Now this will be properly typed as 'idle' | 'in_progress' | 'complete'
          progress={step.progress}
          isActive={activeStep?.id === step.id}
        />
      ))}
    </div>
  );
});

MigrationStepsList.displayName = 'MigrationStepsList';

export default MigrationStepsList;
