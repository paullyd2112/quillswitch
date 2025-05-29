
import React, { useState, useEffect } from "react";
import DemoHeader from "./migration-demo/DemoHeader";
import DemoControls from "./migration-demo/DemoControls";
import DashboardMockup from "./migration-demo/DashboardMockup";
import DemoFooter from "./migration-demo/DemoFooter";

const SimpleMigrationDemo = () => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [progress, setProgress] = useState(85);

  // Auto-animate progress bar
  useEffect(() => {
    if (isAnimating) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            return 0; // Reset to start animation loop
          }
          return prev + 1;
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [isAnimating]);

  const startDemo = () => {
    setIsAnimating(true);
    setProgress(0);
  };

  const stopDemo = () => {
    setIsAnimating(false);
    setProgress(85);
  };

  return (
    <section className="relative py-24 px-4 overflow-hidden">
      {/* Background with grid pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:100px_100px]" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="container max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <DemoHeader />

        {/* Main Demo Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Left Content */}
          <DemoControls 
            isAnimating={isAnimating}
            onStartDemo={startDemo}
            onStopDemo={stopDemo}
          />

          {/* Right Content - Enhanced Dashboard Mockup */}
          <DashboardMockup 
            isAnimating={isAnimating}
            progress={progress}
          />
        </div>

        {/* Bottom Info */}
        <DemoFooter />
      </div>
    </section>
  );
};

export default SimpleMigrationDemo;
