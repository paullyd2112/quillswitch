
import React from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Play } from "lucide-react";
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
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-cyan-500/5 rounded-full blur-[200px]" />
      </div>

      <div className="container relative z-10 max-w-6xl mx-auto px-4 text-center">
        <div className="mb-12">
          {/* Trust badge with pulsing animation */}
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 text-sm font-medium rounded-full bg-primary/10 border border-primary/20 text-primary backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Trusted by 500+ businesses for seamless CRM migrations
          </div>
          
          {/* Animated headline with shimmer effect */}
          <AnimatedHeadline />
          
          <p className="text-xl md:text-2xl text-slate-300 leading-relaxed max-w-4xl mx-auto mb-12 opacity-90">
            Migrate your CRM data with <span className="text-primary font-semibold">unprecedented accuracy</span>, 
            <span className="text-cyan-400 font-semibold"> enterprise security</span>, and 
            <span className="text-purple-400 font-semibold"> AI-powered speed</span>. Effortlessly.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12">
            <GlowingCTA onClick={handleGetStarted}>
              {user ? "Start New Migration" : "Start Free Migration Analysis"}
            </GlowingCTA>
            
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
                <CheckCircle2 size={20} className="text-green-400" />
                <span className="text-lg font-medium">{benefit.text}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Enhanced stats section with glow effects */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
          {[
            { value: "500+", label: "Successful Migrations", gradient: "from-blue-500 to-cyan-500" },
            { value: "99.9%", label: "Data Accuracy Rate", gradient: "from-green-500 to-emerald-500" },
            { value: "95%", label: "Time Savings", gradient: "from-purple-500 to-pink-500" },
            { value: "24/7", label: "Expert Support", gradient: "from-yellow-500 to-orange-500" }
          ].map((stat, index) => (
            <div 
              key={index} 
              className="relative p-6 rounded-lg bg-slate-900/50 border border-slate-800 backdrop-blur-sm hover:border-slate-700 transition-all duration-300 hover:transform hover:-translate-y-1 group"
            >
              <div className={`absolute inset-0 rounded-lg opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-gradient-to-br ${stat.gradient}`} />
              <div className="relative">
                <div className={`text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-br ${stat.gradient} bg-clip-text text-transparent`}>
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
