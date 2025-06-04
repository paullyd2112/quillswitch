
import React from "react";
import WizardHeader from "@/components/setup-wizard/WizardHeader";
import WizardContainer from "@/components/setup-wizard/WizardContainer";
import { SetupWizardProvider } from "@/contexts/SetupWizardContext";
import { ConnectionProvider } from "@/contexts/ConnectionContext";
import FadeIn from "@/components/animations/FadeIn";

const SetupWizard: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Primary gradient orbs */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 -left-40 w-80 h-80 bg-primary/15 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-primary/25 rounded-full blur-3xl" />
        
        {/* Additional ambient effects */}
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/3 w-48 h-48 bg-primary/15 rounded-full blur-3xl" />
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:100px_100px]" />
      </div>

      <div className="relative z-10">
        <WizardHeader />
        
        <div className="container mx-auto px-4 py-12 pb-32">
          <FadeIn>
            <ConnectionProvider>
              <SetupWizardProvider>
                <WizardContainer />
              </SetupWizardProvider>
            </ConnectionProvider>
          </FadeIn>
        </div>
      </div>
    </div>
  );
};

export default SetupWizard;
