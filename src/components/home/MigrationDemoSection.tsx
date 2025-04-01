
import React, { useState, useEffect } from "react";
import { Database, Loader, Check, Repeat } from "lucide-react";
import ContentSection from "@/components/layout/ContentSection";
import FadeIn from "@/components/animations/FadeIn";
import SlideUp from "@/components/animations/SlideUp";
import GlassPanel from "@/components/ui-elements/GlassPanel";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";

type MigrationStep = {
  name: string;
  status: 'pending' | 'in_progress' | 'complete';
  progress: number;
};

const MigrationDemoSection = () => {
  const [migrationStatus, setMigrationStatus] = useState<"idle" | "loading" | "success">("idle");
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [steps, setSteps] = useState<MigrationStep[]>([
    { name: "Contacts", status: 'pending', progress: 0 },
    { name: "Opportunities & Deals", status: 'pending', progress: 0 },
    { name: "Activities & Tasks", status: 'pending', progress: 0 },
    { name: "Cases & Tickets", status: 'pending', progress: 0 },
    { name: "Accounts & Companies", status: 'pending', progress: 0 },
    { name: "Custom Objects", status: 'pending', progress: 0 }
  ]);
  const [overallProgress, setOverallProgress] = useState(0);
  
  // Update the progress of the current step with smoother animation
  useEffect(() => {
    if (migrationStatus !== "loading") return;
    
    const interval = setInterval(() => {
      setSteps(prevSteps => {
        const newSteps = [...prevSteps];
        const currentStep = newSteps[currentStepIndex];
        
        // Update progress of current step with smaller increments for smoother animation
        if (currentStep && currentStep.status === 'in_progress') {
          // Smaller increments (5 instead of 10) for smoother transitions
          currentStep.progress = Math.min(100, currentStep.progress + 5);
          
          // If step is complete, move to next step
          if (currentStep.progress === 100) {
            currentStep.status = 'complete';
            
            // Move to the next step if there is one
            if (currentStepIndex < newSteps.length - 1) {
              const nextStep = newSteps[currentStepIndex + 1];
              nextStep.status = 'in_progress';
              setCurrentStepIndex(prevIndex => prevIndex + 1);
            } else {
              // All steps complete
              clearInterval(interval);
              setMigrationStatus("success");
              toast({
                title: "Migration Complete",
                description: "Your migration has completed successfully!",
              });
            }
          }
        }
        
        // Calculate overall progress
        const totalProgress = newSteps.reduce((acc, step) => acc + step.progress, 0);
        const newOverallProgress = Math.round(totalProgress / (newSteps.length * 100) * 100);
        setOverallProgress(newOverallProgress);
        
        return newSteps;
      });
    }, 100); // Reduced interval time (100ms instead of 200ms) for smoother animations
    
    return () => clearInterval(interval);
  }, [currentStepIndex, migrationStatus]);
  
  const handleMigrationDemo = () => {
    if (migrationStatus === "loading") return;
    
    // If already completed, reset to idle and return
    if (migrationStatus === "success") {
      setMigrationStatus("idle");
      setCurrentStepIndex(0);
      setOverallProgress(0);
      setSteps(steps.map(step => ({ ...step, status: 'pending', progress: 0 })));
      return;
    }
    
    // Start migration process
    setMigrationStatus("loading");
    
    // Start the first step
    setSteps(prevSteps => {
      const newSteps = [...prevSteps];
      newSteps[0].status = 'in_progress';
      return newSteps;
    });
  };

  return (
    <ContentSection>
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <FadeIn>
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              Stop Overpaying for Your CRM
            </h2>
            <p className="text-muted-foreground mb-6">
              Salesforce and other enterprise CRMs are designed to be sticky, making it difficult 
              and expensive to switch. Our platform breaks those chains, letting you move to more 
              cost-effective solutions without the typical migration pain.
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Save up to 70% on consultant fees</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Migrate in days instead of months</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Preserve all your valuable customer data</span>
              </li>
            </ul>
            <Button asChild className="gap-2">
              <Link to="/setup">
                Start Your Migration <ArrowRight size={16} />
              </Link>
            </Button>
          </FadeIn>
        </div>
        <div>
          <SlideUp>
            <GlassPanel 
              className={`p-6 transition-all duration-500 cursor-pointer hover:shadow-lg hover:scale-105 ${
                migrationStatus === "success" ? "bg-gradient-to-br from-green-50/20 to-green-100/10 dark:from-green-900/10 dark:to-green-800/5" : ""
              }`}
              onClick={handleMigrationDemo}
              intensity="medium"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-3">
                    <div className="bg-red-100 text-red-600 p-2 rounded-full">
                      <Database size={20} />
                    </div>
                    <span className="font-medium">Salesforce</span>
                  </div>
                  <Badge variant="outline" className="backdrop-blur-sm">Source</Badge>
                </div>
                
                {migrationStatus === "idle" && (
                  <div className="flex items-center justify-center py-12 opacity-80">
                    <Repeat className="h-8 w-8 text-brand-500 animate-pulse" />
                  </div>
                )}
                
                {migrationStatus === "loading" && (
                  <div className="py-4 space-y-6">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Migration Progress</span>
                      <span className="text-sm font-medium">{overallProgress}%</span>
                    </div>
                    <Progress 
                      value={overallProgress} 
                      className="h-2 transition-all duration-700 ease-in-out" 
                    />
                    
                    <div className="space-y-4 max-h-48 overflow-y-auto py-2 pr-1 scrollbar-thin">
                      {steps.map((step, index) => (
                        <div 
                          key={step.name} 
                          className={`space-y-1.5 transition-all duration-500 ease-out ${
                            step.status === 'in_progress' 
                              ? 'scale-105 transform' 
                              : step.status === 'complete' 
                                ? 'opacity-90' 
                                : 'opacity-60'
                          }`}
                        >
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              {step.status === 'pending' && 
                                <div className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-700" />
                              }
                              {step.status === 'in_progress' && 
                                <Loader className="w-3 h-3 text-brand-500 animate-spin" />
                              }
                              {step.status === 'complete' && 
                                <Check className="w-3 h-3 text-green-500" />
                              }
                              <span 
                                className={`${
                                  step.status === 'in_progress' 
                                    ? "font-medium text-brand-500" 
                                    : step.status === 'complete' 
                                      ? "font-medium text-green-500" 
                                      : ""
                                } transition-colors duration-300`}
                              >
                                {step.name}
                              </span>
                            </div>
                            <span 
                              className={`transition-opacity duration-300 ${
                                step.status === 'pending' ? 'opacity-50' : 'opacity-100'
                              }`}
                            >
                              {step.progress}%
                            </span>
                          </div>
                          {step.status !== 'pending' && (
                            <Progress 
                              value={step.progress} 
                              className={`h-1 transition-all duration-300 ease-out ${
                                step.status === 'in_progress' ? 'bg-opacity-80' : ''
                              }`} 
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {migrationStatus === "success" && (
                  <div className="flex flex-col items-center justify-center py-12 space-y-3">
                    <div className="relative">
                      <div className="absolute inset-0 rounded-full bg-green-500/20 animate-ping"></div>
                      <div className="relative bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-3 rounded-full backdrop-blur-sm">
                        <Check className="h-8 w-8" />
                      </div>
                    </div>
                    <div className="text-green-600 dark:text-green-400 font-medium">All data migrated successfully!</div>
                  </div>
                )}
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800 mt-2">
                  <div className="flex items-center gap-3">
                    <div className="bg-orange-100 text-orange-600 p-2 rounded-full">
                      <Database size={20} />
                    </div>
                    <span className="font-medium">HubSpot</span>
                  </div>
                  <Badge variant="outline" className="backdrop-blur-sm">Destination</Badge>
                </div>
              </div>
              
              {migrationStatus === "idle" && (
                <div className="text-center mt-6 text-sm text-muted-foreground animate-pulse">
                  Click to see a demo migration
                </div>
              )}
              
              {migrationStatus === "success" && (
                <div className="text-center mt-6 text-sm font-medium text-green-500">
                  Migration complete! Click to run again.
                </div>
              )}
            </GlassPanel>
          </SlideUp>
        </div>
      </div>
    </ContentSection>
  );
};

export default MigrationDemoSection;
