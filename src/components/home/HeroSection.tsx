
import React from "react";
import { Button } from "@/components/ui/button";
import FadeIn from "@/components/animations/FadeIn";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Info, Play } from "lucide-react";
import { useUserOnboarding } from "@/components/onboarding/UserOnboardingProvider";
import { useAuth } from "@/contexts/auth";

const HeroSection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showOnboardingTour } = useUserOnboarding();
  
  return (
    <div className="relative px-4 py-20 md:py-28 lg:py-32 overflow-hidden">
      <div
        className="absolute inset-0 w-full h-full bg-gradient-to-b from-indigo-50/5 to-slate-950/50"
        aria-hidden="true"
      />
      
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
                className="gap-2 px-8 bg-slate-200 text-black hover:bg-slate-300"
              >
                {user ? "Go to Dashboard" : "Get Started"} <ArrowRight size={16} />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate("/demo")}
                className="gap-2 px-8 bg-slate-200 text-black border-slate-300 hover:bg-slate-300 hover:border-slate-400"
              >
                <Play size={16} className="mr-1" /> See Live Demo
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                onClick={user ? showOnboardingTour : () => navigate("/features")}
                className="gap-2 px-8 bg-transparent text-slate-200 border-slate-500 hover:bg-slate-800/50 hover:border-slate-400"
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
