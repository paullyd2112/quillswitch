
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Database, ArrowRight, CheckCircle, Users, Building, Target } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const SimpleMigrationDemo = () => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { name: "Contacts", icon: Users, count: "2,847" },
    { name: "Companies", icon: Building, count: "1,203" },
    { name: "Deals", icon: Target, count: "756" }
  ];

  const startDemo = () => {
    setIsAnimating(true);
    setProgress(0);
    setCurrentStep(0);
  };

  useEffect(() => {
    if (isAnimating) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setIsAnimating(false);
            return 100;
          }
          
          // Update current step based on progress
          const newStep = Math.floor((prev / 100) * steps.length);
          if (newStep !== currentStep && newStep < steps.length) {
            setCurrentStep(newStep);
          }
          
          return prev + 2;
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [isAnimating, currentStep, steps.length]);

  const handleReset = () => {
    setIsAnimating(false);
    setProgress(0);
    setCurrentStep(0);
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-slate-900 to-slate-950">
      <div className="container max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            See Migration in Action
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Watch how QuillSwitch seamlessly transfers your CRM data with zero downtime and complete accuracy.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardContent className="p-8">
              {/* CRM Systems */}
              <div className="flex items-center justify-between mb-8">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-full flex items-center justify-center border border-red-500/30">
                    <Database className="h-8 w-8 text-red-400" />
                  </div>
                  <h3 className="text-white font-semibold mb-1">Salesforce</h3>
                  <p className="text-slate-400 text-sm">Source CRM</p>
                </div>

                <div className="flex-1 mx-8 relative">
                  <ArrowRight 
                    className={`h-8 w-8 mx-auto transition-all duration-500 ${
                      isAnimating ? 'text-primary animate-pulse' : 'text-slate-600'
                    }`} 
                  />
                  {isAnimating && (
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full h-0.5 bg-slate-700 rounded">
                        <div 
                          className="h-full bg-gradient-to-r from-primary to-blue-400 rounded transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-500/20 to-primary/20 rounded-full flex items-center justify-center border border-primary/30">
                    <Database className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-white font-semibold mb-1">HubSpot</h3>
                  <p className="text-slate-400 text-sm">Destination CRM</p>
                </div>
              </div>

              {/* Migration Progress */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-white font-medium">Migration Progress</h4>
                  <span className="text-slate-300">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-3 mb-6" />
                
                {/* Data Types */}
                <div className="grid grid-cols-3 gap-4">
                  {steps.map((step, index) => {
                    const StepIcon = step.icon;
                    const isActive = currentStep === index && isAnimating;
                    const isComplete = progress === 100 || currentStep > index;
                    
                    return (
                      <div 
                        key={step.name}
                        className={`p-4 rounded-lg border transition-all duration-300 ${
                          isActive 
                            ? 'bg-primary/10 border-primary/30 scale-105' 
                            : isComplete
                              ? 'bg-green-500/10 border-green-500/30'
                              : 'bg-slate-700/50 border-slate-600'
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          {isComplete ? (
                            <CheckCircle className="h-5 w-5 text-green-400" />
                          ) : (
                            <StepIcon className={`h-5 w-5 ${isActive ? 'text-primary' : 'text-slate-400'}`} />
                          )}
                          <span className={`font-medium ${isActive ? 'text-primary' : isComplete ? 'text-green-400' : 'text-slate-300'}`}>
                            {step.name}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm text-slate-400">{step.count} records</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Controls */}
              <div className="flex justify-center gap-4">
                <Button 
                  onClick={startDemo}
                  disabled={isAnimating}
                  className="bg-primary hover:bg-primary/90 text-white px-8"
                >
                  {isAnimating ? 'Migrating...' : 'Start Demo Migration'}
                </Button>
                
                {(progress > 0) && (
                  <Button 
                    onClick={handleReset}
                    variant="outline"
                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    Reset Demo
                  </Button>
                )}
              </div>

              {/* Success Message */}
              {progress === 100 && (
                <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-center">
                  <CheckCircle className="h-6 w-6 text-green-400 mx-auto mb-2" />
                  <p className="text-green-400 font-medium">Migration completed successfully!</p>
                  <p className="text-slate-300 text-sm mt-1">All 4,806 records transferred with 100% accuracy</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default SimpleMigrationDemo;
