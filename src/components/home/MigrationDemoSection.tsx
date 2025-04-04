
import React from "react";
import ContentSection from "@/components/layout/ContentSection";
import SlideUp from "@/components/animations/SlideUp";
import MigrationInfo from "./migration-demo/MigrationInfo";
import MigrationVisualizer from "./migration-demo/MigrationVisualizer";
import { useMigrationDemo } from "@/hooks/use-migration-demo";

const MigrationDemoSection = () => {
  const { 
    migrationStatus, 
    steps, 
    overallProgress, 
    activeStep, 
    performanceMetrics,
    handleMigrationDemo 
  } = useMigrationDemo();

  return (
    <ContentSection>
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <MigrationInfo />
        </div>
        <div>
          <SlideUp>
            <MigrationVisualizer
              migrationStatus={migrationStatus}
              steps={steps}
              overallProgress={overallProgress}
              activeStep={activeStep}
              performanceMetrics={performanceMetrics}
              onClick={handleMigrationDemo}
            />
          </SlideUp>
        </div>
      </div>
    </ContentSection>
  );
};

export default MigrationDemoSection;
