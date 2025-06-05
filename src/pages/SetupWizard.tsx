
import React from "react";
import WizardHeader from "@/components/setup-wizard/WizardHeader";
import WizardContainer from "@/components/setup-wizard/WizardContainer";
import { SetupWizardProvider } from "@/contexts/SetupWizardContext";
import { ConnectionProvider } from "@/contexts/ConnectionContext";
import FadeIn from "@/components/animations/FadeIn";
import PremiumDashboard from "@/components/dashboard/PremiumDashboard";

const SetupWizard: React.FC = () => {
  // Check if we should show the premium dashboard instead
  const showPremiumDashboard = window.location.pathname.includes('/dashboard') || 
                               window.location.search.includes('view=dashboard');

  if (showPremiumDashboard) {
    return <PremiumDashboard />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Primary gradient orbs with enhanced animations */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-purple-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/3 -left-40 w-80 h-80 bg-gradient-to-bl from-blue-400/15 to-indigo-500/8 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-gradient-to-tl from-blue-600/25 to-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        
        {/* Additional ambient effects */}
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-purple-500/10 to-blue-500/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/3 left-1/3 w-48 h-48 bg-gradient-to-l from-blue-400/15 to-purple-400/8 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        
        {/* Premium grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.05)_1px,transparent_1px)] bg-[size:100px_100px] opacity-30" />
        
        {/* Floating particles */}
        <div className="absolute top-20 left-20 w-1 h-1 bg-blue-400 rounded-full animate-float opacity-60" />
        <div className="absolute top-40 right-40 w-0.5 h-0.5 bg-blue-300 rounded-full animate-float-delayed opacity-40" />
        <div className="absolute bottom-60 left-60 w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse opacity-50" />
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
