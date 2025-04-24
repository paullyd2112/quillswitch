import React from "react";
import { Button } from "@/components/ui/button";
import FadeIn from "@/components/animations/FadeIn";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Info } from "lucide-react";
import { useUserOnboarding } from "@/components/onboarding/UserOnboardingProvider";
import { useAuth } from "@/contexts/auth";

const HeroSection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showOnboardingTour } = useUserOnboarding();
  
  return (
    <div className="relative px-4 py-20 md:py-28 lg:py-32 overflow-hidden">
      {/* Background styling */}
      <div
        className="absolute inset-0 w-full h-full bg-gradient-to-b from-indigo-50/5 to-slate-950/50"
        aria-hidden="true"
      />
      
      {/* Hero content */}
      <div className="container relative">
        <div className="mx-auto max-w-3xl text-center">
          <FadeIn delay="none">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              <span className="block text-white">
                Simplified CRM Migration
              </span>
              <span className="block text-brand-600 dark:text-brand-400 mt-1">
                Zero Complexity
              </span>
            </h1>
          </FadeIn>
          
          <FadeIn delay="100">
            <p className="mt-6 text-lg text-gray-300 leading-relaxed max-w-2xl mx-auto">
              QuillSwitch helps you effortlessly migrate between CRM systems with
              intelligent data mapping, validation, and transformation tools.
            </p>
          </FadeIn>
          
          <FadeIn delay="200">
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                size="lg"
                onClick={() => navigate(user ? "/welcome" : "/auth")}
                className="gap-2 px-8 bg-brand-500 hover:bg-brand-600"
              >
                {user ? "Go to Dashboard" : "Get Started"} <ArrowRight size={16} />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                onClick={user ? showOnboardingTour : () => navigate("/features")}
                className="gap-2 px-8 bg-white/10 hover:bg-white/20 text-white border-white/20 hover:border-white/30"
              >
                {user ? "Take a Tour" : "Learn More"} <Info size={16} />
              </Button>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
