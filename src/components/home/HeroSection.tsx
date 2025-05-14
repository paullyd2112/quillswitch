
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
    <div className="relative px-6 py-24 md:py-36 lg:py-40 overflow-hidden hero-gradient">
      <div className="absolute top-0 left-0 w-full h-full z-0 opacity-20">
        <div className="absolute top-20 right-[10%] w-64 h-64 rounded-full bg-tech-accent/10 filter blur-3xl animate-float"></div>
        <div className="absolute bottom-20 left-[15%] w-80 h-80 rounded-full bg-tech-highlight/10 filter blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
      </div>
      
      <div className="container relative z-10">
        <div className="mx-auto max-w-3xl text-center">
          <FadeIn delay="none">
            <h1 className="text-5xl font-semibold tracking-tight sm:text-6xl md:text-7xl">
              <span className="block text-tech-text-primary">
                Simplified CRM Migration
              </span>
              <span className="block text-tech-accent mt-2">
                Zero Complexity
              </span>
            </h1>
          </FadeIn>
          
          <FadeIn delay="100">
            <p className="mt-8 text-xl md:text-2xl text-tech-text-secondary leading-relaxed max-w-2xl mx-auto">
              QuillSwitch helps you effortlessly migrate between CRM systems with
              intelligent data mapping, validation, and transformation tools.
            </p>
          </FadeIn>
          
          <FadeIn delay="200">
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-5">
              <Button 
                size="lg"
                onClick={() => navigate(user ? "/welcome" : "/auth")}
                className="btn-tech-primary w-full sm:w-auto text-lg px-8 py-4 h-auto"
              >
                {user ? "Go to Dashboard" : "Get Started"} <ArrowRight size={18} className="ml-2" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate("/demo")}
                className="btn-tech-secondary w-full sm:w-auto text-lg px-8 py-4 h-auto"
              >
                <Play size={18} className="mr-2" /> See Live Demo
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                onClick={user ? showOnboardingTour : () => navigate("/features")}
                className="btn-tech-outline w-full sm:w-auto text-lg px-8 py-4 h-auto"
              >
                {user ? "Take a Tour" : "Learn More"} <Info size={18} className="ml-2" />
              </Button>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
