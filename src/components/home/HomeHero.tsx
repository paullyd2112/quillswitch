
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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-50">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgb(148_163_184_/_0.15)_1px,transparent_0)] [background-size:24px_24px]" />

      <div className="container relative z-10 max-w-6xl mx-auto px-6 py-32">
        <div className="space-y-12">
          {/* Badge */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-900 text-slate-50 text-xs font-medium">
              <Shield className="h-3.5 w-3.5" />
              100% Data Integrity
            </div>
          </div>
          
          {/* Main headline */}
          <div className="space-y-6 text-center">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 leading-[1.1]">
              CRM Migration Done Right
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Move your data in days, not months. No downtime, no data loss, no $50K consultant bill.
            </p>
          </div>
          
          {/* CTA */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3">
            <Button
              size="lg"
              onClick={handleGetStarted}
              className="px-8 py-6 bg-slate-900 hover:bg-slate-800 text-white font-medium transition-colors"
            >
              Start Free Migration
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/pricing")}
              className="px-8 py-6 border-slate-300 text-slate-700 hover:bg-slate-100 font-medium"
            >
              View Pricing
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-slate-500">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-slate-400" />
              <span>No credit card</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-slate-400" />
              <span>5 min setup</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-slate-400" />
              <span>Cancel anytime</span>
            </div>
          </div>

          {/* Stats section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-16 max-w-4xl mx-auto">
            {[
              { value: "95%", label: "Time Saved" },
              { value: "0", label: "Downtime" },
              { value: "$50K+", label: "Cost Savings" },
              { value: "100%", label: "Accuracy" }
            ].map((stat, index) => (
              <div 
                key={index}
                className="p-6 text-center border border-slate-200 bg-white"
              >
                <div className="text-3xl font-bold text-slate-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-xs text-slate-500 uppercase tracking-wide">
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
