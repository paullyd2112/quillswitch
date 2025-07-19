
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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ background: 'hsl(var(--background))' }}>
      {/* Animated Neural Network Background */}
      <HeroBackground />
      
      {/* Premium gradient overlays */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-br from-primary/10 to-primary/5 rounded-full blur-[100px] animate-premium-float" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-primary/8 to-primary/3 rounded-full blur-[120px] animate-premium-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-r from-primary/5 to-primary/10 rounded-full blur-[150px] animate-premium-float" style={{ animationDelay: '4s' }} />
      </div>

      <div className="container relative z-10 max-w-6xl mx-auto px-4 text-center">
        <div className="mb-12">
          {/* Premium Data Protection Badge */}
          <div className="badge-premium mb-12 text-primary animate-premium-fade-in">
            <Shield className="h-5 w-5" />
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="font-semibold text-foreground">100% Data Protection Guarantee</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">Zero Data Loss • Enterprise Security • GDPR Compliant</span>
          </div>
          
          {/* Premium animated headline */}
          <div className="animate-premium-fade-in delay-200">
            <AnimatedHeadline />
          </div>
          
          <p className="text-xl md:text-2xl leading-relaxed max-w-4xl mx-auto mb-12 opacity-90 animate-premium-fade-in delay-400" style={{ color: 'hsl(var(--muted-foreground))' }}>
            Migrate your CRM data with <span className="text-premium-gradient font-semibold">unprecedented accuracy</span>, 
            <span className="text-primary font-semibold"> enterprise security</span>, and 
            <span className="text-hero-gradient font-semibold"> AI-powered speed</span>. Effortlessly.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12 animate-premium-fade-in delay-600">
            <div className="btn-premium-primary interactive-premium animate-premium-glow" onClick={handleGetStarted}>
              {user ? "Start New Migration" : "Start Free Migration Analysis"}
            </div>
            
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate("/demo")}
              className="gap-2 px-8 py-6 text-lg glass-panel interactive-premium hover:border-primary/30"
            >
              <Play size={20} /> Experience Demo
            </Button>
          </div>
          
          {/* Premium key benefits with enhanced animations */}
          <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4">
            {[
              { text: "No Data Loss Guaranteed", delay: "800ms" },
              { text: "99.9% AI Accuracy", delay: "1000ms" },
              { text: "Enterprise Security", delay: "1200ms" },
              { text: "Zero Technical Skills", delay: "1400ms" }
            ].map((benefit, index) => (
              <div 
                key={index} 
                className="flex items-center gap-2 opacity-0 animate-premium-fade-in"
                style={{ animationDelay: benefit.delay, animationFillMode: 'forwards' }}
              >
                <CheckCircle2 size={20} className="text-primary" />
                <span className="text-lg font-medium text-foreground">{benefit.text}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Premium stats section with enhanced design */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto">
          {[
            { value: "99.9%", label: "Data Accuracy Rate" },
            { value: "95%", label: "Time Savings" },
            { value: "24/7", label: "Expert Support" }
          ].map((stat, index) => (
            <div 
              key={index} 
              className={`stats-card-premium interactive-premium animate-premium-fade-in delay-${1600 + (index * 200)}`}
            >
              <div className="text-4xl md:text-5xl font-bold mb-3 text-premium-gradient font-display">
                {stat.value}
              </div>
              <div className="text-muted-foreground font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeHero;
