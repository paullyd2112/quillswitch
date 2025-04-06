
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import FadeIn from "@/components/animations/FadeIn";
import { useNavigate } from "react-router-dom";

interface OnboardingStep {
  title: string;
  description: string;
  image?: string;
  route?: string;
}

interface OnboardingTourProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const OnboardingTour: React.FC<OnboardingTourProps> = ({
  isOpen,
  onClose,
  onComplete,
}) => {
  const navigate = useNavigate();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  
  const steps: OnboardingStep[] = [
    {
      title: "Set Up Your First Migration",
      description: "Start by creating a new migration project. You'll define your source and destination CRMs, and we'll guide you through the process.",
      image: "/placeholder.svg",
      route: "/setup"
    },
    {
      title: "Map Your Data Fields",
      description: "Our smart mapping suggestions help you connect fields between systems, ensuring your data transfers correctly.",
      image: "/placeholder.svg"
    },
    {
      title: "Monitor Your Migration",
      description: "Track your migration progress in real-time with detailed status updates and performance metrics.",
      image: "/placeholder.svg",
      route: "/migrations"
    },
    {
      title: "Access Comprehensive Reports",
      description: "After migration, review detailed reports to ensure all your data transferred successfully.",
      image: "/placeholder.svg", 
      route: "/reports"
    }
  ];
  
  const currentStep = steps[currentStepIndex];
  
  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      handleComplete();
    }
  };
  
  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };
  
  const handleComplete = () => {
    onComplete();
    // Navigate to setup wizard if this is the last step
    if (currentStep.route) {
      navigate(currentStep.route);
    }
  };
  
  // Reset to first step when reopened
  useEffect(() => {
    if (isOpen) {
      setCurrentStepIndex(0);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
        <div className="absolute top-4 right-4 z-10">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="h-8 w-8 rounded-full"
          >
            <X size={16} />
          </Button>
        </div>
      
        <div className="relative">
          <div className="h-52 md:h-64 bg-gradient-to-r from-brand-200 to-brand-400 flex items-center justify-center">
            {currentStep.image && (
              <div className="h-40 w-40 md:h-48 md:w-48 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <img 
                  src={currentStep.image} 
                  alt={currentStep.title} 
                  className="h-32 w-32 md:h-40 md:w-40 object-contain" 
                />
              </div>
            )}
          </div>
          
          <div className="absolute bottom-4 left-4 flex">
            {steps.map((_, index) => (
              <div 
                key={index}
                className={`h-1.5 w-6 rounded-full mx-1 ${
                  index === currentStepIndex ? "bg-white" : "bg-white/30"
                }`}
              />
            ))}
          </div>
        </div>
        
        <div className="p-6">
          <FadeIn>
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">{currentStep.title}</DialogTitle>
              <DialogDescription className="text-base mt-2">
                {currentStep.description}
              </DialogDescription>
            </DialogHeader>
          </FadeIn>
          
          <DialogFooter className="flex justify-between mt-8">
            <div>
              {currentStepIndex > 0 && (
                <Button variant="outline" onClick={handlePrevious} className="gap-2">
                  <ChevronLeft size={16} /> Back
                </Button>
              )}
            </div>
            
            <Button onClick={handleNext} className="gap-2">
              {currentStepIndex < steps.length - 1 ? (
                <>Next <ChevronRight size={16} /></>
              ) : (
                currentStep.route ? 'Start migration' : 'Finish'
              )}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingTour;
