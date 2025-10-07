
import React from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Shield, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import HeroBackground from "./hero/HeroBackground";

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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50" />
      
      {/* Decorative elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl" />

      <div className="container relative z-10 max-w-7xl mx-auto px-4 py-20">
        <div className="text-center space-y-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-100 border-2 border-blue-200 text-sm font-semibold text-blue-700 shadow-sm">
            <Shield className="h-4 w-4" />
            <span>100% Data Integrity Guaranteed</span>
          </div>
          
          {/* Main headline */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-slate-900 leading-[1.05] max-w-5xl mx-auto">
            Move Your CRM Data{" "}
            <span className="relative inline-block">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600">
                Without the Chaos
              </span>
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 10C50 5 100 2 150 5C200 8 250 7 298 10" stroke="url(#gradient)" strokeWidth="3" strokeLinecap="round"/>
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#9333EA" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-medium">
            Enterprise-grade migration in days, not months. Keep selling while we handle the tech complexity.
          </p>
          
          {/* CTA */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-6">
            <Button
              size="lg"
              onClick={handleGetStarted}
              className="text-lg px-10 py-7 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-bold shadow-xl shadow-blue-600/30 hover:shadow-blue-600/50 transition-all hover:scale-105"
            >
              Start Free Migration <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/pricing")}
              className="text-lg px-10 py-7 border-2 border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl font-bold"
            >
              View Pricing
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 pt-6 text-sm font-medium text-slate-600">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <span>No credit card</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <span>5 min setup</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <span>Cancel anytime</span>
            </div>
          </div>

          {/* Stats section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-20 max-w-6xl mx-auto">
            {[
              { value: "95%", label: "Time Saved", color: "from-blue-600 to-cyan-600" },
              { value: "Zero", label: "Downtime", color: "from-green-600 to-emerald-600" },
              { value: "$50K+", label: "Cost Savings", color: "from-purple-600 to-pink-600" },
              { value: "100%", label: "Accuracy", color: "from-orange-600 to-red-600" }
            ].map((stat, index) => (
              <div 
                key={index}
                className="group p-8 rounded-2xl bg-white border-2 border-slate-200 hover:border-slate-300 hover:shadow-2xl transition-all hover:-translate-y-2 duration-300"
              >
                <div className={`text-4xl md:text-5xl font-black mb-3 bg-clip-text text-transparent bg-gradient-to-br ${stat.color}`}>
                  {stat.value}
                </div>
                <div className="text-sm font-bold text-slate-600 uppercase tracking-wide">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeHero;
