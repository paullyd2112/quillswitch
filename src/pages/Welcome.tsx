
import React from "react";
import Navbar from "@/components/layout/Navbar";
import ContentSection from "@/components/layout/ContentSection";
import OnboardingTemplatesList from "@/components/onboarding/OnboardingTemplatesList";
import { useUserOnboarding } from "@/components/onboarding/UserOnboardingProvider";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import FadeIn from "@/components/animations/FadeIn";

const Welcome: React.FC = () => {
  const { showOnboardingTour } = useUserOnboarding();
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <ContentSection className="pt-28 pb-20">
        <FadeIn>
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
              Welcome to QuillSwitch
            </h1>
            <p className="text-xl text-muted-foreground">
              Let's get started with your first CRM migration. We'll guide you through the process.
            </p>
            
            <Button 
              variant="outline" 
              onClick={showOnboardingTour}
              className="mt-6 gap-2"
            >
              <Info size={16} />
              Take the product tour
            </Button>
          </div>
          
          <OnboardingTemplatesList />
        </FadeIn>
      </ContentSection>
    </div>
  );
};

export default Welcome;
