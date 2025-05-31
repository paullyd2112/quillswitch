
import React from "react";
import MigrationInfo from "./migration-demo/MigrationInfo";

interface MigrationDemoSectionProps {
  onViewReport?: () => void;
}

const MigrationDemoSection = ({ onViewReport }: MigrationDemoSectionProps) => {
  return (
    <section className="py-24 relative">
      {/* Background element */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 z-0"></div>
      
      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <MigrationInfo />
          
          <div className="flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <p className="text-lg">
                Ready to experience seamless CRM migration?
              </p>
              <p className="mt-2">
                Get started with your actual migration today.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MigrationDemoSection;
