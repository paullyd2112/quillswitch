
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
          
          {/* The QuillSwitch Advantage */}
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-12">
              The QuillSwitch Advantage
            </h2>
            
            {/* Four key benefit boxes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {[
                {
                  stat: "95%",
                  title: "Time Savings vs. Traditional Methods",
                  subtitle: "Done in Days. Automate weeks of manual effort.",
                  delay: "0ms"
                },
                {
                  stat: "Zero",
                  title: "Business Downtime Required",
                  subtitle: "Your business keeps running without interruption.",
                  delay: "200ms"
                },
                {
                  stat: "24/7",
                  title: "Expert Support When You Need It",
                  subtitle: "No tech skills needed. We're here to guide you.",
                  delay: "400ms"
                },
                {
                  stat: "100%",
                  title: "Data Integrity & Accuracy",
                  subtitle: "No data loss. Your critical information is secure.",
                  delay: "600ms"
                }
              ].map((benefit, index) => (
                <div 
                  key={index}
                  className="relative p-8 rounded-lg bg-slate-900/50 border border-slate-800 backdrop-blur-sm hover:border-slate-700 transition-all duration-300 hover:transform hover:-translate-y-1 group opacity-0 animate-fade-in"
                  style={{ animationDelay: benefit.delay, animationFillMode: 'forwards' }}
                >
                  <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-gradient-to-br from-blue-500 to-blue-600" />
                  <div className="relative text-center">
                    <div className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-br from-blue-400 to-blue-600 bg-clip-text text-transparent">
                      {benefit.stat}
                    </div>
                    <div className="text-xl font-semibold text-white mb-2">
                      {benefit.title}
                    </div>
                    <div className="text-slate-400 text-sm">
                      {benefit.subtitle}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Concluding statement */}
          <div className="text-center mt-12">
            <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent">
              Finally, CRM Migration That Works
            </h3>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeHero;
