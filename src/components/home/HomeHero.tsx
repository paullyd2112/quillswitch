
import React from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Play, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import HeroBackground from "./hero/HeroBackground";
import AnimatedHeadline from "./hero/AnimatedHeadline";
import GlowingCTA from "./hero/GlowingCTA";

const HomeHero = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const handleGetStarted = () => {
    if (user) {
      navigate("/app/setup");
    } else {
      navigate("/auth");
    }
  };
  
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-950">
      {/* Animated Neural Network Background */}
      <HeroBackground />
      
      {/* Gradient overlays */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[60px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[80px]" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] bg-blue-400/3 rounded-full blur-[100px]" />
      </div>

      <div className="container relative z-10 max-w-6xl mx-auto px-4 text-center">
        <div className="mb-12">
          {/* Data Protection Guarantee with simplified messaging */}
          <div className="inline-flex items-center gap-3 px-6 py-3 mb-8 text-sm font-medium rounded-full bg-gradient-to-r from-blue-500/10 to-blue-600/10 border border-blue-500/20 text-blue-400 backdrop-blur-sm">
            <Shield className="h-5 w-5 text-blue-400" />
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span className="font-semibold">Zero Data Loss Promise</span>
            <span className="text-slate-300">•</span>
            <span>Your data arrives safely, every time</span>
          </div>
          
          {/* Updated headline */}
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-8 leading-tight">
            <span className="block text-white mb-2">
              Switch CRMs
            </span>
            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600">
              Without The Stress
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-300 leading-relaxed max-w-4xl mx-auto mb-12 opacity-90">
            Finally, a CRM migration that <span className="text-blue-400 font-semibold">keeps your business running</span>, 
            <span className="text-blue-300 font-semibold"> protects your customer data</span>, and 
            <span className="text-blue-500 font-semibold"> gets done fast</span>. No tech headaches.
          </p>
          
          <div className="flex justify-center mb-12">
            <GlowingCTA onClick={handleGetStarted}>
              Get Started
            </GlowingCTA>
          </div>
          
          {/* Simplified key benefits */}
          <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4 text-slate-400">
            {[
              { text: "Business Keeps Running", delay: "0ms" },
              { text: "No Data Loss", delay: "200ms" },
              { text: "Done in Days", delay: "400ms" },
              { text: "No Tech Skills Needed", delay: "600ms" }
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
        
        {/* Updated stats section with business-focused metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto">
          {[
            { value: "95%", label: "Time Savings vs Traditional Methods" },
            { value: "Zero", label: "Business Downtime Required" },
            { value: "24/7", label: "Support When You Need It" }
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
