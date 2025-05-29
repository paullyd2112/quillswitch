
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, CheckCircle } from "lucide-react";

interface DemoControlsProps {
  isAnimating: boolean;
  onStartDemo: () => void;
  onStopDemo: () => void;
}

const DemoControls = ({ isAnimating, onStartDemo, onStopDemo }: DemoControlsProps) => {
  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <h3 className="text-3xl font-bold text-white">
          Enterprise-Grade Migration in Action
        </h3>
        <p className="text-lg text-slate-300 leading-relaxed">
          Our platform provides complete transparency throughout the migration process. 
          Watch as your data moves securely between systems with real-time validation 
          and progress tracking.
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Button 
          onClick={isAnimating ? onStopDemo : onStartDemo}
          size="lg"
          className="group bg-primary hover:bg-primary/90 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
        >
          {isAnimating ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Stop Demo
            </>
          ) : (
            <>
              <Play className="mr-2 h-5 w-5" />
              Start Live Demo
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </Button>
      </div>

      {/* Key Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
        {[
          "Zero Data Loss Guarantee",
          "95% Faster Than Manual",
          "Enterprise Security",
          "No Technical Skills Needed"
        ].map((benefit, index) => (
          <div key={index} className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
            <span className="text-slate-300 font-medium">{benefit}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DemoControls;
