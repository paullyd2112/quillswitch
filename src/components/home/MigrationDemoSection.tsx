
import React from "react";
import MigrationInfo from "./migration-demo/MigrationInfo";

interface MigrationDemoSectionProps {
  onViewReport?: () => void;
}

const MigrationDemoSection = ({ onViewReport }: MigrationDemoSectionProps) => {
  return (
    <div className="relative">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl pointer-events-none" />
      
      <div className="grid lg:grid-cols-2 gap-12 items-center p-8">
        <div className="space-y-8">
          <MigrationInfo />
        </div>
        
        <div className="flex items-center justify-center">
          <div className="text-center space-y-6 p-8 glass-panel rounded-xl">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <div className="w-2 h-2 bg-primary rounded-full mr-2 animate-pulse" />
              <span className="text-sm font-medium text-primary">Live Migration Engine</span>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-primary/80 bg-clip-text text-transparent">
                Watch AI in Action
              </h3>
              <p className="text-lg text-muted-foreground">
                See our intelligent migration engine process data in real-time with advanced field mapping and validation.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="p-4 bg-secondary/20 rounded-lg border border-secondary/30">
                <div className="text-2xl font-bold text-primary">99.9%</div>
                <div className="text-sm text-muted-foreground">Accuracy Rate</div>
              </div>
              <div className="p-4 bg-secondary/20 rounded-lg border border-secondary/30">
                <div className="text-2xl font-bold text-primary">10x</div>
                <div className="text-sm text-muted-foreground">Faster Setup</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MigrationDemoSection;
