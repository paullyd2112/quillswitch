
import React from "react";
import MigrationVisualizer from "./migration-demo/MigrationVisualizer";
import MigrationInfo from "./migration-demo/MigrationInfo";
import { useMigrationDemo } from "@/hooks/use-migration-demo";

const MigrationDemoSection = () => {
  const {
    migrationStatus,
    steps,
    overallProgress,
    activeStep,
    performanceMetrics,
    errorMessage,
    handleMigrationDemo
  } = useMigrationDemo();
  
  return (
    <section className="py-24 relative">
      {/* Background element */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 z-0"></div>
      
      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <MigrationInfo />
          
          <div>
            <MigrationVisualizer
              migrationStatus={migrationStatus as "idle" | "loading" | "success" | "error"}
              steps={steps}
              overallProgress={overallProgress}
              activeStep={activeStep}
              onClick={handleMigrationDemo}
              errorMessage={errorMessage}
              performanceMetrics={performanceMetrics}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default MigrationDemoSection;
