
import React from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Play, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import PremiumHeroBackground from "./hero/PremiumHeroBackground";
import EnhancedAnimatedHeadline from "./hero/EnhancedAnimatedHeadline";
import PremiumQuickStartCTA from "./hero/PremiumQuickStartCTA";
import { FloatingElement } from "@/components/animations/InteractiveElements";

const HomeHero = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const handleLearnMore = () => {
    if (user) {
      navigate("/app/migrations");
    } else {
      navigate("/about");
    }
  };
  
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Premium Animated Background */}
      <PremiumHeroBackground />

      <div className="container relative z-10 max-w-6xl mx-auto px-4 text-center">
        <div className="mb-12">
          {/* Premium trust badge */}
          <FloatingElement delay={0}>
            <div className="inline-flex items-center gap-3 px-6 py-3 mb-8 text-sm font-medium rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 text-blue-300 backdrop-blur-xl shadow-2xl">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-400"></span>
              </span>
              <span className="bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent font-semibold">
                Enterprise-grade • SOC 2 compliant • 99.9% uptime
              </span>
            </div>
          </FloatingElement>
          
          {/* Enhanced animated headline */}
          <FloatingElement delay={0.1}>
            <EnhancedAnimatedHeadline />
          </FloatingElement>
          
          <FloatingElement delay={0.2}>
            <p className="text-xl md:text-2xl text-slate-300 leading-relaxed max-w-4xl mx-auto mb-12 opacity-90">
              Transform your CRM migration experience with{" "}
              <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent font-semibold">
                AI-powered precision
              </span>
              ,{" "}
              <span className="bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent font-semibold">
                enterprise security
              </span>
              , and{" "}
              <span className="bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent font-semibold">
                zero-downtime execution
              </span>
            </p>
          </FloatingElement>
          
          <FloatingElement delay={0.3}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12">
              <PremiumQuickStartCTA />
              
              <div className="relative group">
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => navigate("/demo")}
                  className="gap-3 px-8 py-6 text-lg bg-slate-800/50 text-slate-200 border-slate-600 hover:bg-slate-700/50 hover:border-slate-500 transition-all duration-300 hover:scale-105 backdrop-blur-sm"
                >
                  <Play size={20} /> 
                  Experience Demo
                </Button>
              </div>
            </div>
          </FloatingElement>
          
          {/* Enhanced key benefits with premium animations */}
          <FloatingElement delay={0.4}>
            <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4 text-slate-400 mb-16">
              {[
                { text: "Zero Data Loss", icon: CheckCircle2, color: "text-green-400" },
                { text: "99.9% AI Accuracy", icon: CheckCircle2, color: "text-blue-400" },
                { text: "Enterprise Security", icon: CheckCircle2, color: "text-purple-400" },
                { text: "24/7 Expert Support", icon: CheckCircle2, color: "text-yellow-400" }
              ].map((benefit, index) => (
                <FloatingElement key={index} delay={0.5 + index * 0.1}>
                  <div className="flex items-center gap-3 group cursor-default">
                    <benefit.icon size={20} className={`${benefit.color} group-hover:scale-110 transition-transform duration-300`} />
                    <span className="text-lg font-medium group-hover:text-white transition-colors duration-300">
                      {benefit.text}
                    </span>
                  </div>
                </FloatingElement>
              ))}
            </div>
          </FloatingElement>
        </div>
        
        {/* Premium stats section */}
        <FloatingElement delay={0.6}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: "2M+", label: "Records Migrated", gradient: "from-blue-400 to-blue-600" },
              { value: "99.9%", label: "Success Rate", gradient: "from-green-400 to-green-600" },
              { value: "95%", label: "Time Savings", gradient: "from-purple-400 to-purple-600" },
              { value: "SOC 2", label: "Compliance", gradient: "from-yellow-400 to-yellow-600" }
            ].map((stat, index) => (
              <FloatingElement key={index} delay={0.7 + index * 0.1}>
                <div className="relative group p-6 rounded-xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm hover:border-slate-700 transition-all duration-300 hover:transform hover:-translate-y-1">
                  <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-gradient-to-br from-blue-500 to-purple-600" />
                  <div className="relative">
                    <div className={`text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-br ${stat.gradient} bg-clip-text text-transparent`}>
                      {stat.value}
                    </div>
                    <div className="text-slate-400 group-hover:text-slate-300 transition-colors duration-300">
                      {stat.label}
                    </div>
                  </div>
                </div>
              </FloatingElement>
            ))}
          </div>
        </FloatingElement>
      </div>
    </section>
  );
};

export default HomeHero;
