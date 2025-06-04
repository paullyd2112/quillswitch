
import React from "react";
import GlassPanel from "@/components/ui-elements/GlassPanel";
import ProgressSteps from "@/components/setup-wizard/ProgressSteps";
import WizardContent from "@/components/setup-wizard/WizardContent";
import { useSetupWizard } from "@/contexts/SetupWizardContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, Sparkles } from "lucide-react";
import FadeIn from "@/components/animations/FadeIn";

const WizardContainer: React.FC = () => {
  const { currentStep, steps, setCurrentStep } = useSetupWizard();

  return (
    <FadeIn>
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center backdrop-blur-sm border border-primary/20">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Migration Setup Wizard</h1>
              <p className="text-slate-400">Configure your CRM migration in a few simple steps</p>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <GlassPanel className="p-8 border border-primary/20 backdrop-blur-xl bg-slate-900/40">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Setup Progress</h2>
              <div className="text-sm text-slate-400 bg-slate-800/50 px-3 py-1 rounded-full border border-slate-700">
                Step {currentStep + 1} of {steps.length}
              </div>
            </div>
            
            <ProgressSteps 
              steps={steps} 
              currentStep={currentStep} 
              setCurrentStep={setCurrentStep} 
            />
          </div>
        </GlassPanel>

        {/* Main Content */}
        <GlassPanel className="overflow-hidden border border-primary/20 backdrop-blur-xl bg-slate-900/40">
          <div className="p-8">
            <Alert className="mb-8 bg-primary/10 border-primary/30 backdrop-blur-sm">
              <Info className="h-4 w-4 text-primary" />
              <AlertDescription className="text-slate-300">
                Complete each step to configure your CRM migration. You can navigate between completed steps at any time.
              </AlertDescription>
            </Alert>
            
            <WizardContent />
          </div>
        </GlassPanel>

        {/* Bottom decorative elements */}
        <div className="flex justify-center">
          <div className="w-32 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent rounded-full"></div>
        </div>
      </div>
    </FadeIn>
  );
};

export default WizardContainer;
