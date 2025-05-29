
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Users, Building, Target, Database } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const SimpleMigrationDemo = () => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { name: "Contacts", icon: Users, count: "2,847", status: "pending" },
    { name: "Companies", icon: Building, count: "1,203", status: "pending" },
    { name: "Deals", icon: Target, count: "756", status: "pending" }
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
          
          const newStep = Math.floor((prev / 100) * steps.length);
          if (newStep !== currentStep && newStep < steps.length) {
            setCurrentStep(newStep);
          }
          
          return prev + 1.5;
        });
      }, 80);

      return () => clearInterval(interval);
    }
  }, [isAnimating, currentStep, steps.length]);

  const handleReset = () => {
    setIsAnimating(false);
    setProgress(0);
    setCurrentStep(0);
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
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium rounded-full bg-primary/10 border border-primary/20 text-primary">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Live Migration Demo
          </div>
          
          <h2 className="text-5xl md:text-6xl font-black text-white mb-8 tracking-tight leading-none">
            Watch Your Data Move
            <span className="block bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
              In Real-Time
            </span>
          </h2>
          
          <p className="text-xl text-slate-300 max-w-4xl mx-auto leading-relaxed">
            See exactly how QuillSwitch transfers your CRM data with complete transparency, 
            zero downtime, and enterprise-grade security.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <Card className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-slate-700/50 backdrop-blur-sm shadow-2xl">
            <CardContent className="p-12">
              {/* CRM Systems Header */}
              <div className="flex items-center justify-between mb-12">
                <div className="text-center group">
                  <div className="relative w-24 h-24 mx-auto mb-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-500/30 to-orange-500/30 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                    <div className="relative w-full h-full bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-2xl flex items-center justify-center border border-red-500/30 group-hover:border-red-400/50 transition-all duration-300">
                      <Database className="h-10 w-10 text-red-400" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Salesforce</h3>
                  <p className="text-slate-400 font-medium">Source CRM</p>
                  <div className="mt-3 text-sm text-slate-500">4,806 total records</div>
                </div>

                <div className="flex-1 mx-12 relative">
                  <div className="relative">
                    <ArrowRight 
                      className={`h-12 w-12 mx-auto transition-all duration-500 ${
                        isAnimating ? 'text-primary animate-pulse scale-110' : 'text-slate-600'
                      }`} 
                    />
                    {isAnimating && (
                      <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2">
                        <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-primary via-blue-400 to-primary rounded-full transition-all duration-300 relative"
                            style={{ width: `${progress}%` }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {isAnimating && (
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                      <div className="px-3 py-1 bg-primary/90 text-white text-xs font-medium rounded-full animate-bounce">
                        Transferring...
                      </div>
                    </div>
                  )}
                </div>

                <div className="text-center group">
                  <div className="relative w-24 h-24 mx-auto mb-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-primary/30 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                    <div className="relative w-full h-full bg-gradient-to-br from-blue-500/20 to-primary/20 rounded-2xl flex items-center justify-center border border-primary/30 group-hover:border-primary/50 transition-all duration-300">
                      <Database className="h-10 w-10 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">HubSpot</h3>
                  <p className="text-slate-400 font-medium">Destination CRM</p>
                  <div className="mt-3 text-sm text-slate-500">Ready to receive</div>
                </div>
              </div>

              {/* Progress Section */}
              <div className="mb-12">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-2xl font-bold text-white">Migration Progress</h4>
                  <div className="text-right">
                    <div className="text-3xl font-black text-primary">{Math.round(progress)}%</div>
                    <div className="text-sm text-slate-400">Complete</div>
                  </div>
                </div>
                
                <div className="mb-8">
                  <Progress 
                    value={progress} 
                    className="h-4 bg-slate-700/50 rounded-full overflow-hidden" 
                    indicatorClassName="bg-gradient-to-r from-primary via-blue-400 to-primary transition-all duration-500"
                  />
                </div>
                
                {/* Data Types Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {steps.map((step, index) => {
                    const StepIcon = step.icon;
                    const isActive = currentStep === index && isAnimating;
                    const isComplete = progress === 100 || (currentStep > index && isAnimating);
                    
                    return (
                      <div 
                        key={step.name}
                        className={`relative p-6 rounded-xl border transition-all duration-500 transform ${
                          isActive 
                            ? 'bg-primary/10 border-primary/40 scale-105 shadow-lg shadow-primary/20' 
                            : isComplete
                              ? 'bg-green-500/10 border-green-500/40 shadow-lg shadow-green-500/20'
                              : 'bg-slate-800/50 border-slate-600/50 hover:border-slate-500/50'
                        }`}
                      >
                        {/* Status indicator */}
                        <div className="absolute top-4 right-4">
                          {isComplete ? (
                            <CheckCircle className="h-6 w-6 text-green-400" />
                          ) : isActive ? (
                            <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
                          ) : (
                            <div className="w-6 h-6 rounded-full border-2 border-slate-600"></div>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-4 mb-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                            isActive 
                              ? 'bg-primary/20 text-primary' 
                              : isComplete 
                                ? 'bg-green-500/20 text-green-400'
                                : 'bg-slate-700 text-slate-400'
                          }`}>
                            <StepIcon className="h-6 w-6" />
                          </div>
                          <div>
                            <h5 className={`text-lg font-bold transition-colors duration-300 ${
                              isActive ? 'text-primary' : isComplete ? 'text-green-400' : 'text-white'
                            }`}>
                              {step.name}
                            </h5>
                            <p className="text-slate-400 text-sm">
                              {step.count} records
                            </p>
                          </div>
                        </div>
                        
                        {/* Progress bar for active step */}
                        {isActive && (
                          <div className="mt-4">
                            <div className="flex justify-between text-xs text-slate-400 mb-2">
                              <span>Transferring...</span>
                              <span>{Math.round((progress % 33.33) * 3)}%</span>
                            </div>
                            <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-primary transition-all duration-300"
                                style={{ width: `${(progress % 33.33) * 3}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Controls */}
              <div className="flex flex-col sm:flex-row justify-center gap-6">
                <Button 
                  onClick={startDemo}
                  disabled={isAnimating}
                  size="lg"
                  className="group bg-primary hover:bg-primary/90 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {isAnimating ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Migration in Progress...
                    </>
                  ) : (
                    <>
                      Start Demo Migration
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
                
                {progress > 0 && (
                  <Button 
                    onClick={handleReset}
                    variant="outline"
                    size="lg"
                    className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:border-slate-500 px-8 py-4 text-lg rounded-xl transition-all duration-300"
                  >
                    Reset Demo
                  </Button>
                )}
              </div>

              {/* Success State */}
              {progress === 100 && (
                <div className="mt-8 p-6 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl text-center backdrop-blur-sm">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <CheckCircle className="h-8 w-8 text-green-400" />
                    <h4 className="text-2xl font-bold text-green-400">Migration Completed Successfully!</h4>
                  </div>
                  <p className="text-slate-300 text-lg mb-3">
                    All 4,806 records transferred with 100% accuracy
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                      <div className="text-2xl font-bold text-green-400">2,847</div>
                      <div className="text-sm text-slate-400">Contacts Migrated</div>
                    </div>
                    <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                      <div className="text-2xl font-bold text-green-400">1,203</div>
                      <div className="text-sm text-slate-400">Companies Migrated</div>
                    </div>
                    <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                      <div className="text-2xl font-bold text-green-400">756</div>
                      <div className="text-sm text-slate-400">Deals Migrated</div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Additional Info */}
        <div className="text-center mt-16">
          <p className="text-slate-400 text-lg mb-6">
            This demo shows a simplified version of our migration process
          </p>
          <div className="flex flex-wrap justify-center gap-8 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span>Real-time validation</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span>Automatic error handling</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span>Zero downtime guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span>Enterprise security</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SimpleMigrationDemo;
