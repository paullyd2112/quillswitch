
import React from "react";
import WizardHeader from "@/components/setup-wizard/WizardHeader";
import WizardContainer from "@/components/setup-wizard/WizardContainer";
import { SetupWizardProvider } from "@/contexts/SetupWizardContext";
import { ConnectionProvider } from "@/contexts/ConnectionContext"; // Import ConnectionProvider
import FadeIn from "@/components/animations/FadeIn";

const SetupWizard: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Background elements matching home page */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        <WizardHeader />
        
        <div className="container mx-auto px-4 py-12 pb-32">
          <FadeIn>
            <ConnectionProvider> {/* Add ConnectionProvider here */}
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

