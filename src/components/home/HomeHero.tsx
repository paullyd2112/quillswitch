
import React from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Play, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import HeroBackground from "./hero/HeroBackground";
import AnimatedHeadline from "./hero/AnimatedHeadline";
import QuickStartCTA from "./hero/QuickStartCTA";

const HomeHero = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const handleLearnMore = () => {
    if (user) {
      // If user is logged in, navigate to migrations page where onboarding is available
      navigate("/app/migrations");
    } else {
      // If user is not logged in, navigate to about page
      navigate("/about");
    }
  };
  
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-950">
      {/* Animated Neural Network Background */}
      <HeroBackground />
      
      {/* Gradient overlays */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-400/5 rounded-full blur-[200px]" />
      </div>

      <div className="container relative z-10 max-w-6xl mx-auto px-4 text-center">
        <div className="mb-12">
          {/* Trust badge with pulsing animation */}
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 text-sm font-medium rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Complete migration in just 5 steps • Takes 10-15 minutes
          </div>
          
          {/* Animated headline with shimmer effect */}
          <AnimatedHeadline />
          
          <p className="text-xl md:text-2xl text-slate-300 leading-relaxed max-w-4xl mx-auto mb-12 opacity-90">
            Migrate your CRM data with <span className="text-blue-400 font-semibold">unprecedented accuracy</span>, 
            <span className="text-blue-300 font-semibold"> enterprise security</span>, and 
            <span className="text-blue-500 font-semibold"> AI-powered speed</span>. Effortlessly.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12">
            <QuickStartCTA />
            
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate("/demo")}
              className="gap-2 px-8 py-6 text-lg bg-transparent text-slate-200 border-slate-600 hover:bg-slate-800 hover:border-slate-500 transition-all duration-300 hover:scale-105"
            >
              <Play size={20} /> Experience Demo
            </Button>
          </div>
          
          {/* Enhanced key benefits with animations */}
          <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4 text-slate-400">
            {[
              { text: "No Data Loss Guaranteed", delay: "0ms" },
              { text: "99.9% AI Accuracy", delay: "200ms" },
              { text: "Enterprise Security", delay: "400ms" },
              { text: "Zero Technical Skills", delay: "600ms" }
            ].map((benefit, index) => (
              <div 
                key={index} 
                className="flex items-center gap-2 opacity-0 animate-fade-in"
                style={{ animationDelay: benefit.delay, animationFillMode: 'forwards' }}
              >
                <CheckCircle2 size={20} className="text-blue-400" />
                <span className="text-lg font-medium">{benefit.text}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Enhanced stats section with blue gradient effects */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
          {[
            { value: "500+", label: "Successful Migrations" },
            { value: "99.9%", label: "Data Accuracy Rate" },
            { value: "95%", label: "Time Savings" },
            { value: "24/7", label: "Expert Support" }
          ].map((stat, index) => (
            <div 
              key={index} 
              className="relative p-6 rounded-lg bg-slate-900/50 border border-slate-800 backdrop-blur-sm hover:border-slate-700 transition-all duration-300 hover:transform hover:-translate-y-1 group"
            >
              <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-gradient-to-br from-blue-500 to-blue-600" />
              <div className="relative">
                <div className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-br from-blue-400 to-blue-600 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-slate-400">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeHero;
